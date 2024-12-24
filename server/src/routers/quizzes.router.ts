import express, { Router } from 'express';
import { quizzesController } from "../controllers/quizzes.controller";


const router: Router = express.Router();

router.post('/', quizzesController);
router.get('/', quizzesController);
router.get('/:id', quizzesController);
router.put('/:id', quizzesController);
router.delete('/:id', quizzesController);


export const quizzesRouter: Router = router;
