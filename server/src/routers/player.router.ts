import express, { Router } from 'express';
import { PlayerController } from "../controllers/player.controller";
import { authenticateJWT } from '../middleware/authenticateJWT';


const router: Router = express.Router();

// PROTECT ALL ROUTES WITH JWT VERIFICATION MIDDLEWARE
router.use(authenticateJWT);

router.post('/:id/join', PlayerController.joinSession);
router.post('/:id/answer', PlayerController.submitAnswer);
router.get('/:id/leaderboard', PlayerController.getLeaderboard);


export const playerRouter: Router = router;
