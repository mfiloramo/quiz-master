'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';

export default function LobbyPage() {
  // CUSTOM HOOKS
  const router = useRouter();
  const { socket, disconnect } = useWebSocket();
  const { players, setPlayers, clearSession, sessionId } = useSession();
  const { isHost } = useAuth();
  const { selectedQuiz, resetQuiz } = useQuiz();

  // INITIALIZE SOCKET EVENT LISTENERS
  useEffect(() => {
    if (!socket) return;

    socket.once('session-started', () => {
      router.push('/dashboard/quiz');
    });

    socket.emit('get-players', { sessionId });

    socket.on('player-joined', setPlayers);
    socket.on('players-list', setPlayers);
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.'); // TODO: ALERT() NOT POPPING UP ON PLAYER EJECTION
      resetQuiz(); // RESET QUIZ STATE ON EJECTION
      disconnect();
      router.push('/dashboard');
    });
    socket.on('session-ended', () => {
      alert('Host disconnected. Session ended.');
      resetQuiz(); // RESET QUIZ STATE ON SESSION END
      router.push('/dashboard');
    });

    return () => {
      socket.off('player-joined');
      socket.off('players-list');
      socket.off('session-started');
      socket.off('ejected-by-host');
      socket.off('session-ended');
    };
  }, [socket, sessionId, router, disconnect, resetQuiz]);

  // HANDLE START SESSION
  const handleStart = () => {
    socket?.emit('start-session', {
      sessionId,
      quizId: selectedQuiz?.id,
    });
  };

  // HANDLE LEAVE SESSION
  const handleLeave = () => {
    disconnect();
    resetQuiz();
    clearSession();
    router.push('/dashboard');
  };

  // EJECT SPECIFIC PLAYER
  const ejectPlayer = (id: string): void => {
    if (!isHost) return;
    socket?.emit('eject-player', { sessionId, id });
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='mb-10 text-5xl font-bold'>Game Lobby</div>

      {/* JOIN SESSION CODE */}
      {isHost && (
        <motion.h1
          className='mb-6 animate-bounce rounded-xl border-2 border-black bg-slate-50 px-4 py-2 text-3xl font-bold shadow'
          animate={{
            color: ['#ff0000', '#ff9900', '#009800', '#0000ff', '#4b0082', '#b600b6', '#ff0000'],
            opacity: [1, 0.8, 1],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          Join with code: {sessionId}
        </motion.h1>
      )}

      {/* PLAYERS LIST */}
      <ul>
        {players.map((player, index) => {
          // ASSIGN PLAYERS WITH RANDOM COLORS
          const colors = [
            { bg: '#FF0000', text: 'white' },
            { bg: '#FF7F00', text: 'black' },
            { bg: '#FFFF00', text: 'black' },
            { bg: '#00FF00', text: 'black' },
            { bg: '#0000FF', text: 'white' },
            { bg: '#4B0082', text: 'white' },
            { bg: '#8F00FF', text: 'white' },
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <motion.li
              key={index}
              onClick={() => isHost && ejectPlayer(player.id)} // ONLY HOST CAN KICK
              className='mb-2 cursor-pointer rounded-xl border-2 border-black p-2 font-bold shadow'
              style={{ backgroundColor: color.bg, color: color.text }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {player.username}
            </motion.li>
          );
        })}
      </ul>

      {/* START QUIZ BUTTON (HOST ONLY) */}
      {isHost && (
        <button onClick={handleStart} className='mt-4 rounded bg-green-500 px-4 py-2 text-white'>
          Start Quiz
        </button>
      )}

      {/* LEAVE GAME BUTTON*/}
      <button onClick={handleLeave} className='mt-6 rounded bg-red-500 px-4 py-2 text-white'>
        {isHost ? 'Cancel Game' : 'Leave Game'}
      </button>
    </div>
  );
}
