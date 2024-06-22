import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import {
  AuthResponseDto,
  BaseJWTResponse,
  LoginRequestDTO,
  RegisterRequestDTO,
} from '../dto/auth.dto';
import { AppError } from '../../errors/appError';
import { BCRYPT_SALT_ROUNDS } from '../../utils/constants';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokens';
import { UserService } from '../data/users.data';

function makeTokens(email: string) {
  return {
    accessToken: generateAccessToken(email),
    refreshToken: generateRefreshToken(email),
  };
}

function setAuthCookies(
  res: Response<any>,
  tokens: BaseJWTResponse,
  setRefresh: boolean = true
) {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: parseInt(process.env.JWT_EXPIRATION!),
  });

  if (setRefresh) {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: parseInt(process.env.JWT_REFRESH_EXPIRATION!),
    });
  }
}

export async function handleLogin(
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response<AuthResponseDto>,
  next: NextFunction
) {
  const userQuery = await UserService.findByEmail(req.body.email);

  if (userQuery.length !== 1) {
    return next(new AppError('Email or password is incorrect!', 401));
  }

  bcrypt.compare(
    req.body.password,
    userQuery[0].password_hash,
    (err, result) => {
      if (err) {
        return next(err);
      }

      if (!result) {
        return next(new AppError('Email or password is incorrect!', 401));
      }

      const tokens = makeTokens(userQuery[0].email);
      setAuthCookies(res, tokens);

      res.status(200).json({
        user: {
          user_id: userQuery[0].user_id,
          email: userQuery[0].email,
          user_name: userQuery[0].user_name,
          full_name: userQuery[0].full_name,
          created_at: userQuery[0].created_at,
          user_role: userQuery[0].user_role,
          active: userQuery[0].active,
        },
        auth: tokens,
      });
    }
  );
}

export function handleLogout(req: Request, res: Response) {
  res.status(200).json({ message: 'Success' });
}

export async function handleSignup(
  req: Request<{}, {}, RegisterRequestDTO>,
  res: Response<AuthResponseDto>,
  next: NextFunction
) {
  const userQuery = await UserService.findByUsernameOrEmail(
    req.body.email,
    req.body.username
  );

  if (userQuery.length > 0) {
    return next(new AppError('Email or username are already registered!', 409));
  }

  // Create a password hash and insert in the DB.
  bcrypt.hash(
    req.body.password,
    BCRYPT_SALT_ROUNDS,
    async function (err, hash) {
      if (err) {
        console.error(err);
        return next(err);
      }

      try {
        const result = await UserService.addOne(
          req.body.fullName,
          req.body.email,
          req.body.username,
          hash
        );

        const tokens = makeTokens(result[0].email);
        setAuthCookies(res, tokens);

        res.status(201).json({
          auth: tokens,
          user: {
            user_id: result[0].user_id,
            email: result[0].email,
            user_name: result[0].user_name,
            full_name: result[0].full_name,
            created_at: result[0].created_at,
            user_role: result[0].user_role,
            active: result[0].active,
          },
        });
      } catch (error) {
        console.error(error);
        return next(error);
      }
    }
  );
}

export async function handleRefresh(
  req: Request,
  res: Response<{ accessToken: string }>,
  next: NextFunction
) {
  const userQuery = await UserService.findByEmail(req.user!.email);
  if (userQuery.length !== 1) {
    return next(new AppError('User not found', 403));
  }

  const accessToken = generateAccessToken(userQuery[0].email);
  setAuthCookies(res, { accessToken, refreshToken: '' }, false);

  res.status(200).json({ accessToken });
}
