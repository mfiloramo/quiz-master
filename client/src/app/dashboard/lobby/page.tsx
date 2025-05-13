'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Player } from '@/interfaces/PlayerListProps.interface';

export default function LobbyPage() {
  // STATE
  const [players, setPlayers] = useState([]);

  // UTILITIES
  const { socket, disconnect } = useWebSocket();
  const { sessionId } = useSession();
  const { isHost } = useAuth();
  const router = useRouter();

  // EFFECT HOOKS
  useEffect(() => {
    if (!socket) return;

    // EMIT PLAYER FETCH
    socket.emit('get-players', { sessionId });

    // EVENT LISTENERS
    socket.on('player-joined', setPlayers);
    socket.on('players-list', setPlayers);
    socket.on('session-started', () => {
      router.push('/dashboard/quiz');
    });
    socket.on('session-ended', () => {
      alert('Host disconnected. Session ended.');
      router.push('/dashboard');
    });

    // PAGE CLEANUP ON UNMOUNT
    return () => {
      socket.off('player-joined');
      socket.off('players-list');
      socket.off('session-started');
      socket.off('session-ended');
    };
  }, [socket, sessionId, router]);

  // HANDLER FUNCTIONS
  const handleStart = () => {
    socket?.emit('start-session', { sessionId });
  };

  const handleLeave = () => {
    disconnect();
    router.push('/dashboard');
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='mb-4 text-3xl font-bold'>Join with code: {sessionId}</h1>
      <ul>
        {players.map((player: Player, index: number) => (
          <li key={index}>{player.name}</li>
        ))}
      </ul>
      {isHost && (
        <button onClick={handleStart} className='mt-4 rounded bg-green-500 px-4 py-2 text-white'>
          Start Quiz
        </button>
      )}
      <button onClick={handleLeave} className='mt-6 rounded bg-red-500 px-4 py-2 text-white'>
        Leave Game
      </button>
    </div>
  );
}
