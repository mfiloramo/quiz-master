import express, { Router } from 'express';
import { QuestionController } from "../controllers/question.controller";


const router: Router = express.Router();

router.post('/:questionId', QuestionController.addQuestion);
router.get('/', QuestionController.getQuestions);
router.get('/:questionId', QuestionController.getQuestionById);
router.put('/:questionId', QuestionController.updateQuestion);
router.delete('/:questionId', QuestionController.deleteQuestion);


export const questionRouter: Router = router;
