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

// LOAD LOBBY BACKGROUND MUSIC TRACKS
const lobbyTracks = ['/audio/lobby-groove-a.mp3', '/audio/lobby-groove-b.mp3'];
const hasStartedMusic =
  typeof window !== 'undefined' && sessionStorage.getItem('lobby-music-started') === 'true';

export default function LobbyPage() {
  const [musicToggle, setMusicToggle] = useState<boolean>(true);
  const [gameStartTimer, setGameStartTimer] = useState<number | null>(null);
  const [timerKey, setTimerKey] = useState<number>(0); // KEY TO FORCE RERENDER OF COUNTDOWN COMPONENT

  // CUSTOM HOOKS
  const router = useRouter();
  const { socket, disconnect } = useWebSocket();
  const { players, setPlayers, clearSession, sessionId } = useSession();
  const { isHost } = useAuth();
  const { selectedQuiz, resetQuiz, setLockedIn } = useQuiz();

  // EMIT check-session WHEN NON-HOST JOINS
  useEffect(() => {
    if (!isHost && socket && sessionId) {
      socket.emit('check-session', { sessionId });
    }
  }, [isHost, socket, sessionId]);

  // LISTEN FOR check-session-response AND NAVIGATE IF TRUE
  useEffect(() => {
    // DO NOT CONTINUE IF SOCKET IS UNAVAILABLE
    if (!socket) return;

    // DEFINE HANDLER FOR SERVER RESPONSE TO SESSION CHECK
    const handleCheck = (isSessionActive: boolean): void => {
      // IF SESSION IS ACTIVE, IMMEDIATELY REDIRECT TO QUIZ PAGE
      if (isSessionActive) {
        router.push('/dashboard/quiz');
      }
    };

    // REGISTER SOCKET LISTENER FOR SESSION STATUS RESPONSE
    socket.on('check-session-response', handleCheck);

    // CLEAN UP SOCKET LISTENER ON UNMOUNT
    return () => {
      socket.off('check-session-response', handleCheck);
    };
  }, [socket]);

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
      socket.off('new-question');
      socket.off('check-session');
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
      {/* INNER CONTAINER */}
      <div className='mb-10 text-5xl font-bold'>Game Lobby</div>
      {/* BACKGROUND MUSIC (ONLY HOST PLAYS IT ONCE) */}
      {isHost && musicToggle && gameStartTimer !== null && !hasStartedMusic && (
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
          // PLAYER LISTING
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
      {/*<div className={'flex flex-row'}>*/}
      {/*  <input type={'checkbox'} className={'h-5 w-5 font-bold'} />*/}
      {/*  Music*/}
      {/*</div>*/}

      {/* TODO: PROTOTYPE MUSIC TOGGLE */}
      <div className='inline-flex items-center gap-2 pt-3 text-2xl font-bold'>
        <label className='relative flex cursor-pointer items-center'>
          <input
            type='checkbox'
            className='peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-slate-800 checked:bg-slate-800 hover:shadow-md'
            id='check'
            onChange={() => setMusicToggle(!musicToggle)}
            checked={musicToggle}
          />
          <span className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3.5 w-3.5'
              viewBox='0 0 20 20'
              fill='currentColor'
              stroke='currentColor'
              stroke-width='1'
            >
              <path
                fill-rule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clip-rule='evenodd'
              ></path>
            </svg>
          </span>
        </label>
        🎵 Music
      </div>
    </div>
  );
}
