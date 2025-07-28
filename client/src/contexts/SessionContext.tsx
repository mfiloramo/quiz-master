'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionContextType } from '@/types/SessionContext.type';
import { Player } from '@/interfaces/PlayerListProps.interface';

// CONTEXT INSTANCE
const SessionContext = createContext<SessionContextType | null>(null);

// PROVIDER COMPONENT
export function SessionProvider({ children }: { children: ReactNode }) {
  // LOCAL STATES
  const [sessionId, setSessionIdState] = useState<any>(null);
  const [players, setPlayersState] = useState<Player[]>([]);

  // HANDLER FUNCTIONS
  const setSessionId = (id: string | null): void => {
    setSessionIdState(id);
  };

  const setPlayers = (updatedPlayers: Player[]): void => {
    setPlayersState(updatedPlayers);
  };

  const clearSession = (): void => {
    setSessionIdState(null);
    setPlayersState([]);
  };

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId, clearSession, players, setPlayers }}>
      {children}
    </SessionContext.Provider>
  );
}

// CUSTOM HOOK
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
