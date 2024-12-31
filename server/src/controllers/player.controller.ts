import { Request, Response } from 'express';


export class PlayerController {
  static async joinSession(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('PlayerController joinSession successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async submitAnswer(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('PlayerController submitAnswer successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('PlayerController getLeaderboard successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}


