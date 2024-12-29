import express, { Router } from 'express';
import { QuizController } from "../controllers/quiz.controller";


const router: Router = express.Router();

router.post('/', QuizController.createQuiz);
router.get('/', QuizController.getAllQuizzes);
router.get('/:quizId', QuizController.getQuizById);
router.put('/:quizId', QuizController.updateQuiz);
router.delete('/:quizId', QuizController.deleteQuiz);


export const quizRouter: Router = router;
