import express, { Router } from 'express';
import { sessionsController } from "../controllers/sessions.controller";


const router: Router = express.Router();

router.post('/:id/join', sessionsController);
router.post('/:id/answer', sessionsController);
router.get('/:id/leaderboard', sessionsController);


export const playersRouter: Router = router;
