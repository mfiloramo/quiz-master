'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketContextType } from '@/types/WebSocketContext.type';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const socket = useRef<WebSocketContextType | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    socket.current = io('http://localhost:3030');
    setIsReady(true);

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  if (!isReady || !socket.current) return null;

  const disconnect = () => {
    socket.current.emit('player-disconnected');
    socket.current?.disconnect();
  };

  return (
    <WebSocketContext.Provider value={{ socket: socket.current, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
}
