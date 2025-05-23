'use client';

import { useEffect, useState } from 'react';
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

export default function QuizPage() {
  // LOCAL STATE
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CUSTOM HOOKS
  const { user, isHost, setIsHost } = useAuth();
  const { socket, disconnect } = useWebSocket();
  const { sessionId, clearSession, players, setPlayers } = useSession();
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

  // SOCKET EVENT LISTENERS
  useEffect(() => {
    if (!socket) return;

    // RECEIVE QUESTION
    socket.on('new-question', (data) => {
      setLockedIn(false);
      setCurrentIndex(data.index);
      setCurrentQuestion(data.question);
      setTotalQuestions(data.total);
      setLoading(false);
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
    };
  }, [socket, setPlayers, disconnect, resetQuiz, clearSession, router, setCurrentIndex]);

  // HANDLE ANSWER SUBMISSION
  const handleAnswer = (answer: string): void => {
    socket?.emit('submit-answer', {
      sessionId,
      id: user!.id,
      answer,
    });
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
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
      {currentQuestion && !isHost ? (
        <QuizModule
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onSubmit={handleAnswer}
        />
      ) : (
        // TODO: ADD LOGIC TO DIFFERENTIATE BETWEEN 'WAITING' NOTICE AND LEADERBOARD
        <div className='text-white'>Waiting for host to start the quiz...</div>
      )}

      {loading && <p className='mt-4 text-black'>Waiting for next question...</p>}

      {/* PLAYER SCOREBOARD */}
      {isHost && <Leaderboard />}

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

      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
