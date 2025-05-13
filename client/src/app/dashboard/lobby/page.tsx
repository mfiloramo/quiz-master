'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { motion } from 'framer-motion';

export default function LobbyPage() {
  // STATE HOOKS
  const [players, setPlayers] = useState([]);

  // CUSTOM HOOKS
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
      <div className='mb-10 text-5xl font-bold'>Game Lobby</div>
      {isHost && (
        <motion.h1
          className='mb-6 animate-bounce rounded-xl border-2 border-black bg-slate-50 px-4 py-2 text-3xl font-bold shadow'
          animate={{
            color: [
              '#ff0000', // RED
              '#ff9900', // ORANGE
              '#009800', // GREEN
              '#0000ff', // BLUE
              '#4b0082', // INDIGO
              '#b600b6', // VIOLET
              '#ff0000', // RED (LOOP)
            ],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          Join with code: {sessionId}
        </motion.h1>
      )}

      {/* PLAYERS LIST*/}
      <ul>
        {players.map((player: Player, index: number) => {
          // Pick a random ROYGBIV color
          const colors = [
            { bg: '#FF0000', text: 'white' }, // RED
            { bg: '#FF7F00', text: 'black' }, // ORANGE
            { bg: '#FFFF00', text: 'black' }, // YELLOW
            { bg: '#00FF00', text: 'black' }, // GREEN
            { bg: '#0000FF', text: 'white' }, // BLUE
            { bg: '#4B0082', text: 'white' }, // INDIGO
            { bg: '#8F00FF', text: 'white' }, // VIOLET
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <motion.li
              key={index}
              className='mb-2 cursor-pointer rounded-xl border-2 border-black p-2 font-bold shadow'
              style={{
                backgroundColor: color.bg,
                color: color.text,
              }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {player.username}
            </motion.li>
          );
        })}
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
