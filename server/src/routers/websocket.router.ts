import { Server, Socket } from 'socket.io';
import { WebSocketController } from '../controllers/websocket.controller';

export const webSocketRouter = (io: Server): void => {
  const controller = new WebSocketController(io);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('create-session', (data) => controller.createSession(socket, data));
    socket.on('join-session', (data) => controller.joinSession(socket, data));
    socket.on('start-session', async (data) => await controller.startSession(socket, data));
    socket.on('leave-session', () => controller.leaveSession(socket));
    socket.on('get-current-question', (data) => controller.getCurrentQuestion(socket, data));
    socket.on('disconnect', () => controller.handleDisconnect(socket));
  });
};
