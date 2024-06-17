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

  static async findByEmail(
    email: string
  ): Promise<UserSQL[]> {
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
}
