'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';

export default function HostPage() {
  // STATE HOOKS
  const [playerName, setPlayerName] = useState('');

  // CUSTOM HOOKS
  const router = useRouter();
  const { setSessionId } = useSession();
  const { setIsHost, user } = useAuth();
  const { socket } = useWebSocket();

  // HANDLER FUNCTIONS
  const createSession = (): void => {
    const sessionId = Math.random().toString(36).substr(2, 4).toUpperCase();

    if (!socket?.connected) {
      console.warn('Socket not ready');
      return;
    }

    socket.emit('create-session', { sessionId, host: user!.username });
    setSessionId(sessionId);
    setIsHost(true);
    router.push('/dashboard/lobby');
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-6 text-5xl font-bold'>Host Quiz</h1>
      <h2 className={'mb-6 text-xl'}>Game Session Configuration Options</h2>
      <button onClick={createSession} className='mb-4 rounded bg-blue-500 px-4 py-2 text-white'>
        Create Session
      </button>
    </div>
  );
}
