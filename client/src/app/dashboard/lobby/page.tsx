'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useAudio } from '@/contexts/AudioContext';
import { motion } from 'framer-motion';
import BackgroundMusic from '@/components/BackgroundMusic/BackgroundMusic';
import AudioToggle from '@/components/AudioToggle/AudioToggle';

// LOAD LOBBY BACKGROUND MUSIC TRACKS
const lobbyTracks = ['/audio/lobby-groove-a.mp3', '/audio/lobby-groove-b.mp3'];
const hasStartedMusic =
  typeof window !== 'undefined' && sessionStorage.getItem('lobby-music-started') === 'true';

export default function LobbyPage() {
  // CUSTOM HOOKS
  const router = useRouter();
  const { socket, disconnect } = useWebSocket();
  const { players, setPlayers, clearSession, sessionId } = useSession();
  const { isHost } = useAuth();
  const { selectedQuiz, resetQuiz } = useQuiz();
  const { music } = useAudio();

  // EMIT check-session WHEN NON-HOST JOINS
  useEffect(() => {
    if (!isHost && socket && sessionId) {
      socket.emit('check-session', { sessionId });
    }
  }, [isHost, socket, sessionId]);

  // LISTEN FOR check-session-response AND NAVIGATE IF TRUE
  useEffect(() => {
    if (!socket) return;

    const handleCheck = (isSessionActive: boolean): void => {
      if (isSessionActive) {
        router.push('/dashboard/quiz');
      }
    };

    socket.on('check-session-response', handleCheck);

    return () => {
      socket.off('check-session-response', handleCheck);
    };
  }, [socket]);

  // INITIALIZE SOCKET EVENT LISTENERS FOR PLAYER AND SESSION EVENTS
  useEffect(() => {
    if (!socket) return;

    socket.once('session-started', () => {
      router.push('/dashboard/quiz');
    });

    socket.emit('get-players', { sessionId });

    socket.on('player-joined', setPlayers);
    socket.on('players-list', setPlayers);
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      resetQuiz();
      disconnect();
      router.push('/dashboard');
    });
    socket.on('session-ended', () => {
      alert('Host disconnected. Session ended.');
      resetQuiz();
      router.push('/dashboard');
    });

    // CLEAN UP SOCKET EVENT LISTENERS
    return () => {
      socket.off('player-joined');
      socket.off('players-list');
      socket.off('session-started');
      socket.off('ejected-by-host');
      socket.off('session-ended');
      socket.off('new-question');
      socket.off('check-session');
    };
  }, [socket, sessionId, router, disconnect, resetQuiz]);

  // HANDLE START SESSION
  const handleStart = () => {
    resetQuiz(); // RESET QUIZ STATE IF CARRYING OVER FROM PREVIOUS SESSION
    socket?.emit('start-session', {
      sessionId,
      quizId: selectedQuiz?.id,
    });
  };

  // HANDLE LEAVE SESSION
  const handleLeave = () => {
    if (isHost) {
      socket?.emit('host-left', { sessionId });
    }
    disconnect();
    resetQuiz();
    clearSession();
    router.push('/dashboard');
  };

  // EJECT SPECIFIC PLAYER
  const ejectPlayer = (id: number): void => {
    if (!isHost) return;
    socket?.emit('eject-player', { sessionId, id });
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      {/* INNER CONTAINER */}
      <div className='mb-10 text-5xl font-bold'>Game Lobby</div>

      {/* BACKGROUND MUSIC (ONLY HOST PLAYS IT ONCE) */}
      {isHost && music && !hasStartedMusic && (
        <BackgroundMusic tracks={lobbyTracks} />
      )}

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
        {players.map((player, index) => (
          <motion.li
            key={index}
            onClick={() => isHost && ejectPlayer(player.id)} // ONLY HOST CAN KICK
            className={`mb-2 ${isHost ? 'cursor-pointer' : 'cursor-none'} flex flex-wrap text-center text-3xl font-bold`}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {player.username}
          </motion.li>
        ))}
      </ul>

      {/* START QUIZ BUTTON (HOST ONLY) */}
      {isHost && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.001 }}
          onClick={handleStart}
          className='mt-4 rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-400 active:bg-green-500'
        >
          Start Quiz
        </motion.button>
      )}

      {/* LEAVE GAME BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.001 }}
        onClick={handleLeave}
        className='mt-6 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-400 active:bg-red-500'
      >
        {isHost ? 'Cancel Game' : 'Leave Game'}
      </motion.button>

      {/* MUSIC/SOUND TOGGLE (SELF-CONTAINED) */}
      {isHost && (
        <div className={'mt-4'}>
          <AudioToggle />
        </div>
      )}
    </div>
  );
}
