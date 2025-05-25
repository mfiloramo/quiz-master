'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import QuizModule from '@/components/quiz-module/quiz-module';
import { QuizQuestion } from '@/types/Quiz.types';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { motion } from 'framer-motion';
import Leaderboard from '@/components/leaderboard/Leaderboard';

const colorMap = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];

export default function QuizPage() {
  // LOCAL STATE
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(false); // CONTROLS GENERAL LOADING/WAITING STATE
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null); // CLIENT-SIDE TIMER
  const [roundComplete, setRoundComplete] = useState(false); // NEW: TRACK IF ROUND IS OVER
  const [showLeaderboard, setShowLeaderboard] = useState(false); // NEW: SHOW LEADERBOARD FLAG
  const [error, setError] = useState<string | null>(null); // TODO: DISPLAY TOAST ERROR ON ERROR

  // PAGE VARIABLES
  const leaderboardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // CUSTOM HOOKS
  const { user, isHost, setIsHost } = useAuth();
  const { socket, disconnect } = useWebSocket();
  const { sessionId, clearSession, setPlayers } = useSession();
  const { currentIndex, setCurrentIndex, resetQuiz, setLockedIn } = useQuiz();
  const router = useRouter();

  // REQUEST QUESTION ON INITIAL MOUNT
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-current-question', { sessionId });
  }, [socket, sessionId]);

  // REQUEST FULL PLAYER LIST ON INITIAL MOUNT (FOR MISSED JOIN EMITS)
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-players', { sessionId });
  }, [socket, sessionId]);

  // SHOW ROUND TIMER COUNTDOWN (CLIENT-SIDE)
  useEffect(() => {
    if (!loading && secondsLeft !== null) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev !== null && prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading, secondsLeft]);

  // SOCKET EVENT LISTENERS
  useEffect(() => {
    if (!socket) return;

    // RECEIVE QUESTION
    socket.on('new-question', (data) => {
      const { index, question, total, roundTimer } = data;
      setLockedIn(false);
      setCurrentIndex(index);
      setCurrentQuestion(question);
      setTotalQuestions(total);
      setRoundComplete(false); // RESET ROUND STATE
      setShowLeaderboard(false); // RESET LEADERBOARD STATE

      if (!isHost) {
        // CLEAR ANY EXISTING TIMEOUT
        if (leaderboardTimeoutRef.current) {
          clearTimeout(leaderboardTimeoutRef.current);
          leaderboardTimeoutRef.current = null;
        }

        // START CLIENT TIMER FOR PLAYER
        setSecondsLeft(roundTimer / 1000);
        setLoading(false); // SHOW QUESTION

        // SET TIMEOUT TO SHOW LEADERBOARD AFTER roundTimer
        leaderboardTimeoutRef.current = setTimeout(() => {
          setShowLeaderboard(true);
          setLoading(true);
          leaderboardTimeoutRef.current = null;
        }, roundTimer);
      } else {
        // HOST SHOULD SEE THE NEXT QUESTION IMMEDIATELY
        setLoading(false);
        setShowLeaderboard(false); // MAKE SURE LEADERBOARD IS HIDDEN
      }
    });

    // ALL PLAYERS ANSWERED EARLY
    socket.on('all-players-answered', () => {
      // CANCEL ANY PENDING TIMEOUT
      if (leaderboardTimeoutRef.current) {
        clearTimeout(leaderboardTimeoutRef.current);
        leaderboardTimeoutRef.current = null;
      }
      setRoundComplete(true); // ROUND ENDS EARLY
      setSecondsLeft(null);
      setShowLeaderboard(true);
      setLoading(true); // SHOW LEADERBOARD FOR HOST

      // DO NOT RESET TO QUESTION AFTER THIS TIMEOUT
      setTimeout(() => {
        // HOST STAYS IN SHOW-LEADERBOARD STATE UNTIL NEXT QUESTION
      }, 5000);
    });

    // RECEIVE UPDATED PLAYER LIST
    socket.on('player-joined', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    // PLAYER EJECTED BY HOST
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard');
    });

    // SESSION ENDED BY HOST DISCONNECT
    socket.on('session-ended', () => {
      alert('Session has ended.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard/');
    });

    // CLEANUP SOCKET LISTENERS
    return () => {
      socket.off('new-question');
      socket.off('player-joined');
      socket.off('session-ended');
      socket.off('ejected-by-host');
      socket.off('all-players-answered');

      // CLEAN UP CLIENT-SIDE TIMEOUT
      if (leaderboardTimeoutRef.current) {
        clearTimeout(leaderboardTimeoutRef.current);
        leaderboardTimeoutRef.current = null;
      }
    };
  }, [socket, setPlayers, disconnect, resetQuiz, clearSession, router, setCurrentIndex]);

  // HANDLE ANSWER SUBMISSION
  const handleAnswer = (answer: string): void => {
    socket?.emit('submit-answer', {
      sessionId,
      id: user!.id,
      answer,
    });
    setLoading(true); // PREVENT DOUBLE SUBMISSION
    if (isHost) {
      socket?.emit('get-current-question', { sessionId });
    }
  };

  // HANDLE USER LEAVING
  const handleLeave = (): void => {
    disconnect();
    resetQuiz();
    clearSession();
    if (isHost) setIsHost(false);
    router.push('/dashboard');
  };

  // RENDER
  return (
    <div className='flex flex-col items-center justify-center'>
      {/* RENDER QUIZ MODULE IF NOT THE HOST */}
      {currentQuestion && !isHost && !loading && !roundComplete && (
        <QuizModule
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onSubmit={handleAnswer}
        />
      )}

      {/* TODO: EXTRACT BELOW TO MODULE */}
      {/* DISPLAY CURRENT ROUND QUESTION & CHOICES (HOST ONLY) */}
      {!loading && currentQuestion && isHost && !roundComplete && (
        <div
          className={
            'my-8 max-w-2xl rounded-xl bg-slate-200 p-7 text-center text-5xl font-bold text-slate-900 shadow-xl'
          }
        >
          <h2 className='mb-2 text-xl font-bold text-gray-700'>
            Question {currentIndex + 1} / {totalQuestions}
          </h2>
          <div className='mb-8 w-full rounded-lg bg-sky-100 p-6 text-center text-2xl font-bold text-black shadow-md'>
            {<div>{currentQuestion.question}</div>}
          </div>
          <div className='grid w-full grid-cols-2 gap-3'>
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 text-lg font-bold text-white shadow-md transition-all duration-200 ${colorMap[index % colorMap.length]}`}
              >
                {option}
              </div>
            ))}
          </div>
          {/* TODO: DISPLAY ANSWER CHOICES */}
        </div>
      )}

      {/* DISPLAY TIMER (PLAYER ONLY) */}
      {!loading && !isHost && secondsLeft !== null && (
        <div className='my-4 text-xl text-white'>Time Left: {secondsLeft}s</div>
      )}

      {/* DISPLAY LEADERBOARD WHEN ROUND ENDS */}
      {showLeaderboard && isHost && <Leaderboard />}

      {/* LEAVE/END GAME BUTTON */}
      <motion.button
        className='mt-12 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
        onClick={handleLeave}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.005 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isHost ? 'End Game' : 'Leave Game'}
      </motion.button>

      {/* ERROR MESSAGE */}
      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
