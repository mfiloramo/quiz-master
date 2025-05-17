'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketContextType } from '@/types/WebSocketContext.type';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  // PROVIDER STATE
  const [socket, setSocket] = useState<Socket | null>(null);

  // PROVIDER EFFECT HOOKS
  useEffect(() => {
    const newSocket = io('http://localhost:3030', {
      autoConnect: true,
      reconnection: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // PROVIDER HANDLER FUNCTIONS
  const disconnect = () => {
    socket?.emit('leave-session');
  };

  return (
    <WebSocketContext.Provider value={{ socket, disconnect }}>{children}</WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
}
