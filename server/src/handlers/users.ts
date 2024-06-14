import { Request, Response } from 'express';
import { SearchRequestDTO } from '../dtos/users.dto';
import {
  BaseUserResponse,
  UserSQL,
  sqlToBaseUserResponse,
} from '../dtos/auth.dto';
import { pool } from '../middleware/db';
import { AppError } from '../models/appError';

export async function handleSearch(
  req: Request<{}, {}, SearchRequestDTO>,
  res: Response<BaseUserResponse[]>
) {
  const query = req.body.query;
  try {
    const result = await pool.query<UserSQL>(
      'SELECT * FROM users WHERE username ILIKE $1 OR email ILIKE $1',
      [`%${query}%`]
    );

    res.json(result.rows.map((value) => sqlToBaseUserResponse(value)));
  } catch (error) {
    console.error(error);
    throw new AppError('Error getting search results', 500);
  }
}

export async function handleProfile(
  req: Request,
  res: Response<BaseUserResponse>
) {
  if (!req.user) {
    // Should never happen
    throw new AppError('Error getting profile results', 500);
  }

  try {
    const result = await pool.query<UserSQL>(
      'SELECT * FROM users WHERE email=$1',
      [req.user.email]
    );

    res.json(sqlToBaseUserResponse(result.rows[0]));
  } catch (error) {
    console.error(error);
    throw new AppError('Error getting search results', 500);
  }
}
