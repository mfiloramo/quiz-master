import { Server, Socket } from 'socket.io';
import { WebSocketController } from '../controllers/websocket.controller';

export const webSocketRouter = (io: Server): void => {
  const controller = new WebSocketController(io);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // SETUP SOCKET EVENT ROUTING
    socket.on('create-session', (data: any) => controller.createSession(socket, data));
    socket.on('join-session', (data: any) => controller.joinSession(socket, data));
    socket.on('start-session', async (data: any) => await controller.startSession(socket, data));
    socket.on('check-session', async (data: any) => await controller.checkSession(socket, data));
    socket.on('leave-session', () => controller.leaveSession(socket));
    socket.on('get-current-question', (data: any) => controller.getCurrentQuestion(socket, data));
    socket.on('next-question', (data: any) => controller.handleNextQuestion(data));
    socket.on('submit-answer', (data: any) => controller.submitAnswer(socket, data));
    socket.on('host-left', (data: any) => controller.handleHostLeft(data));
    socket.on('eject-player', (data: any) => controller.handleEjectPlayer(socket, data));
    socket.on('get-players', (data: any) => controller.getPlayers(socket, data));
    socket.on('skip-question', (data: any) => controller.handleSkipQuestion(data));
    socket.on('get-game-start-timer', (data: any) => controller.getGameStartTimer(socket, data));
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      controller.handleDisconnect(socket)
    });
  });
};
