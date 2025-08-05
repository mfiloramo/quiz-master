'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { motion } from 'framer-motion';

export default function JoinPage() {
  // LOCAL STATE
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [error, setError] = useState('');

  // CUSTOM HOOKS
  const { socket } = useWebSocket();
  const { user } = useAuth();
  const { setSessionId } = useSession();
  const router = useRouter();

  // EFFECT HOOKS
  useEffect(() => {
    if (!socket) return;

    const handleError = (err: string) => {
      setError(err || 'Failed to join session.');
    };

    // INITIALIZE SOCKET EVENT LISTENERS FOR ERROR HANDLING
    socket.on('error', handleError);

    return () => {
      socket.off('error', handleError);
    };
  }, [socket]);

  // HANDLER FUNCTIONS
  const handleJoin = (): void => {
    // ENSURE USER ENTERS SESSION ID
    if (!socket || !sessionIdInput.trim()) {
      setError('Please enter session ID.');
      return;
    }

    // ENSURE USER ENTERS USERNAME
    if (!usernameInput) {
      setError('Please enter a username');
      return;
    }

    // GENERATE NEW USER ID
    const id = user?.id ?? Math.floor(1000 + Math.random() * 9000);
    console.log('Joining with ID:', id, 'Username:', usernameInput || user?.username);

    // EMIT JOIN REQUEST
    socket.emit('join-session', {
      id,
      username: usernameInput || user?.username,
      sessionId: sessionIdInput.trim().toUpperCase(),
    });

    // ON SUCCESSFUL JOIN, SAVE SESSION ID AND REDIRECT
    socket.once('player-joined', () => {
      setSessionId(sessionIdInput.trim().toUpperCase());
      router.push('/dashboard/lobby');
    });

    // ON FAILURE, DISPLAY ERROR
    socket.on('error', (err: string) => {
      setError(err || 'Unable to join the session.');
    });
  };

  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center justify-center'>
      {/* TITLE */}
      <h1 className='mb-[20vh] text-4xl font-bold'>Join Game</h1>
      {/* INNER CONTAINER */}
      <div className='flex flex-col items-center justify-center rounded-xl bg-white/30 px-6 py-4'>
        {/* INNER CONTAINER ITEMS */}
        <div className='flex flex-col items-center justify-center'>
          {/* PLAYER NAME INPUT */}
          <div className={'mb-2 text-xl font-bold'}>Player Name</div>
          <input
            type={'text'}
            placeholder={'Player Name'}
            onChange={(e) => setUsernameInput(e.target.value)}
            required={true}
            className='mb-4 rounded border p-2'
          />
          {/* SESSION ID INPUT */}
          <div className={'mb-2 text-xl font-bold'}>Session ID</div>
          <input
            type='text'
            placeholder='Session ID'
            value={sessionIdInput}
            onChange={(e) => setSessionIdInput(e.target.value)}
            className='mb-4 rounded border p-2'
          />
          {/* JOIN SESSION BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.01 }}
            onClick={handleJoin}
            className='mb-4 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-400 active:bg-blue-500'
          >
            Join Session
          </motion.button>

          {/* SHOW ERROR IF ERROR*/}
          {error && <p className='text-red-500'>{error}</p>}
        </div>
      </div>
    </div>
  );
}
