import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { sequelize } from "../config/sequelize";
import jwt from 'jsonwebtoken';

const blacklistedTokens = new Set<string>(); // TEMPORARY IN-MEMORY BLACKLIST. REPLACE WITH A DB OR REDIS.

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

      return res.status(201).send(`Username ${username} created successfully`);
    } catch (error: any) {
      console.error('ERROR EXECUTING STORED PROCEDURE:', error.message);
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
      const isPasswordValid: boolean = await bcrypt.compare(password, user[0].password).then(((response: boolean) => response));

      if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password');
      }

      // GENERATE JWT AND ISSUE TO USER
      const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      return res.status(500).send('Internal server error');
    }
  }

  // LOGOUT USER
  static async logout(req: Request, res: Response): Promise<any> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(400).send('No token provided');
      }

      // ADD THE TOKEN TO THE BLACKLIST
      blacklistedTokens.add(token);

      return res.status(200).send('User logged out successfully');
    } catch (error: any) {
      console.error('ERROR DURING LOGOUT:', error.message);
      return res.status(500).send('Internal server error');
    }
  }

  // MIDDLEWARE TO VERIFY TOKENS AND CHECK BLACKLIST
  static verifyToken(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    // CHECK IF TOKEN IS BLACKLISTED
    if (blacklistedTokens.has(token)) {
      return res.status(401).send('Token is invalidated. Please log in again.');
    }

    try {
      req.body.user = jwt.verify(token, process.env.JWT_SECRET!); // ATTACH USER INFO TO THE REQUEST OBJECT
      next();
    } catch (error: any) {
      return res.status(401).send('Invalid token');
    }
  }
}
