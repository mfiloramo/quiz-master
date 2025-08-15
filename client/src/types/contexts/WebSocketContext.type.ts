import { Socket } from 'socket.io-client';

export type WebSocketContextType = {
  socket: Socket | null;
  disconnect: () => void;
};
