import express, { Router } from 'express';
import { websocketController } from "../controllers/websocket.controller";


const router: Router = express.Router();

router.post('/', websocketController);


export const websocketRouter: Router = router;
