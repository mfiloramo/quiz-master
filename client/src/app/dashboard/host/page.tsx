'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';
import { useToast } from '@/contexts/ToastContext';

export default function HostPage() {
  // STATE HOOKS
  const [roundTimer, setRoundTimer] = useState<number>(15);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);

  // CONTEXT/CUSTOM HOOKS
  const router = useRouter();
  const { socket } = useWebSocket();
  const { setSessionId } = useSession();
  const { setIsHost, user } = useAuth();
  const { selectedQuiz } = useQuiz();
  const { toastError } = useToast();

  // CREATE A NEW GAME SESSION
  const createSession = () => {
    // VALIDATE SELECTED QUIZ
    if (!selectedQuiz) {
      toastError('No quiz is selected. Please select a quiz before hosting.');
      return;
    }

    // GENERATE SESSION ID
    const sessionId = Math.floor(1000 + Math.random() * 9000).toString();

    // EMIT CREATE-SESSION EVENT
    socket?.emit('create-session', {
      sessionId,
      hostUserName: user!.username,
      quizId: selectedQuiz.id,
      roundTimer,
      shuffleQuestions,
    });

    // SET PAGE STATE
    setSessionId(sessionId);
    setIsHost(true);

    // ROUTE TO LOBBY
    router.push('/dashboard/lobby');
  };

  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center justify-center'>
      {/* INNER CONTAINER */}
      <h1 className='mb-10 text-5xl font-bold'>Host Quiz</h1>

      {/* SESSION CONFIGURATION CONTAINER */}
      <h2 className='mb-2 text-2xl'>Game Session Options</h2>
      <div
        className={'flex h-fit w-[70vw] max-w-2xl flex-col rounded-xl bg-slate-400 p-3 shadow-xl'}
      >
        {/* ROUND TIMER CONFIGURATION */}
        <div className={'my-2 flex flex-row justify-between rounded bg-slate-300 p-3 px-6 py-4'}>
          ⏲️ Round Timer (seconds)
          <select
            value={roundTimer}
            onChange={(e) => setRoundTimer(parseInt(e.target.value))}
            className={'ml-2 rounded bg-slate-50'}
          >
            {Array.from({ length: 51 }, (_, i) => i + 10).map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* SHUFFLE QUESTIONS OPTION */}
        <div className={'my-2 flex flex-row justify-between rounded bg-slate-300 p-3 px-6 py-4'}>
          🎲 Shuffle Questions
          <input
            className={'h-6 w-6'}
            type={'checkbox'}
            checked={shuffleQuestions}
            onChange={(e) => setShuffleQuestions(e.target.checked)}
          />
        </div>
      </div>

      {/* START/CANCEL BUTTONS */}
      <div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.001 }}
          onClick={createSession}
          className='my-4 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-400 active:bg-blue-500'
        >
          Create Session
        </motion.button>
      </div>
    </div>
  );
}
