import { NextFunction, Request, Response } from 'express';
import {
  BaseAuthResponse,
  LoginRequestDTO,
  RegisterRequestDTO,
  UserSQL,
} from '../dtos/auth.dto';
import { pool } from '../middleware/db';
import { AppError } from '../models/appError';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../utils/constants';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens';

export async function handleLogin(
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response<BaseAuthResponse>,
  next: NextFunction
) {
  try {
    const queryResult = await pool.query<UserSQL>('SELECT * FROM users WHERE email=$1', [
      req.body.email,
    ]);
    if (!queryResult.rowCount || queryResult.rowCount === 0) {
      throw new AppError('Email or password is incorrect!', 401);
    }

    bcrypt.compare(
      req.body.password,
      queryResult.rows[0].passwordhash,
      (err, result) => {
        if (err) {
          throw err;
        }

        if (!result) {
          throw new AppError('Email or password is incorrect!', 401);
        }

        res.status(200).json({
          user: {
            userId: queryResult.rows[0].userid,
            email: queryResult.rows[0].email,
            username: queryResult.rows[0].username,
            fullName: queryResult.rows[0].fullname,
            createdAt: queryResult.rows[0].createdat,
            userRole: queryResult.rows[0].userrole,
            active: queryResult.rows[0].active,
          },
          auth: {
            accessToken: generateAccessToken(queryResult.rows[0].email),
            refreshToken: generateRefreshToken(queryResult.rows[0].email),
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export function handleLogout(req: Request, res: Response) {
  res.status(200).json({ message: 'Success' });
}

export async function handleSignup(
  req: Request<{}, {}, RegisterRequestDTO>,
  res: Response<BaseAuthResponse>,
  next: NextFunction
) {
  try {
    // Check for unique constraints
    const result = await pool.query(
      'SELECT userId FROM users WHERE email=$1 OR username=$2',
      [req.body.email, req.body.username]
    );
    if (result.rowCount! > 0) {
      throw new AppError('Email or username are already registered!', 409);
    }

    // Create a password hash and insert in the DB.
    bcrypt.hash(
      req.body.password,
      BCRYPT_SALT_ROUNDS,
      async function (err, hash) {
        if (err) {
          console.error(err);
          next(err);
        }

        try {
          const result = await pool.query(
            'INSERT INTO users \
          (fullName, email, username, passwordHash, userRole, active) \
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
              req.body.fullName,
              req.body.email,
              req.body.username,
              hash,
              'Free',
              true,
            ]
          );

          res.status(201).json({
            auth: {
              accessToken: generateAccessToken(result.rows[0].email),
              refreshToken: generateRefreshToken(result.rows[0].email),
            },
            user: {
              userId: result.rows[0].userId,
              email: result.rows[0].email,
              username: result.rows[0].username,
              fullName: result.rows[0].fullName,
              createdAt: result.rows[0].createdAt,
              userRole: result.rows[0].userRole,
              active: result.rows[0].active,
            },
          });
        } catch (error) {
          console.error(error);
          next(error);
        }
      }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
}
