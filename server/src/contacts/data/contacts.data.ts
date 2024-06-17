import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { ContactResponseDto } from '../dto/contacts.dto';

export class ContactService {
  static async addContactRequest(fromId: number, toId: number): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO contact_requests (
        firstId,
        secondId,
        contactStatus
        ) VALUES ($1, $2, $3)`,
        [fromId, toId, 'invited']
      );
    } catch (error) {
      console.error(error);
      throw new AppError('Error inviting contact in database', 500);
    }
  }

  static async getContactRequests(
    userId: number
  ): Promise<ContactResponseDto[]> {
    try {
      const response = await pool.query<ContactResponseDto>(
        `SELECT cr.id, cr.createdat, cr.contactstatus,
          f.user_id AS sender_id,
          f.full_name AS sender_full_name,
          f.email AS sender_email,
          f.user_name AS sender_user_name,
          f.user_role AS sender_user_role,
          t.user_id AS target_id,
          t.full_name AS target_full_name,
          t.email AS target_email,
          t.user_name AS target_user_name,
          t.user_role AS target_user_role
        FROM contact_requests cr 
        JOIN users f ON f.user_id=cr.firstid 
        JOIN users t ON t.user_id=cr.secondid
        WHERE (firstId=$1 OR secondId=$1) AND contactStatus=$2;
        `,
        [userId, 'invited']
      );
      return response.rows;
    } catch (error) {
      console.error(error);
      throw new AppError('Error getting contact invites from database', 500);
    }
  }
}
