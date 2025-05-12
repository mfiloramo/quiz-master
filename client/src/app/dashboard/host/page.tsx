'use client';

import React, { ReactElement, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';

export function HostPage(): ReactElement {
  const [playerName, setPlayerName] = useState('');

  const router = useRouter();
  const { sessionId, setSessionId } = useSession();
  const { setIsHost } = useAuth();
  const { socket } = useWebSocket();

  // HANDLER FUNCTIONS
  const createSession = (): void => {
    console.log(`createSession FRONTEND sessionId: ${sessionId}`);

    const newSessionId = Math.random().toString(36).substr(2, 4).toUpperCase();
    socket.emit('create-session', newSessionId);
    setSessionId(newSessionId);
    setIsHost(true);

    router.push('/dashboard/lobby');
  };

  // RENDER COMPONENT
  return (
    <div className={'flex flex-col items-center justify-center'}>
      <h1 className='mb-4 text-2xl font-bold'>Host Quiz</h1>

      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder='Your Name'
        className={'mb-2 rounded border p-2'}
      />
      <button className={'mb-4 rounded bg-blue-500 px-4 py-2 text-white'} onClick={createSession}>
        Create Session
      </button>
    </div>
  );
}

export default HostPage;
