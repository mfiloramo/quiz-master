import { Socket } from "socket.io";

export class WebSocketController {
  // PLAYER JOINS SESSION
  joinSession(socket: Socket, data: { sessionId: string; playerId: string }): void {
    const { sessionId, playerId } = data;
    console.log(`Player ${ playerId } is joining session ${ sessionId }`);
    socket.join(sessionId);
    socket.to(sessionId).emit("player-joined", { playerId });
  }

  // START WEBSOCKET SESSION
  startSession(socket: Socket, data: { sessionId: string }): void {
    const { sessionId } = data;
    console.log(`Session ${ sessionId } is starting`);
    socket.to(sessionId).emit("session-started");
  }

  // HANDLE PLAYER ANSWER SUBMISSION
  submitAnswer(socket: Socket, data: { sessionId: string; playerId: string; answer: number }): void {
    const { sessionId, playerId, answer } = data;
    console.log(`Player ${ playerId } submitted answer ${ answer } for session ${ sessionId }`);
    // Simulate answer validation (replace with actual logic)
    const isCorrect = Math.random() < 0.5;
    socket.to(sessionId).emit("answer-received", { playerId, answer, isCorrect });
  }

  // END WEBSOCKET SESSION
  endSession(socket: Socket, data: { sessionId: string }): void {
    const { sessionId } = data;
    console.log(`Session ${ sessionId } is ending`);
    socket.to(sessionId).emit("session-ended");
  }

  // HANDLE CLIENT DISCONNECTION
  disconnect(socket: Socket): void {
    console.log(`Socket disconnected: ${ socket.id }`);
  }
}
