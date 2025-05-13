import { Server, Socket } from 'socket.io';
import { WebSocketController } from '../controllers/websocket.controller';

export const webSocketRouter = (io: Server): void => {
  const controller = new WebSocketController(io);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('create-session', (sessionId) => controller.createSession(socket, sessionId));
    socket.on('join-session', (data) => controller.joinSession(socket, data));
    socket.on('start-session', (data) => controller.startSession(socket, data));
    socket.on('leave-session', () => controller.leaveSession(socket));
    socket.on('disconnect', () => controller.handleDisconnect(socket));
  });
};
