import express, { Router } from "express";
import { QuestionController } from "../controllers/question.controller";

const router: Router = express.Router();

// PROTECT ALL ROUTES WITH JWT VERIFICATION MIDDLEWARE
// router.use(authenticateJWT);

router.post("/:quizId", QuestionController.addQuestion);
router.get("/", QuestionController.getAllQuestions);
router.get("/:questionId", QuestionController.getQuestionById);
router.get("/quiz/:quizId/", QuestionController.getQuestionsByQuizId);
router.put("/:questionId", QuestionController.updateQuestion);
router.delete("/:questionId", QuestionController.deleteQuestion);

export const questionRouter: Router = router;
