import { Request, Response } from "express";
import { sequelize } from "../config/sequelize";
import { redisClient } from '../config/redis';
import Quiz from '../models/Quiz';

export class QuizController {
  // CREATE NEW QUIZ
  static async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { userId, username, title, description, visibility } = req.body;
      const newQuizId: any = await sequelize.query(
        "EXECUTE CreateQuiz :userId, :username, :title, :description, :visibility",
        {
          replacements: { userId, username, title, description, visibility },
        },
      );
      // SEND NEW QUIZ ID
      res.status(200).json({'newQuizId': newQuizId[0][0].id});
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // GET ALL QUIZZES
  static async getAllQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const quizzes: any[] = await sequelize.query("EXECUTE GetAllQuizzes");
      res.send(quizzes[0]);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // GET QUIZ BY ID
  static async getQuizById(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      const quiz: any = await sequelize.query("EXECUTE GetQuizById :quizId", {
        replacements: { quizId },
      });
      res.send(quiz[0][0]);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // GET QUIZZES BY USER ID
  static async getQuizzesByUserId(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE USER ID
      const { userId } = req.params;

      // GENERATE REDIS CACHE KEY
      const cacheKey = `user:${ userId }:quizzes`;

      // CACHE HIT: ATTEMPT TO RETRIEVE USER'S QUIZZES
      const cached = await redisClient.get(cacheKey);

      let quizzes: Quiz[]

      if (cached) {
        // CACHE HIT — PARSE QUESTIONS FROM REDIS
        console.log('Cache Hit: User Quizzes...');
        quizzes = JSON.parse(cached);
        // SEND CACHED DATA
        res.send(quizzes[0]);
      } else {
        // CACHE MISS — QUERY DATABASE FOR ALL QUIZZES BELONGING TO USER
        const quizzes: any[] = await sequelize.query(
          "EXECUTE GetQuizzesByUserId :userId",
          {
            replacements: { userId },
          },
        );
        // CACHE MISS CONTINUED — STORE FORMATTED QUESTIONS IN REDIS
        console.log('Cache Miss: User Quizzes...');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        await redisClient.set(cacheKey, JSON.stringify(quizzes));

        // SEND NEW DATA
        res.send(quizzes[0]);
      }
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // UPDATE QUIZ BY ID
  static async updateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id, title, description, visibility } = req.body;
      await sequelize.query(
        "EXECUTE UpdateQuiz :id, :title, :description, :visibility",
        {
          replacements: { id, title, description, visibility },
        },
      );
      res.status(200).send(`Quiz with ID: ${id} updated successfully`);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // DELETE QUIZ BY ID
  static async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      await sequelize.query("EXECUTE DeleteQuiz :quizId", {
        replacements: { quizId },
      });
      res.status(200).send(`Quiz with ID: ${quizId} deleted successfully`);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }
}
