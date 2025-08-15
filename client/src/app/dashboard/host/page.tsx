'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';

export default function HostPage() {
  // STATE HOOKS
  const [error, setError] = useState<string>('');
  const [roundTimer, setRoundTimer] = useState<number>(15);

  // CUSTOM HOOKS
  const router = useRouter();
  const { socket } = useWebSocket();
  const { setSessionId } = useSession();
  const { setIsHost, user } = useAuth();
  const { selectedQuiz } = useQuiz();

  // CREATE A NEW GAME SESSION
  const createSession = () => {
    // VALIDATE SELECTED QUIZ
    if (!selectedQuiz) {
      setError('Please select a quiz before hosting.');
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
    });

    // SET PAGE STATE
    setSessionId(sessionId);
    setIsHost(true);

    // ROUTE TO LOBBY
    router.push('/dashboard/lobby');
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-6 text-5xl font-bold'>Host Quiz</h1>
      <h2 className='mb-6 text-xl'>Game Session Configuration Options</h2>

      {/* CONFIGURATION WINDOW */}
      <div
        className={
          'flex h-[40vh] w-[70vw] max-w-2xl flex-col rounded-xl bg-slate-400 p-3 shadow-xl'
        }
      >
        {/* ROUND TIMER CONFIGURATION */}
        <div className={'my-2 flex flex-row justify-between rounded bg-slate-300 p-3 px-6 py-4'}>
          Round Timer (seconds)
          <select
            value={roundTimer}
            onChange={(e) => setRoundTimer(parseInt(e.target.value))}
            className={'rounded bg-slate-50'}
          >
            {Array.from({ length: 51 }, (_, i) => i + 10).map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
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
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
