import express, { Router } from 'express';
import { authController } from "../controllers/auth.controller";


const router: Router = express.Router();

router.post('/register', authController);
router.post('/login', authController);
router.post('/logout', authController);


export const authRouter: Router = router;
