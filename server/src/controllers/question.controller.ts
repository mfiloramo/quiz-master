import { Request, Response } from 'express';
import axios from 'axios';
import { sequelize } from "../config/sequelize";


export class QuestionController {
  static async addQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, question, options, correct } = req.body;
      await sequelize.query('EXECUTE AddQuestion :quizId, :question, :options, :correct',
        {
          replacements: { quizId, question, options, correct }
        });
      res.status(200).send(`Question added to Quiz ID: ${ quizId }.`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async getAllQuestions(req: Request, res: Response): Promise<void> {
    try {
      const questions: any = await sequelize.query('EXECUTE GetAllQuestions');
      res.send(questions[0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async getQuestionById(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.params;
      const question: any = await sequelize.query('EXECUTE GetQuestionById :questionId',
        {
          replacements: { questionId }
        });
      res.send(question[0][0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async getQuestionsByQuizId(req: Request, res: Response): Promise<void> {
    try {
      const { questionId, quizId } = req.params;
      const questions: any[] = await sequelize.query('EXECUTE GetQuestionsByQuizId :quizId',
        {
          replacements: { quizId }
        })
      res.send(questions[0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId, question, options, correct } = req.body;
      await sequelize.query('EXECUTE UpdateQuestion :questionId, :question, :options, :correct',
        {
          replacements: { questionId, question, options, correct }
        })
      res.status(200).send(`Question with ID: ${ questionId } updated successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId }  = req.body;

      await sequelize.query('EXECUTE DeleteQuestion :questionId',
        {
          replacements: { questionId }
        });
      res.status(200).send(`Question with ID: ${ questionId } deleted successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
}


