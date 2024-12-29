import express, { Router } from 'express';
import { UserController } from "../controllers/user.controller";


const router: Router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);


export const userRouter: Router = router;
