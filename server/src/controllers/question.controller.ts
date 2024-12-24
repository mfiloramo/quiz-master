import { Request, Response } from 'express';
import axios from 'axios';


export class QuestionController {
  static async addQuestion(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('QuestionController addQuestion successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getQuestions(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('QuestionController getQuestions successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getQuestionById(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuestionController getQuestionById successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async updateQuestion(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuestionController updateQuestion successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async deleteQuestion(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('QuestionController deleteQuestion successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}


