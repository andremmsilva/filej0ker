// middleware/auth.js
import type { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { email: string };
    }
  }
}

function isJwtPayloadWithEmail(
  user: any
): user is JwtPayload & { email: string } {
  return user && typeof user.email === 'string';
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.sendStatus(403);

    if (isJwtPayloadWithEmail(decoded)) {
      req.user = decoded;
    } else {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    next();
  });
}
