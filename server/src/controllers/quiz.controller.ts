import { Request, Response } from 'express';
import axios from 'axios';


export class QuizController {
  static async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('QuizController createQuiz successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getAllQuizzes(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('QuizController getAllQuizzes successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getQuizById(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuizController getQuizById successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async updateQuiz(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuizController updateQuiz successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async deleteQuiz(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuizController deleteQuiz successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}


