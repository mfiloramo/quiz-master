import express, { Router } from 'express';
import { questionsController } from "../controllers/questions.controller";


const router: Router = express.Router();

router.post('/quizzes/:quizId/questions', questionsController);
router.get('/quizzes/:quizId/questions', questionsController);
router.get('/quizzes/:quizId/questions/:id', questionsController);
router.put('/quizzes/:quizId/questions/:id', questionsController);
router.delete('/quizzes/:quizId/questions/:id', questionsController);


export const questionsRouter: Router = router;
