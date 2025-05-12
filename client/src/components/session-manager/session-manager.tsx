'use client';

import React, { ReactElement, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/types/SessionContext';
import { useAuth } from '@/contexts/AuthContext';

export function SessionManager(): ReactElement {
  const [playerName, setPlayerName] = useState('');

  const router = useRouter();
  const { sessionId, setSessionId } = useSession();
  const { setIsHost } = useAuth();
  const { socket } = useWebSocket();

  // HANDLER FUNCTIONS
  const createSession = (): void => {
    const newSessionId = Math.random().toString(36).substr(2, 4).toUpperCase();
    socket?.emit('create-session', newSessionId);
    setSessionId(newSessionId);
    setIsHost(true);

    router.push('/dashboard/lobby');
  };
  const joinSession = (): void => {
    socket?.emit('join-session', { sessionId, playerId: socket?.id, name: playerName });
  };

  // RENDER COMPONENT
  return (
    <div className={'flex max-w-lg flex-col'}>
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder='Your Name'
        className={'mb-3'}
      />
      <button
        className={'mb-3 rounded-lg bg-blue-600 transition hover:bg-blue-500 active:bg-blue-400'}
        onClick={createSession}
      >
        Create Session
      </button>
    </div>
  );
}
export default SessionManager;
