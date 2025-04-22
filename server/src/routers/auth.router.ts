import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller'


const router: Router = express.Router();

// PROTECT ALL ROUTES WITH JWT VERIFICATION MIDDLEWARE
// router.use(authenticateJWT);

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/activate/:token', AuthController.activateUserAccount);


export const authRouter: Router = router;
