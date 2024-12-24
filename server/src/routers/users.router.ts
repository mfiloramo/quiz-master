import express, { Router } from 'express';
import { UsersController } from "../controllers/users.controller";


const router: Router = express.Router();

router.get('/:id', UsersController.getUserById);
router.put('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);


export const usersRouter: Router = router;
