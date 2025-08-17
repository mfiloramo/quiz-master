import express, { Router } from "express";
import { QuestionController } from "../controllers/question.controller";
import { authenticateJWT } from '../middleware/authenticateJWT';

const router: Router = express.Router();

// PROTECT ALL ROUTES WITH JWT VERIFICATION MIDDLEWARE
router.use(authenticateJWT);

router.post("/:quizId", QuestionController.addQuestion);
router.get("/quiz/:quizId/", QuestionController.getQuestionsByQuizId);
router.put("/:questionId", QuestionController.updateQuestion);
router.delete("/:quizId/:questionId", QuestionController.deleteQuestion);

export const questionRouter: Router = router;
