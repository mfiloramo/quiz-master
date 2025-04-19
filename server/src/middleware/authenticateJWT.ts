import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// JWT SECRET FROM .env
const JWT_SECRET: string = process.env.JWTSECRET!;

// JWT MIDDLEWARE
export const authenticateJWT: any = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader: string | string[] | undefined = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // BEARER TOKEN
    try {
      // VERIFY TOKEN
      const decoded: string | jwt.JwtPayload = jwt.verify(token, JWT_SECRET);
      // ATTACH DECODED PAYLOAD TO REQUEST OBJECT
      req.body.user = decoded;

      next();
    } catch (error: any) {
      res.status(403).send("Invalid or expired token");
    }
  } else {
    res.status(401).send("Authorization token missing");
  }
};
