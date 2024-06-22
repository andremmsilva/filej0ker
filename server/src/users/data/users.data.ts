import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { UserSQL, BaseUserResponse } from '../dto/auth.dto';

export class UserService {
  static sqlToBaseUserResponse(user: UserSQL): BaseUserResponse {
    return {
      user_id: user.user_id,
      email: user.email,
      user_name: user.user_name,
      full_name: user.full_name,
      created_at: user.created_at,
      user_role: user.user_role,
      active: user.active,
    };
  }

  static async findByEmail(email: string): Promise<UserSQL[]> {
    try {
      const result = await pool.query<UserSQL>(
        'SELECT * FROM users WHERE email=$1',
        [email]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsernameOrEmail(
    email: string,
    username: string
  ): Promise<UserSQL[]> {
    try {
      const result = await pool.query<UserSQL>(
        'SELECT * FROM users WHERE email=$1 OR user_name=$2',
        [email, username]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async addOne(
    fullName: string,
    email: string,
    username: string,
    passwordHash: string
  ): Promise<UserSQL[]> {
    try {
      const result = await pool.query<UserSQL>(
        'INSERT INTO users \
      (full_name, email, user_name, password_hash, user_role, active) \
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [fullName, email, username, passwordHash, 'Free', true]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}
