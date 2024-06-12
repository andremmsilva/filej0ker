import { NextFunction, Request, Response } from 'express';
import {
  BaseAuthResponse,
  LoginRequestDTO,
  RegisterRequestDTO,
} from '../dtos/user.dto';
import { pool } from '../middleware/db';
import { AppError } from '../models/appError';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../utils/constants';

export async function handleLogin(
  req: Request<{}, {}, LoginRequestDTO>,
  res: Response<BaseAuthResponse>,
  next: NextFunction
) {
  try {
    const queryResult = await pool.query('SELECT * FROM users WHERE email=$1', [
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
            userId: queryResult.rows[0].user_id,
            email: queryResult.rows[0].email,
            userName: queryResult.rows[0].user_name,
            fullName: queryResult.rows[0].full_name,
            createdAt: queryResult.rows[0].created_at,
            userRole: queryResult.rows[0].user_role,
            active: queryResult.rows[0].active,
          },
          auth: {
            accessToken: '',
            refreshToken: '',
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
  console.log(req.userEmail);
  res.status(200).json({"message": "Success"});
}

export async function handleSignup(
  req: Request<{}, {}, RegisterRequestDTO>,
  res: Response<BaseAuthResponse>,
  next: NextFunction
) {
  try {
    // Check for unique constraints
    const result = await pool.query(
      'SELECT user_id FROM users WHERE email=$1 OR user_name=$2',
      [req.body.email, req.body.userName]
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
          (full_name, email, user_name, password_hash, user_role, active) \
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
              req.body.fullName,
              req.body.email,
              req.body.userName,
              hash,
              'Free',
              true,
            ]
          );

          res.status(201).json({
            auth: {
              accessToken: '',
              refreshToken: '',
            },
            user: {
              userId: result.rows[0].user_id,
              email: result.rows[0].email,
              userName: result.rows[0].user_name,
              fullName: result.rows[0].full_name,
              createdAt: result.rows[0].created_at,
              userRole: result.rows[0].user_role,
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
