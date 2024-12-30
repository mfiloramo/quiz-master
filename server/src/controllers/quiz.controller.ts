import { Request, Response } from 'express';
import axios from 'axios';
import { sequelize } from "../config/sequelize";


export class QuizController {
  // CREATE NEW QUIZ
  static async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { userId, title, description } = req.body;
      await sequelize.query('EXECUTE CreateQuiz :userId, :title, :description',
        {
          replacements: { userId, title, description }
        })
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  // GET ALL QUIZZES
  static async getAllQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const quizzes: any[] = await sequelize.query('EXECUTE GetAllQuizzes');
      res.send(quizzes[0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  // GET QUIZ BY ID
  static async getQuizById(req: Request, res: Response): Promise<void> {
    try {
      const { quizId }  = req.params;
      const quiz: any = await sequelize.query('EXECUTE GetQuizById :quizId',
        {
          replacements: { quizId }
        });
      res.send(quiz[0][0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  // UPDATE QUIZ BY ID
  static async updateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, title, description } = req.body;
      await sequelize.query('EXECUTE UpdateQuiz :quizid, :title, :description',
        {
          replacements: { quizId, title, description }
        });
      res.status(200).send(`Quiz with ID: ${ quizId } updated successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  // DELETE QUIZ BY ID
  static async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.body;
      await sequelize.query('EXECUTE DeleteQuiz :quizId',
        {
          replacements: { quizId }
        });
      res.status(200).send(`Quiz with ID: ${ quizId } deleted successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
}


