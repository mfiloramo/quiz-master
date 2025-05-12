'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type WebSocketContextType = {
  socket: Socket;
  disconnect: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:3030');
    setIsReady(true);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  if (!isReady || !socketRef.current) return null;

  const disconnect = () => {
    socketRef.current?.disconnect();
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
}
