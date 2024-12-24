import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller'


const router: Router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);


export const authRouter: Router = router;
