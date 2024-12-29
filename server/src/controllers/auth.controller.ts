import { Request, Response } from 'express';
import axios from 'axios';


export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('AuthController register successful!');
    } catch (error: any) {
      res.status(500).send('Internal server error');
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('AuthController login successful!');
    } catch (error: any) {
      res.status(500).send('Internal server error');
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('AuthController logout successful!');
    } catch (error: any) {
      res.status(500).send('Internal server error');
    }
  }
}


