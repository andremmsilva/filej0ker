// middleware/auth.js
import type { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify, VerifyErrors } from 'jsonwebtoken';
import { AppError } from '../errors/appError';

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
  const tokenInCookies =
    req.url === '/refresh' ? req.cookies.refreshToken : req.cookies.accessToken;

  const token = req.headers['authorization']?.split(' ')[1] || tokenInCookies;
  if (!token) {
    return next(new AppError('No JWT provided', 401));
  }

  const secret =
    req.url === '/refresh'
      ? process.env.JWT_REFRESH_SECRET!
      : process.env.JWT_SECRET!;

  verify(
    token,
    secret,
    undefined,
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        console.log('here', err);
        return next(new AppError('JWT is invalid or expired', 403));
      }

      if (!isJwtPayloadWithEmail(decoded)) {
        console.log('here2');
        return next(new AppError('JWT is invalid or expired', 403));
      }

      req.user = decoded;
      next();
    }
  );
}
