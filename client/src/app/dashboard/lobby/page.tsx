'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import BackgroundMusic from '@/components/BackgroundMusic/BackgroundMusic';

// LOBBY BACKGROUND MUSIC TRACKS
const lobbyTracks = ['/audio/lobby-groove-a.mp3', '/audio/lobby-groove-b.mp3'];
const hasStartedMusic =
  typeof window !== 'undefined' && sessionStorage.getItem('lobby-music-started') === 'true';

export default function LobbyPage() {
  const [gameStartTimer, setGameStartTimer] = useState<number | null>(null);
  const [timerKey, setTimerKey] = useState<number>(0); // KEY TO FORCE RERENDER OF COUNTDOWN COMPONENT
  const [musicStarted, setMusicStarted] = useState(false); // REMOVE THIS

  // CUSTOM HOOKS
  const router = useRouter();
  const { socket, disconnect } = useWebSocket();
  const { players, setPlayers, clearSession, sessionId } = useSession();
  const { isHost } = useAuth();
  const { selectedQuiz, resetQuiz } = useQuiz();

  // INITIALIZE SOCKET EVENT LISTENERS FOR TIMER
  useEffect(() => {
    if (!socket || !sessionId) return;

    const handleGameStartTimer = (time: number) => {
      setGameStartTimer(time); // SET TIMER VALUE
      setTimerKey((prev) => prev + 1); // FORCE COUNTDOWN COMPONENT TO RERENDER AND RESET
    };

    // START TIMER SOCKET LISTENERS
    socket.on('game-start-timer', handleGameStartTimer);
    socket.on('game-start-timer-reset', handleGameStartTimer);

    // REQUEST CURRENT TIMER FROM SERVER ON MOUNT
    socket.emit('get-game-start-timer', { sessionId });

    // CLEANUP SOCKET LISTENERS
    return () => {
      socket.off('game-start-timer', handleGameStartTimer);
      socket.off('game-start-timer-reset', handleGameStartTimer);
    };
  }, [socket, sessionId]);

  // INITIALIZE SOCKET EVENT LISTENERS FOR PLAYER AND SESSION EVENTS
  useEffect(() => {
    // VALIDATE SOCKET
    if (!socket) return;

    // START SESSION
    socket.once('session-started', () => {
      router.push('/dashboard/quiz');
    });

    // REFRESH PLAYERS LIST
    socket.emit('get-players', { sessionId });

    // LOBBY SOCKET LISTENERS
    socket.on('player-joined', setPlayers);
    socket.on('players-list', setPlayers);
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      resetQuiz(); // RESET QUIZ STATE ON EJECTION
      disconnect();
      router.push('/dashboard');
    });
    socket.on('session-ended', () => {
      alert('Host disconnected. Session ended.');
      resetQuiz(); // RESET QUIZ STATE ON SESSION END
      router.push('/dashboard');
    });

    // CLEANUP SOCKET LISTENERS
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
    // RESET ANY EXISTING TIMER STATE ON NEW SESSION START
    setGameStartTimer(null); // RESET GAME START TIMER STATE
    setTimerKey(0); // RESET COUNTDOWN COMPONENT KEY
    resetQuiz(); // RESET QUIZ STATE IF CARRYING OVER FROM PREVIOUS SESSION

    // EMIT SESSION START TO SERVER
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
      <div className='mb-10 text-5xl font-bold'>Game Lobby</div>

      {/* BACKGROUND MUSIC (ONLY HOST PLAYS IT ONCE) */}
      {isHost && gameStartTimer !== null && !hasStartedMusic && (
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
              className={`mb-2 ${isHost ? 'cursor-pointer' : 'cursor-none'} rounded-xl border-2 border-black p-2 font-bold shadow`}
              style={{ backgroundColor: color.bg, color: color.text }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {player.username}
            </motion.li>
          );
        })}
      </ul>

      {/* GAME START TIMER */}
      <div className='mt-8'>
        {gameStartTimer !== null && isHost && (
          <CountdownCircleTimer
            key={timerKey} // FORCE RESET OF TIMER ON TIMER CHANGE
            isPlaying
            duration={Math.floor(gameStartTimer / 1000)}
            colors={['#3b8600', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        )}
      </div>

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
    </div>
  );
}
