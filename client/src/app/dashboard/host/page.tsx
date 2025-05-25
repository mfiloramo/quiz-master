'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';

export default function HostPage() {
  // LOCAL STATE
  const [error, setError] = useState<string>('');
  const [roundTimer, setRoundTimer] = useState<number>(10000);

  // CUSTOM HOOKS
  const router = useRouter();
  const { socket } = useWebSocket();
  const { setSessionId } = useSession();
  const { setIsHost, user } = useAuth();
  const { selectedQuiz } = useQuiz();

  // CREATE A NEW GAME SESSION
  const createSession = () => {
    if (!selectedQuiz) {
      setError('Please select a quiz before hosting.');
      return;
    }

    const sessionId = Math.random().toString(36).substr(2, 4).toUpperCase();

    socket?.emit('create-session', {
      sessionId,
      hostUserName: user!.username,
      quizId: selectedQuiz.id,
      roundTimer,
    });

    setSessionId(sessionId);
    setIsHost(true);
    router.push('/dashboard/lobby');
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-6 text-5xl font-bold'>Host Quiz</h1>
      <h2 className='mb-6 text-xl'>Game Session Configuration Options</h2>

      {/* CONFIGURATION WINDOW */}
      <div
        className={'flex h-[40vh] w-[70vw] max-w-2xl flex-col rounded bg-slate-400 p-3 shadow-xl'}
      >
        {/* ROUND TIMER CONFIGURATION */}
        <div className={'my-2 flex flex-row justify-between rounded bg-slate-300 p-3 px-6 py-4'}>
          Round Timer (seconds)
          <select
            onChange={(e: any) => setRoundTimer(e.target.value)}
            className={'rounded bg-slate-50'}
          >
            {Array.from({ length: 21 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* START/CANCEL BUTTONS */}
      <div>
        <button onClick={createSession} className='my-4 rounded bg-blue-500 px-4 py-2 text-white'>
          Create Session
        </button>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
