import { Request, Response } from "express";
import { sequelize } from "../config/sequelize";
import { redis } from '../config/redis';
import Question from '../models/Question';
import Quiz from '../models/Quiz';
import question from '../models/Question';

export class QuestionController {
  // ADD NEW QUESTION TO DATABASE
  static async addQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, question, options, correct } = req.body;

      const result: any = await sequelize.query(
        "EXECUTE AddQuestion :quizId, :question, :options, :correct",
        {
          replacements: { quizId, question, options, correct },
        }
      );

      const newQuestionId = result[0][0].id;

      res.status(201).json({
        id: newQuestionId,
        quizId,
        question,
        options,
        correct,
      });
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // GET ALL QUESTIONS BY QUIZ ID
  static async getQuestionsByQuizId(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE QUIZ ID
      const { quizId } = req.params;

      // GENERATE REDIS CACHE KEY
      const cacheKey: string = `quiz:${ quizId }:questions`;

      // CACHE HIT: ATTEMPT TO RETRIEVE QUIZ QUESTIONS
      const cached: string | null = await redis.get(cacheKey)

      // DECLARE/DEFINE QUESTIONS ARRAY
      let questions: any[];

      if (cached) {
        // CACHE HIT — PARSE QUESTIONS FROM REDIS
        console.log('Cache hit: User quizzes...');
        questions = JSON.parse(cached);
        console.log(questions[0]);

        // SEND CACHED DATA
        res.send(questions[0]);
      } else {
        // CACHE MISS — QUERY DATABASE FOR ALL QUIZZES BELONGING TO USER
        questions = await sequelize.query(
          "EXECUTE GetQuestionsByQuizId :quizId",
          {
            replacements: { quizId }
          },
        );

        // CACHE MISS CONTINUED — STORE FORMATTED QUESTIONS IN REDIS
        console.log('Cache miss: User quizzes...');
        await redis.set(cacheKey, JSON.stringify(questions[0]));

        // SEND QUERIED DATA FROM DATABASE
        res.send(questions[0]);
      }
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // UPDATE EXISTING QUESTION
  static async updateQuestion(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE DATA FROM REQUEST BODY
      const { quizId, questionId, question, options, correct } = req.body;

      // EXECUTE STORED PROCEDURE TO QUERY DATABASE WITH UPDATED QUESTION DATA
      await sequelize.query(
        "EXECUTE UpdateQuestion :questionId, :question, :options, :correct",
        {
          replacements: { questionId, question, options, correct },
        },
      ).then(() => {
        // CLEAR QUIZ FROM CACHE
        const cacheKey: string = `quiz:${ quizId }:questions`
        redis.del(cacheKey);
        console.log('Quiz updated in cache successfully...');
      });
      res.status(200).send(`Question with ID: ${questionId} updated successfully`);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }

  // DELETE EXISTING QUESTION
  static async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE QUESTION ID FROM PARAMS
      const { quizId, questionId } = req.params;

      // DELETE QUESTION FROM DATABASE
      await sequelize.query("EXECUTE DeleteQuestion :questionId", {
        replacements: { questionId },
      });

      // DELETE QUESTION FROM QUIZ IN CACHE
      const cacheKey: string = `quiz:${ quizId }:questions`;

      // CLEAR QUIZ FROM CACHE
      const deleted = await redis.del(cacheKey);
      if (deleted === 1) {
        console.log('Quiz deleted from cache successfully...');
      } else {
        console.warn('Quiz not found in cache or already deleted...');
      }

      res.status(200).send(`Question with ID: ${questionId} deleted successfully`);
    } catch (error: any) {
      console.error("Error executing Stored Procedure:", error.message);
      res.status(500).send("Internal server error");
    }
  }
}
