import { Request, Response } from "express";
import { sequelize } from "../config/sequelize";
import { redis } from '../config/redis';

export class QuizController {
  // CREATE NEW QUIZ
  static async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE QUIZ DATA FROM REQUEST BODY
      const { userId, username, title, description, visibility } = req.body;

      // EXECUTE STORED PROCEDURE TO CREATE QUIZ AND RETURN NEW QUIZ IN QUERY
      const newQuizId: any = await sequelize.query(
        "EXECUTE CreateQuiz :userId, :username, :title, :description, :visibility",
        {
          replacements: { userId, username, title, description, visibility }
        }
      );

      // SEND NEW QUIZ ID
      res.status(200).json({ 'newQuizId': newQuizId[0][0].id });
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
      const cached: string | null = await redis.get(cacheKey);

      let quizzes: any[];

      if (cached) {
        // CACHE HIT: ATTEMPT TO RETRIEVE ALL QUIZ QUESTIONS FROM REDIS
        console.log('Cache hit: All quizzes...');
        quizzes = JSON.parse(cached);
      } else {
        // CACHE MISS: QUERY DATABASE FOR QUESTIONS IN SELECTED QUIZ
        console.log('Cache miss: All quizzes...');
        quizzes = await sequelize.query("EXECUTE GetAllQuizzes");

        // STORE DATA IN REDIS
        await redis.set(cacheKey, JSON.stringify(quizzes));
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
      const cached: string | null = await redis.get(cacheKey);

      // DECLARE/DEFINE QUIZZES ARRAY
      let quizzes = [];

      if (cached) {
        // CACHE HIT — PARSE QUESTIONS FROM REDIS
        console.log('Cache hit: User quizzes...');
        quizzes = JSON.parse(cached);
        // SEND CACHED DATA
        res.send(quizzes[0]);
      } else {
        // CACHE MISS — QUERY DATABASE FOR ALL QUIZZES BELONGING TO USER
        quizzes = await sequelize.query(
          "EXECUTE GetQuizzesByUserId :userId",
          {
            replacements: { userId },
          },
        );

        // CACHE MISS CONTINUED — STORE FORMATTED QUESTIONS IN REDIS
        console.log('Cache miss: User quizzes...');
        await redis.set(cacheKey, JSON.stringify(quizzes));

        // SEND QUERIED DATA FROM DATABASE
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
        redis.del(`quiz:${ id }:questions`);
        console.log('Quiz updated in cache successfully...');

        // CLEAR CACHE KEY CONTAINING ALL QUIZZES
        redis.del(`discover:all:quizzes`);
        console.log('Quiz Discover list deleted from cache...')
      });

      // SEND SUCCESS RESPONSE TO CLIENT
      res.status(200).send(`Quiz with ID: ${ id } updated successfully`);
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
      });

      let id;

      // CLEAR QUIZ FROM CACHE
      const deleted = await redis.del(`quiz:${ quizId }:questions`);
      if (deleted === 1) {
        console.log('Quiz deleted from cache successfully...');
      } else {
        console.warn('Quiz not found in cache or already deleted...');
      }

      const userId = await sequelize.query('EXECUTE Temp_GetUserIdByQuizId :quizId',
        {
          replacements: { quizId },
        });

      // EXTRACT DATA FROM RESULT
      if (userId) {
        // @ts-ignore
        id = userId[0][0].user_id;
      }

      // UPDATE USER'S CACHED QUIZZES LIST
      await redis.del(`user:${ id }:quizzes`)
        .then((response: any): void => {
          console.log(`Quizzes deleted in User's cache with response of ${response}...`);
        })

      // CLEAR CACHE KEY CONTAINING ALL QUIZZES
      await redis.del(`discover:all:quizzes`)
        .then((response: any): void => {
          console.log(`Quizzes deleted in Discover with response of: ${ response }...`);
        });

      // SEND SUCCESS RESPONSE TO CLIENT
      res.status(200).send(`Quiz with ID: ${ quizId } deleted successfully`);
    } catch (error: any) {
      // HANDLE ERRORS FROM DB OR REDIS
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }
}
