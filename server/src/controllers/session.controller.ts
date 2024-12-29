import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'; // FOR GENERATING UNIQUE SESSION IDS

// MOCK IN-MEMORY DATABASE
const sessions: Record<string, any> = {};

export class SessionController {
  // CREATE NEW SESSION
  static async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, hostUserId } = req.body;
      const sessionId: string  = uuidv4();
      sessions[sessionId] = {
        sessionId,
        quizId,
        hostUserId,
        players: [],
        status: "created", // Possible statuses: created, ongoing, ended
        createdAt: new Date(),
      };

      res.status(201).json({ sessionId, message: "Session created successfully" });
    } catch (error: any) {
      console.error("Error creating session:", error);
      res.status(500).send("Internal server error");
    }
  }

  // GET SESSION DETAILS
  static async getSession(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const session = sessions[id];

      if (!session) {
        res.status(404).send("Session not found");
        return;
      }

      res.status(200).json(session);
    } catch (error: any) {
      console.error("Error retrieving session:", error);
      res.status(500).send("Internal server error");
    }
  }

  // START SESSION
  static async startSession(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const session = sessions[id];

      if (!session) {
        res.status(404).send("Session not found");
        return;
      }

      session.status = "ongoing";
      res.status(200).json({ sessionId: id, message: "Session started" });
    } catch (error: any) {
      console.error("Error starting session:", error);
      res.status(500).send("Internal server error");
    }
  }

  // MOVE TO NEXT QUESTION (PLACEHOLDER)
  static async moveToNext(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      res.status(200).json({ sessionId: id, message: "Moved to next question" });
    } catch (error: any) {
      console.error("Error moving to next:", error);
      res.status(500).send("Internal server error");
    }
  }

  // END SESSION
  static async endSession(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const session = sessions[id];

      if (!session) {
        res.status(404).send("Session not found");
        return;
      }

      session.status = "ended";
      res.status(200).json({ sessionId: id, message: "Session ended" });
    } catch (error: any) {
      console.error("Error ending session:", error);
      res.status(500).send("Internal server error");
    }
  }
}
