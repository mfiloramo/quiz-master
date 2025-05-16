'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { motion } from 'framer-motion';

export default function JoinPage() {
  const { socket } = useWebSocket();
  const { user } = useAuth();
  const { setSessionId } = useSession();
  const router = useRouter();

  const [sessionIdInput, setSessionIdInput] = useState('');
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
    if (!socket || !sessionIdInput.trim()) {
      setError('Please enter session ID.');
      return;
    }

    // EMIT JOIN REQUEST
    socket.emit('join-session', {
      sessionId: sessionIdInput.trim().toUpperCase(),
      username: user?.username,
      playerId: socket.id,
    });

    // ON SUCCESSFUL JOIN, SAVE SESSION ID AND REDIRECT
    socket.once('player-joined', () => {
      setSessionId(sessionIdInput.trim().toUpperCase());
      router.push('/dashboard/lobby');
    });

    // ON FAILURE, DISPLAY ERROR
    socket.once('error', (err: string) => {
      setError(err || 'Unable to join the session.');
    });
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-4 text-2xl font-bold'>Join Game</h1>
      <input
        type='text'
        placeholder='Session ID'
        value={sessionIdInput}
        onChange={(e) => setSessionIdInput(e.target.value)}
        className='mb-4 rounded border p-2'
      />
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.01 }}
        onClick={handleJoin}
        className='mb-4 rounded bg-blue-500 px-4 py-2 text-white'
      >
        Join Session
      </motion.button>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
