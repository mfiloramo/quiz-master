import express, { Router } from 'express';
import { UserController } from "../controllers/user.controller";


const router: Router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);


export const userRouter: Router = router;
