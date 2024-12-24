import { Request, Response } from 'express';
import axios from 'axios';


export class UsersController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('AuthController register successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('UserController getUserById successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async updateUser(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('UserController updateUser successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  static async deleteUser(req: Request, res:
    Response): Promise<void> {
    try {
      res.status(200).send('UserController deleteUser successful!');
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}


