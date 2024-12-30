import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { sequelize } from "../config/sequelize";


export class AuthController {
  // REGISTER NEW USER
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      // HASH PASSWORD
      const saltRounds: number = 10;
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);

      // INSERT NEW USER INTO DATABASE
      await sequelize.query('EXECUTE RegisterUser :username :email :password',
        {
          replacements: { username, email, password: hashedPassword }
        });
      res.send(`Username ${ username } created successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {

    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send('AuthController logout successful!');
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
}
