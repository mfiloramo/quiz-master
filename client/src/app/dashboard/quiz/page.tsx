'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import QuizModule from '@/components/QuizModule/QuizModule';
import Leaderboard from '@/components/Leaderboard/Leaderboard';
import PlayerAnswerSummary from '@/components/PlayerAnswerSummary/PlayerAnswerSummary';
import PlayerAnswersGraph from '@/components/player-answers-graph/player-answers-graph';
import FinalScoreboard from '@/components/FinalScoreboard/FinalScoreboard';
import BackgroundMusic from '@/components/BackgroundMusic/BackgroundMusic';
import HostQuestionDisplay from '@/components/HostQuestionDisplay/HostQuestionDisplay';
import { QuizPhase } from '@/enums/QuizPhase.enum';
import { QuizQuestion, QuizSession } from '@/types/Quiz.types';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { motion } from 'framer-motion';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import useSound from 'use-sound';

// PAGE CONSTANTS
const colorMap: string[] = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];

// QUIZ BACKGROUND MUSIC TRACKS
const quizTracks = ['/audio/countdown-a.mp3', '/audio/countdown-b.mp3'];

export default function QuizPage(): JSX.Element {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [roundTimerSetting, setRoundTimerSetting] = useState<number | null>(null);
  const [phase, setPhase] = useState<QuizPhase>(QuizPhase.Question);
  const [error] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [playerAnswers, setPlayerAnswers] = useState<string[]>([]);
  const [musicKey, setMusicKey] = useState<number>(Date.now());
  const [press] = useState<boolean>(false);

  // CUSTOM HOOKS/CONTEXTS
  const router = useRouter();
  const { user, isHost, setIsHost } = useAuth();
  const { socket, disconnect } = useWebSocket();
  const { sessionId, clearSession, setPlayers } = useSession();
  const { currentIndex, setCurrentIndex, resetQuiz, setLockedIn } = useQuiz();

  // MOUNT GONG SOUND
  const [playGong, { sound: gongSound }] = useSound('/audio/gong-sound.mp3', { volume: 0.1 });

  // ON MOUNT, REQUEST CURRENT QUESTION
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-current-question', { sessionId });
  }, [socket, sessionId]);

  // ON MOUNT, REQUEST PLAYER LIST
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-players', { sessionId });
  }, [socket, sessionId]);

  // TIMER COUNTDOWN DURING QUESTION PHASE
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

  // PLAY GONG SOUND ONCE WHEN ENTERING LEADERBOARD PHASE
  useEffect(() => {
    if (phase === QuizPhase.AnswerSummary && isHost) {
      playGong(); // PLAY GONG ONCE
    }

    // STOP GONG WHEN RETURNING TO QUESTION PHASE
    if (phase !== QuizPhase.AnswerSummary && phase !== QuizPhase.Leaderboard) {
      gongSound?.stop();
    }
  }, [phase, playGong, gongSound, isHost]);

  // HANDLE SOCKET EVENTSu
  useEffect(() => {
    // VALIDATE SOCKET
    if (!socket) return;

    // NEW QUESTION EMITTED FROM SERVER
    socket.on('new-question', (data: QuizSession) => {
      const { index, question, total, roundTimer } = data;
      const seconds = Math.floor(roundTimer / 1000);
      setRoundTimerSetting(seconds);
      setSecondsLeft(seconds);

      setLockedIn(false);
      setCurrentIndex(index);
      setCurrentQuestion(question);
      setTotalQuestions(total);
      setPhase(QuizPhase.Question);
      setLoading(false);
      setUserAnswer(null); // RESET USER ANSWER ON NEW QUESTION

      // FORCE MUSIC REMOUNT ON EACH QUESTION
      setMusicKey(Date.now());
    });

    // ALL PLAYERS ANSWERED
    socket.on('all-players-answered', (answers: string[] | undefined): void => {
      setSecondsLeft(null);
      setLoading(true);
      setPhase(QuizPhase.AnswerSummary);

      if (Array.isArray(answers)) {
        setPlayerAnswers(answers);
      } else {
        console.warn('Received undefined or invalid player answers from server:', answers);
        setPlayerAnswers([]);
      }
    });

    // PLAYER JOINED SESSION
    socket.on('player-joined', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    // PLAYER EJECTED FROM SESSION BY HOST
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard');
    });

    // SESSION ENDED
    socket.on('session-ended', () => {
      setPhase(QuizPhase.FinalScoreboard);

      const handleEnd = () => {
        alert('Session has ended.');
        disconnect();
        resetQuiz();
        clearSession();
        router.push('/dashboard');
      };

      const delay = isHost ? 8000 : 0;
      setTimeout(handleEnd, delay);
    });

    // CLEANUP SOCKET LISTENERS
    return () => {
      socket.off('new-question');
      socket.off('player-joined');
      socket.off('session-ended');
      socket.off('ejected-by-host');
      socket.off('all-players-answered');
    };
  }, [
    socket,
    setPlayers,
    disconnect,
    resetQuiz,
    clearSession,
    router,
    setCurrentIndex,
    sessionId,
    isHost,
    setLockedIn,
  ]);

  // PHASE-BASED PROGRESSION ENGINE
  useEffect(() => {
    // INITIALIZE NEW TIMER
    let timer: NodeJS.Timeout | number | null = null;
    const timeout: number = 5000;

    // PHASE: ANSWER SUMMARY -> LEADERBOARD
    if (phase === QuizPhase.AnswerSummary) {
      timer = setTimeout(() => setPhase(QuizPhase.Leaderboard), timeout);
      if (press) socket!.emit('skip', { sessionId });
    }

    // PHASE: LEADERBOARD -> NEXT QUESTION / FINAL SCORES
    if (phase === QuizPhase.Leaderboard) {
      timer = setTimeout(() => {
        setLoading(true);

        // ADVANCE TO NEXT QUESTION IF QUIZ STILL HAS QUESTIONS
        if (isHost) {
          socket?.emit('next-question', { sessionId });
        }
      }, 5000);
    }

    // CLEAR TIMER ON CLEANUP
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, socket, sessionId, isHost, press]);

  // HANDLE USER ANSWER
  const handleAnswer = (answer: string): void => {
    if (!user) return;
    setUserAnswer(answer);
    setPlayerAnswers((previousAnswers: string[]) => [...previousAnswers, answer]);
    socket?.emit('submit-answer', {
      sessionId,
      id: user.id,
      answer,
    });
    setLoading(true);
    if (isHost) {
      socket?.emit('get-current-question', { sessionId });
    }
  };

  // HANDLE HOST SKIPPING PHASE
  const handleSkip = (): void => {
    if (!isHost || !socket || !sessionId) return;

    switch (phase) {
      case QuizPhase.Question:
        socket.emit('skip-question', { sessionId });
        break;
      case QuizPhase.AnswerSummary:
        setPhase(QuizPhase.Leaderboard);
        break;
      case QuizPhase.Leaderboard:
        setLoading(true);
        socket.emit('next-question', { sessionId });
        break;
    }
  };

  // HANDLE LEAVING SESSION
  const handleLeave = (): void => {
    if (isHost) {
      setIsHost(false);
      socket?.emit('host-left', { sessionId });
    }

    disconnect();
    resetQuiz();
    clearSession();

    router.push('/dashboard');
  };

  // MAIN RENDER
  return (
    <div className='flex flex-col items-center justify-center'>
      {/* QUIZ BACKGROUND MUSIC (ONLY HOST PLAYS IT DURING QUESTION PHASE) */}
      {isHost && phase === QuizPhase.Question && (
        <BackgroundMusic key={musicKey} tracks={quizTracks} />
      )}

      {/* TODO: EXTRACT VIEW PHASE ENGINE AS COMPONENT */}
      {/* PLAYER QUESTION VIEW */}
      {phase === QuizPhase.Question && currentQuestion && !isHost && (
        <QuizModule
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onSubmit={handleAnswer}
        />
      )}

      {/* HOST QUESTION VIEW */}
      {phase === QuizPhase.Question && currentQuestion && isHost && (
        <HostQuestionDisplay
          question={currentQuestion.question}
          options={currentQuestion.options}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          colorMap={colorMap}
        />
      )}

      {/* PLAYER TIMER DISPLAY */}
      {phase === QuizPhase.Question && isHost && secondsLeft !== null && (
        <div className={'mt-8'}>
          <CountdownCircleTimer
            isPlaying
            duration={roundTimerSetting!}
            colors={['#3b8600', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
      )}

      {/* HOST ANSWER SUMMARY VIEW */}
      {phase === QuizPhase.AnswerSummary && currentQuestion && isHost && (
        <>
          <PlayerAnswersGraph playerAnswers={playerAnswers} options={currentQuestion.options} />
          <HostQuestionDisplay
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correct}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            colorMap={colorMap}
          />
        </>
      )}

      {/* PLAYER ANSWER SUMMARY */}
      {phase === QuizPhase.AnswerSummary && currentQuestion && !isHost && (
        <div className='min-w-2xl my-8 rounded-xl bg-white p-6 text-center text-2xl font-medium text-gray-900 shadow-md'>
          {userAnswer ? (
            <PlayerAnswerSummary userAnswer={userAnswer} correctAnswer={currentQuestion.correct} />
          ) : (
            <p>Time&apos;s up!</p>
          )}
        </div>
      )}

      {/* LEADERBOARD DISPLAY */}
      {phase === QuizPhase.Leaderboard && <Leaderboard />}

      {/* FINAL SCOREBOARD (HOST DISPLAY) */}
      {phase === QuizPhase.FinalScoreboard && isHost && <FinalScoreboard />}
      <div className={'flex flex-row items-center justify-between gap-3'}>
        {/* SKIP PHASE BUTTON */}
        {isHost && (
          <motion.button
            className='mt-7 h-16 w-40 rounded-lg bg-slate-100 font-bold text-black transition hover:bg-slate-200 active:bg-slate-300'
            onClick={handleSkip}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.005 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        )}

        {/* LEAVE/END BUTTON */}
        <motion.button
          className='mt-7 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
          onClick={handleLeave}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isHost ? 'End Game' : 'Leave Game'}
        </motion.button>
      </div>

      {/* ERROR DISPLAY */}
      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
