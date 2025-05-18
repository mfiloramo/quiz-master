'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionContextType } from '@/types/SessionContext.type';

// CONTEXT INSTANCE
const SessionContext = createContext<SessionContextType | null>(null);

// PROVIDER COMPONENT
export function SessionProvider({ children }: { children: ReactNode }) {
  // PROVIDER STATE
  const [sessionId, setSessionIdState] = useState<string | null>(null);

  // TODO: IS THIS EXTRA LAYER (METHOD) NEEDED HERE?
  // PROVIDER HANDLER FUNCTIONS
  const setSessionId = (id: string | null) => {
    setSessionIdState(id);
  };

  const clearSession = () => {
    setSessionIdState(null);
  };

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId, clearSession }}>
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
