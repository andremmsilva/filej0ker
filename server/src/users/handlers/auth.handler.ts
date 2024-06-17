import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import {
  AuthResponseDto,
  LoginRequestDTO,
  RegisterRequestDTO,
  UserSQL,
} from '../dto/auth.dto';
import { pool } from '../../middleware/db';
import { AppError } from '../../errors/appError';
import { BCRYPT_SALT_ROUNDS } from '../../utils/constants';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokens';

export async function handleLogin(
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response<AuthResponseDto>,
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
      queryResult.rows[0].password_hash,
      (err, result) => {
        if (err) {
          throw err;
        }

        if (!result) {
          throw new AppError('Email or password is incorrect!', 401);
        }

        res.status(200).json({
          user: {
            user_id: queryResult.rows[0].user_id,
            email: queryResult.rows[0].email,
            user_name: queryResult.rows[0].user_name,
            full_name: queryResult.rows[0].full_name,
            created_at: queryResult.rows[0].created_at,
            user_role: queryResult.rows[0].user_role,
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
  res: Response<AuthResponseDto>,
  next: NextFunction
) {
  try {
    // Check for unique constraints
    const result = await pool.query(
      'SELECT user_id FROM users WHERE email=$1 OR user_name=$2',
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
          const result = await pool.query<UserSQL>(
            'INSERT INTO users \
          (full_name, email, user_name, password_hash, user_role, active) \
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
              user_id: result.rows[0].user_id,
              email: result.rows[0].email,
              user_name: result.rows[0].user_name,
              full_name: result.rows[0].full_name,
              created_at: result.rows[0].created_at,
              user_role: result.rows[0].user_role,
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
