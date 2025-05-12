import { Socket } from 'socket.io-client';

export type WebSocketContextType = {
  socket: Socket;
  setSession: (sessionId: string) => void;
  disconnect: () => void;
};
