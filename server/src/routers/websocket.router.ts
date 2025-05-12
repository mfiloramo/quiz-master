import { Server, Socket } from 'socket.io';
import { WebSocketController } from '../controllers/websocket.controller';
import User from '../models/User';

export const webSocketRouter = (io: Server): void => {
  const controller = new WebSocketController(io);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('create-session', (sessionId) => controller.createSession(socket, sessionId));
    socket.on('join-session', (data) => controller.joinSession(socket, data));
    socket.on('start-session', (data) => controller.startSession(socket, data));
    socket.on('submit-answer', (data) => controller.submitAnswer(socket, data));
    socket.on('end-session', (data) => controller.endSession(socket, data));
    socket.on('player-disconnected', (data: User) => controller.disconnect);
  });
};
