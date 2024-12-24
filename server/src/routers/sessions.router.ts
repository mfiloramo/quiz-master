import express, { Router } from 'express';
import { sessionsController } from "../controllers/sessions.controller";


const router: Router = express.Router();

router.post('/', sessionsController);
router.get('/:id/start', sessionsController);
router.get('/:id/next', sessionsController);
router.put('/:id', sessionsController);
router.delete('/:id', sessionsController);


export const sessionsRouter: Router = router;
