import express, { Router } from 'express';
import { QuestionController } from "../controllers/question.controller";


const router: Router = express.Router();

// PROTECT ALL ROUTES WITH JWT VERIFICATION MIDDLEWARE
// router.use(authenticateJWT);

router.post('/:questionId', QuestionController.addQuestion);
router.get('/', QuestionController.getAllQuestions);
router.get('/:questionId', QuestionController.getQuestionById);
// TODO: MAKE ROUTE MORE INTUITIVE; ONE PARAM NOT USED IN CONTROLLER; CONSIDER ADDING LONGER PATH
router.get('/:quizId/:questionId/', QuestionController.getQuestionsByQuizId);
router.put('/:questionId', QuestionController.updateQuestion);
router.delete('/:questionId', QuestionController.deleteQuestion);


export const questionRouter: Router = router;
