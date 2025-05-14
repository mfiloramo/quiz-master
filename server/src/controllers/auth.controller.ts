import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sequelize } from "../config/sequelize";
import jwt from "jsonwebtoken";
import { EmailService } from "../services/EmailService";


export class AuthController {
  // REGISTER NEW USER
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password, accountType } = req.body;

      const saltRounds: number = 10;
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);

      // INSERT NEW USER INTO DATABASE AND GET USER ID
      const [result]: any = await sequelize.query(
        "EXECUTE RegisterUser :username, :email, :password, :account_type",
        {
          replacements: {
            username,
            email,
            password: hashedPassword,
            account_type: accountType
          },
        }
      );

      const newUserId = result[0]?.id;

      // SEND CONFIRMATION EMAIL
      await EmailService.sendConfirmationEmail({
        userId: newUserId,
        userName: username,
        userEmail: email
      });

      return res.status(201).send(`Username ${username} created successfully. Please check your email to confirm your account.`);
    } catch (error: any) {
      console.error("Error registering user:", error.message);
      return res.status(500).send("Internal server error");
    }
  }

  // LOGIN USER AFTER VALIDATION
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      const [rows]: any = await sequelize.query(
        "EXECUTE GetUserByEmail :email",
        { replacements: { email } },
      );

      const user = rows[0];

      if (!user) {
        return res.status(401).send("Invalid email or password");
      }

      // CHECK PASSWORD VALIDITY
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(401).send("Invalid email or password");
      }

      // CHECK WHETHER ACCOUNT IS ACTIVE
      const isAccountActive: boolean = user.isActive;

      if (!isAccountActive) {
        return res.status(401).send("Account is not active");
      }

      // SIGN JWT
      const token: string = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          isActive: user.isActive,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );

      console.log(user);

      return res.status(200).json({ token });
    } catch (error: any) {
      console.error("Error logging in user:", error.message);
      return res.status(500).send("Internal server error");
    }
  }

  // LOGOUT USER
  static async logout(req: Request, res: Response): Promise<any> {
    try {
      const token: string | undefined =
        req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).send("No token provided");
      }

      // TODO: ADD TOKEN TO BLACKLIST OR EXPIRE IT
      // TODO: CONSIDER IMPLEMENTING EXPRESS-SESSION
      // ...

      return res.status(200).send("User logged out successfully");
    } catch (error: any) {
      console.error("Error during logout:", error.message);
      return res.status(500).send("Internal server error");
    }
  }

  // ACTIVATE USER ACCOUNT
  static async activateUserAccount(req: Request, res: Response): Promise<any> {
    try {
      // CHECK FOR VALID SECRET_REGISTRATION_KEY
      if (!process.env.SECRET_REGISTRATION_KEY) {
        throw new Error('SECRET_REGISTRATION_KEY is not set');
      }

      // VERIFY JSON WEB TOKEN
      const decoded: any = jwt.verify(req.params.token, process.env.SECRET_REGISTRATION_KEY!);
      const userId: any = decoded.userId;

      // ACTIVATE USER ACCOUNT
      if (userId) {
        await sequelize.query(
          "EXECUTE ActivateUser :userId",
          {
            replacements: {
              userId
            },
          },
        ).then((response) => {
          console.log(`${process.env.CLIENT_URL}/auth/login`);
          res.redirect(`${process.env.CLIENT_URL}/auth/login`);
          return
        });
      }
    } catch (error: any) {
      console.error(error);
      return;
    }
  }
}
