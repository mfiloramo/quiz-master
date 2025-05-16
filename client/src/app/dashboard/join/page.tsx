'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useQuiz } from '@/contexts/QuizContext';

export default function JoinPage() {
  const router = useRouter();
  const { socket } = useWebSocket();
  const { user } = useAuth();
  const { resetQuiz } = useQuiz();

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
      setError('Please enter session ID.');
      return;
    }

    // RESET OLD QUIZ DATA ON JOIN ATTEMPT
    resetQuiz();

    // LISTEN FOR PLAYER LIST ON SUCCESSFUL JOIN
    socket.once('player-joined', () => {
      router.push('/dashboard/lobby');
    });

    // LISTEN FOR ERROR IF SESSION IS INVALID
    socket.once('error', (err: string) => {
      setError(err || 'Failed to join session.');
    });

    socket.emit('join-session', {
      sessionId,
      username: user?.username,
      playerId: socket.id,
    });
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-4 text-2xl font-bold'>Join Game</h1>
      <input
        type='text'
        placeholder='Session ID'
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
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
