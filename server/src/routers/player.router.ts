import express, { Router } from 'express';
import { sessionController } from "../controllers/session.controller";


const router: Router = express.Router();

router.post('/:id/join', sessionController);
router.post('/:id/answer', sessionController);
router.get('/:id/leaderboard', sessionController);


export const playerRouter: Router = router;
