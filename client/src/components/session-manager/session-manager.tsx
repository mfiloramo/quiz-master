import React, { ReactElement, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';

export function SessionManager(): ReactElement {
  const socket = useWebSocket();
  const [sessionId, setSessionId] = useState('');
  const [playerName, setPlayerName] = useState('');

  // HANDLER FUNCTIONS
  const createSession = () => {
    const newSessionId = Math.random().toString(36).substr(2, 4).toUpperCase();
    socket?.emit('create-session', newSessionId);
    setSessionId(newSessionId);
  };
  const joinSession = () => {
    socket?.emit('join-session', { sessionId, playerId: socket?.id, name: playerName });
  };

  // RENDER COMPONENT
  return (
    <div>
      <button onClick={createSession}>Create Session</button>
      <input
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder='Session ID'
      />
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder='Your Name'
      />
      <button onClick={joinSession}>Join Session</button>
    </div>
  );
}
export default SessionManager;
