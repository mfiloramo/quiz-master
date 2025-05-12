import { Socket } from 'socket.io-client';

export type WebSocketContextType = {
  socket: Socket;
  disconnect: () => void;
};
