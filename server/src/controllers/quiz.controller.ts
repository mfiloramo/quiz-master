import { Request, Response } from "express";
import { sequelize } from "../config/sequelize";

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
      const { userId } = req.params;
      const quizzes: any[] = await sequelize.query(
        "EXECUTE GetQuizzesByUserId :userId",
        {
          replacements: { userId },
        },
      );
      res.send(quizzes[0]);
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
