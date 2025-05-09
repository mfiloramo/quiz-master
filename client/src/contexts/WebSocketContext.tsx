'use client';

import React, { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WebSocketContext = createContext<Socket | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('WebSocketProvider useEffect invoked...');
    socketRef.current = io('http://localhost:3030');
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socketRef.current}>{children}</WebSocketContext.Provider>
  );
}

// CUSTOM HOOK
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
}
