import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const JWT_SECRET: string = process.env.JWT_SECRET!;

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers.authorization?.trim();

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    req.body.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
