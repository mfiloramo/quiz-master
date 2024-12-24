import express, { Router } from 'express';
import { QuizController } from "../controllers/quiz.controller";


const router: Router = express.Router();

router.post('/', QuizController.createQuiz);
router.get('/', QuizController.getAllQuizzes);
router.get('/:id', QuizController.getQuizById);
router.put('/:id', QuizController.updateQuiz);
router.delete('/:id', QuizController.deleteQuiz);


export const quizRouter: Router = router;
