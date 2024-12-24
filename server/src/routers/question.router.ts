import express, { Router } from 'express';
import { questionController } from "../controllers/question.controller";


const router: Router = express.Router();

router.post('/quizzes/:quizId/questions', questionController);
router.get('/quizzes/:quizId/questions', questionController);
router.get('/quizzes/:quizId/questions/:id', questionController);
router.put('/quizzes/:quizId/questions/:id', questionController);
router.delete('/quizzes/:quizId/questions/:id', questionController);


export const questionRouter: Router = router;
