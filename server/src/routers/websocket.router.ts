import { Server, Socket } from "socket.io";
import { WebSocketController } from "../controllers/websocket.controller";

export const webSocketRouter = (io: Server): void => {
  const controller = new WebSocketController();

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Event handlers
    socket.on("join-session", (data) => controller.joinSession(socket, data));
    socket.on("start-session", (data) => controller.startSession(socket, data));
    socket.on("submit-answer", (data) => controller.submitAnswer(socket, data));
    socket.on("end-session", (data) => controller.endSession(socket, data));

    // Handle disconnection
    socket.on("disconnect", () => controller.disconnect(socket));
  });
};
