'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';

export default function JoinPage() {
  const { socket } = useWebSocket();
  const { user } = useAuth();
  const router = useRouter();

  const [sessionId, setSessionId] = useState('');
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

  const handleJoin = (): void => {
    if (!socket || !sessionId) {
      setError('Please enter session ID and name.');
      return;
    }

    // LISTEN FOR PLAYER LIST ON SUCCESSFUL JOIN
    socket.once('player-joined', () => {
      router.push('/dashboard/lobby');
    });

    // LISTEN FOR ERROR IF SESSION IS INVALID
    socket.once('error', (err: string) => {
      setError(err || 'Failed to join session.');
    });

    console.log(sessionId);
    socket.emit('join-session', {
      sessionId,
      username: user?.username,
      playerId: socket.id,
    });
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

      {/* TODO: DEPRECATE NAME INPUT AND AUTOMATICALLY PIPE VALUE FROM STATE */}
      <button onClick={handleJoin} className='mb-4 rounded bg-blue-500 px-4 py-2 text-white'>
        Join Session
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
