'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/types/SessionContext';
import { useAuth } from '@/contexts/AuthContext';

export default function LobbyPage(): ReactElement {
  const router = useRouter();
  const session = useSession();
  const { socket, disconnect } = useWebSocket();

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');

  const { isHost } = useAuth();

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

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className={'mb-12 text-3xl font-bold'}>Join with code: {session.sessionId}</h1>
      <h2 className='mb-2 text-xl font-semibold'>Players:</h2>
      <ul>
        {players.map((player: Player, index: number) => (
          <li key={player.id}>{player.name}</li>
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
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </div>
  );
}
