import express, { Router } from 'express';
import { SessionController } from "../controllers/session.controller";


const router: Router = express.Router();

router.post('/', SessionController.createSession);
router.get('/:id', SessionController.getSession);
router.put('/:id/start', SessionController.startSession);
router.put('/:id/next', SessionController.moveToNext);
router.delete('/:id/end', SessionController.endSession);


export const sessionRouter: Router = router;
