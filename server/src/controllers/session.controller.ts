import { Request, Response } from 'express';
import axios from 'axios';


export class SessionController {
  static async createSession(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('QuestionController addQuestion successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getSession(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('QuestionController getQuestions successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async startSession(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuestionController getQuestionById successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async moveToNext(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuestionController updateQuestion successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async endSession(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuestionController deleteQuestion successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}


