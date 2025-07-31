import { Request, Response } from "express";
import { sequelize } from "../config/sequelize";
import { redisClient } from '../config/redis';
import { QuizAttributes } from '../interfaces/QuizAttributes.interface';
import session from '../models/Session';

export class QuizController {
  // CREATE NEW QUIZ
  static async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE QUIZ DATA FROM REEUQEST BODY
      const { userId, username, title, description, visibility } = req.body;

      // EXECUTE STORED PROCEDURE TO CREATE QUIZ AND RETURN NEW QUIZ IN QUERY
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
      // GENERATE REDIS CACHE KEY
      const cacheKey: string = `discover:all:quizzes`;

      // ATTEMPT TO GET CACHED DATA
      const cached: string | null = await redisClient.get(cacheKey);

      let quizzes: any[];

      if (cached) {
        // CACHE HIT: ATTEMPT TO RETRIEVE ALL QUIZ QUESTIONS FROM REDIS
        console.log('Cache hit: All quizzes...');
        quizzes = JSON.parse(cached);
      } else {
        // CACHE MISS: QUERY DATABASE FOR QUESTIONS IN SELECTED QUIZ
        console.log('Cache miss: Quiz questions...');
        quizzes = await sequelize.query("EXECUTE GetAllQuizzes");

        // STORE DATA IN REDIS
        await redisClient.set(cacheKey, JSON.stringify(quizzes));
      }

      // SEND ALL PUBLIC QUIZZES
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
      const cacheKey: string = `user:${ userId }:quizzes`;

      // CACHE HIT: ATTEMPT TO RETRIEVE USER'S QUIZZES
      const cached: string | null = await redisClient.get(cacheKey);

      let quizzes: QuizAttributes[];

      if (cached) {
        // CACHE HIT — PARSE QUESTIONS FROM REDIS
        console.log('Cache hit: User quizzes...');
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
        console.log('Cache miss: User quizzes...');
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
      // DESTRUCTURE DATA FROM REQUEST BODY
      const { id, title, description, visibility } = req.body;

      // EXECUTE STORED PROCEDURE TO QUERY DATABASE WITH UPDATED QUIZ DATA
      await sequelize.query(
        "EXECUTE UpdateQuiz :id, :title, :description, :visibility",
        {
          replacements: { id, title, description, visibility },
        },
      ).then(() => {
        // CLEAR QUIZ FROM CACHE
        redisClient.del(`quiz:${id}:questions`);
        console.log('Quiz updated in cache successfully')
      });

      // SEND SUCCESS RESPONSE TO CLIENT
      res.status(200).send(`Quiz with ID: ${id} updated successfully`);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // DELETE QUIZ BY ID
  static async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE DATA FROM REQUEST PARAMS
      const { quizId } = req.params;

      // EXECUTE STORED PROCEDURE TO QUERY DATABASE WITH DELETE QUIZ DATA
      await sequelize.query("EXECUTE DeleteQuiz :quizId", {
        replacements: { quizId },
      }).then(() => {
        // CLEAR QUIZ FROM CACHE
        redisClient.del(`quiz:${quizId}:questions`);
        console.log('Quiz updated in cache successfully')
      });

      // SEND SUCCESS RESPONSE TO CLIENT
      res.status(200).send(`Quiz with ID: ${quizId} deleted successfully`);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }
}
