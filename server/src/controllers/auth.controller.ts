import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sequelize } from "../config/sequelize";
import jwt from "jsonwebtoken";
import { CourierClient } from "@trycourier/courier";


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
        "EXECUTE RegisterUser :username, :email, :password",
        {
          replacements: {
            username,
            email,
            password: hashedPassword,
          },
        },
      );

      return res.status(201).send(`Username ${username} created successfully`);
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

  // SEND ACCOUNT CONFIRMATION LINK
  static async sendConfirmEmail(req: Request, res: Response): Promise<void> {
    const { userId, userName, userEmail } = req.body;

    // CHECK FOR VALID SECRET_REGISTRATION_KEY
    if (!process.env.SECRET_REGISTRATION_KEY) {
      throw new Error('SECRET_REGISTRATION_KEY is not set');
    }

    // ISSUE JSON WEB TOKEN
    const token: string = jwt.sign({ userId }, process.env.SECRET_REGISTRATION_KEY, { expiresIn: '1d' }
    );

    // SET END POINT FOR CONFIRMING USER ACCOUNT REGISTRATION
    const activateAccountLink: string = `${ process.env.API_BASE_URL }/auth/activate/${ token }`;

    console.log(activateAccountLink);

    // SEND EMAIL NOTIFICATION TO USER
    const courier: CourierClient = new CourierClient({ authorizationToken: process.env.COURIER_AUTH_TOKEN });

    // SEND EMAIL NOTIFICATION TO USER
    await courier.send({
      message: {
        to: { email: userEmail },
        template: '57PER982K9405GJ632MWVJ8M2DWY',
        data: { userName, activateAccountLink }
      },
    })
      .then((response: any): void => {
        console.log('Email notification successfully sent with requestId of:', response.requestId)
      })
      .catch((error: any): void => {
        console.error(error)
      });
    res.json({ message: 'OK' });
    return;
  }
}
