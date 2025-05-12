'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

type SessionContextType = {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

// 3. Create the provider component
export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

// 4. Create a custom hook to use the context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
