import express, { Router } from 'express';
import { PlayerController } from "../controllers/player.controller";


const router: Router = express.Router();

router.post('/:id/join', PlayerController.joinSession);
router.post('/:id/answer', PlayerController.submitAnswer);
router.get('/:id/leaderboard', PlayerController.getLeaderboard);


export const playerRouter: Router = router;
