'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';

export default function HostPage() {
  const router = useRouter();
  const { socket } = useWebSocket();
  const { setSessionId } = useSession();
  const { setIsHost, user } = useAuth();
  const { selectedQuiz } = useQuiz();
  const [error, setError] = useState('');

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
    });

    setSessionId(sessionId);
    setIsHost(true);
    router.push('/dashboard/lobby');
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-6 text-5xl font-bold'>Host Quiz</h1>
      <h2 className='mb-6 text-xl'>Game Session Configuration Options</h2>
      <button onClick={createSession} className='mb-4 rounded bg-blue-500 px-4 py-2 text-white'>
        Create Session
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
