import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { sequelize } from "../config/sequelize";
import jwt from 'jsonwebtoken';


export class AuthController {
  // REGISTER NEW USER
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password } = req.body;

      // HASH PASSWORD
      const saltRounds: number = 10;
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);

      // INSERT NEW USER INTO DATABASE
      await sequelize.query(
        'EXECUTE RegisterUser :username, :email, :password',
        { replacements: { username, email, password: hashedPassword } }
      );

      return res.status(201).send(`Username ${ username } created successfully`);
    } catch (error: any) {
      console.error('Error registering user:', error.message);
      return res.status(500).send('Internal server error');
    }
  }

  // LOGIN USER AFTER VALIDATION
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      // FIND USER BY EMAIL IN DATABASE
      const [ user ]: any = await sequelize.query('EXECUTE GetUserByEmail :email',
        {
          replacements: { email }
        });

      if (!user) {
        return res.status(401).send('Invalid email or password');
      }

      // VALIDATE PASSWORD AGAINST DATABASE
      const isPasswordValid: boolean = await bcrypt.compare(password, user[0].password)
        .then((response: boolean) => response);

      if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password');
      }

      // GENERATE JWT AND ISSUE TO USER
      const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } catch (error: any) {
      console.error('Error logging in user:', error.message);
      return res.status(500).send('Internal server error');
    }
  }

  // LOGOUT USER
  static async logout(req: Request, res: Response): Promise<any> {
    try {
      const token: string | undefined = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(400).send('No token provided');
      }

      // ADD TOKEN TO BLACKLIST OR EXPIRE IT
      // ...

      return res.status(200).send('User logged out successfully');
    } catch (error: any) {
      console.error('Error during logout:', error.message);
      return res.status(500).send('Internal server error');
    }
  }
}
