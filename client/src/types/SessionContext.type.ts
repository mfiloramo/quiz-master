export type SessionContextType = {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  clearSession: () => void;
};
