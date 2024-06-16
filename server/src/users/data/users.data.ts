import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { UserSQL, BaseUserResponse } from '../dto/auth.dto';

export class UserService {
  static sqlToBaseUserResponse(user: UserSQL): BaseUserResponse {
    return {
      userId: user.userid,
      email: user.email,
      username: user.username,
      fullName: user.fullname,
      createdAt: user.createdat,
      userRole: user.userrole,
      active: user.active,
    };
  }

  static async findByEmail(
    email: string,
    errStatusCode: number = 403
  ): Promise<UserSQL[]> {
    const result = await pool.query<UserSQL>(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );
    return result.rows;
  }
}
