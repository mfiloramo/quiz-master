import express, { Router } from 'express';
import { usersController } from "../controllers/users.controller";


const router: Router = express.Router();

router.get('/', usersController);
router.post('/auth/register', usersController);
router.post('/auth/login', usersController);
router.get('/:id', usersController);
router.put('/:id', usersController);
router.delete('/:id', usersController);


export const usersRouter: Router = router;
