'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { useSession } from '@/types/SessionContext';

export default function LobbyPage(): ReactElement {
  const router = useRouter();
  const socket = useWebSocket();
  const session = useSession();

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('player-joined', (updatedPlayers) => {
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
      socket.off('session-started');
      socket.off('error');
    };
  }, [socket, router]);

  const handleStartSession = () => {
    socket.emit('start-session', { sessionId: session.sessionId });
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className={'text-xl font-bold'}>{session.sessionId}</h1>
      <h2 className='mb-2 text-xl font-semibold'>Players:</h2>
      <ul>
        {players.map((player: Player, index: number) => (
          // TODO: REPLACE KEY WITH PLAYER.ID
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button
        onClick={handleStartSession}
        className='mt-4 rounded bg-green-500 px-4 py-2 text-white'
      >
        Start Quiz
      </button>
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </div>
  );
}
