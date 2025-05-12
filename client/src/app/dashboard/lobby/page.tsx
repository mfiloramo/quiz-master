'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function LobbyPage(): ReactElement {
  const router = useRouter();
  const session = useSession();
  const { socket, disconnect } = useWebSocket();

  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState('');

  const { user, isHost } = useAuth();

  // WEBSOCKET EVENT LISTENERS
  useEffect(() => {
    socket.emit('get-players', { sessionId: session.sessionId });

    socket.on('player-joined', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('players-list', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('session-started', () => {
      router.push('/dashboard/quiz');
    });

    socket.on('player-disconnected', (sessionId, playerId, name) => {
      console.log('Player has disconnected');
      setPlayers([...players, { sessionId, playerId, name }]);
    });

    socket.on('join-session', (sessionId, playerId, name) => {
      setPlayers([...players, { sessionId, playerId, name }]);
    });

    socket.on('error', (errMsg) => {
      setError(errMsg);
    });

    return () => {
      socket.off('player-joined');
      socket.off('players-list');
      socket.off('session-started');
      socket.off('error');
    };
  }, [socket, router, session.sessionId]);

  const handleStartSession = () => {
    socket.emit('start-session', { sessionId: session.sessionId });
  };

  const handleDisconnect = () => {
    console.log('handleDisconnect in LobbyPage invoked...');
    socket.emit('player-disconnected', { user: User });
    disconnect();
    router.push('/dashboard');
    // TODO: ADD TOAST MESSAGE
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className={'mb-12 text-3xl font-bold'}>Join with code: {session.sessionId}</h1>
      <h2 className='mb-2 text-xl font-semibold'>Players:</h2>
      <ul>
        {players.map((player: Player, index: number) => (
          // TODO: MAKE KEY player.id
          <li key={index}>{player.name}</li>
        ))}
      </ul>
      {isHost && (
        <button
          onClick={handleStartSession}
          className='mt-4 rounded bg-green-500 px-4 py-2 text-white'
        >
          Start Quiz
        </button>
      )}
      {socket && (
        <motion.button
          className='mt-12 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
          onClick={handleDisconnect}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LEAVE GAME
        </motion.button>
      )}
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </div>
  );
}
