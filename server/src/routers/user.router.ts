import express, { Router } from 'express';
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/authenticateJWT";


const router: Router = express.Router();

// PROTECT ALL ROUTES WITH JWT VERIFICATION MIDDLEWARE
router.use(authenticateJWT);

router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);


export const userRouter: Router = router;
