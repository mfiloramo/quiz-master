import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sequelize } from "../config/sequelize";
import jwt from "jsonwebtoken";
import { EmailService } from "../services/EmailService";
import { redisClient } from '../config/redis';
import { UserAttributes } from '../interfaces/UserAttributes.interface';


export class AuthController {
  // REGISTER NEW USER
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, password, accountType } = req.body;

      // HASH PASSWORD
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

      // STORE USER RESULT
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
      // DESTRUCTURE EMAIL AND PASSWORD DATA FROM REQUEST BODY
      const { email, password } = req.body;

      // TODO: MUST CREATE KEY BASED ON USER ID
      // GENERATE REDIS CACHE KEY
      const cacheKey: string = `user:${email}`;

      // CACHE HIT: ATTEMPT TO GET CACHED DATA
      const cached: string | null = await redisClient.get(cacheKey);

      let user!: UserAttributes;

      if (cached) {
        // CACHE HIT: ATTEMPT TO RETRIEVE USER DATA
        console.log('Cache hit: User data for login...');
        user = JSON.parse(cached);
      } else {
        // CACHE MISS: EXECUTE STORED PROCEDURE TO QUERY USER BY EMAIL
        console.log('Cache miss: User data for login...');
        const [ rows ]: any = await sequelize.query(
          "EXECUTE GetUserByEmail :email",
          { replacements: { email } }
        )

        // CHECK USER VALIDITY
        user = rows[0];

        // SET USER DATA
        await redisClient.set(cacheKey, JSON.stringify(user));

        // CHECK IF USER IS VALID
        if (!user) {
          return res.status(401).send("Invalid email or password");
        }
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
          account_type: user.account_type
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );

      // RETURN TOKEN TO CLIENT
      return res.status(200).json({ token });
    } catch (error: any) {
      // LOG ERROR IF ERROR
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
      // TODO: DISABLE AND ADD ADMIN APPROVAL
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
        ).then((response: any): any => {
          res.redirect(`${process.env.CLIENT_URL}/auth/login`);
          return;
        });
      }
    } catch (error: any) {
      console.error(error);
      return;
    }
  }
}
