'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';

export default function JoinPage() {
  const { socket } = useWebSocket();
  const router = useRouter();

  const [sessionId, setSessionId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleError = (err: string) => {
      setError(err || 'Failed to join session.');
    };

    socket.on('error', handleError);

    return () => {
      socket.off('error', handleError);
    };
  }, [socket]);

  const handleJoin = () => {
    if (!socket || !sessionId || !playerName) {
      setError('Please enter session ID and name.');
      return;
    }

    socket.emit('join-session', {
      sessionId,
      playerId: socket.id,
      name: playerName,
    });

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
      <button onClick={handleJoin} className='mb-4 rounded bg-blue-500 px-4 py-2 text-white'>
        Join Session
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
