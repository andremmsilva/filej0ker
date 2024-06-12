// middleware/auth.js
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userEmail?: string | JwtPayload;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userEmail = user;
    next();
  });
}
