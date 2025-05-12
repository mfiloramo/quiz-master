'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';

export default function JoinPage(): ReactElement {
  const router = useRouter();
  const { socket } = useWebSocket();

  const [sessionId, setSessionId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleJoinSession = () => {
    console.log(`sessionId: ${sessionId}, playerName: ${playerName}`);
    socket.emit('join-session', {
      sessionId,
      playerId: socket.id,
      name: playerName,
    });

    // TODO: VALIDATE THAT SESSION EXISTS BEFORE ROUTING USER
    router.push('/dashboard/lobby');
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-4 text-2xl font-bold'>Lobby</h1>
      <input
        type='text'
        placeholder='Session ID'
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        className='mb-2 rounded border p-2'
      />
      <input
        type='text'
        placeholder='Your Name'
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className='mb-2 rounded border p-2'
      />
      <button onClick={handleJoinSession} className='mb-4 rounded bg-blue-500 px-4 py-2 text-white'>
        Join Session
      </button>
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </div>
  );
}
