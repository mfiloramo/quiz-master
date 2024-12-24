import express, { Router } from 'express';
import { sessionController } from "../controllers/session.controller";


const router: Router = express.Router();

router.post('/', sessionController);
router.get('/:id/start', sessionController);
router.get('/:id/next', sessionController);
router.put('/:id', sessionController);
router.delete('/:id', sessionController);


export const sessionRouter: Router = router;
