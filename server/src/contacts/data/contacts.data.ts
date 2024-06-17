import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { ContactRequestSQL } from '../dto/contacts.dto';

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

  static async getContactRequests(userId: number): Promise<ContactRequestSQL[]> {
    try {
      const response = await pool.query<ContactRequestSQL>(
        `SELECT * FROM contact_requests
        WHERE (firstId=$1 OR secondId=$1) AND contactStatus=$2`,
        [userId, 'invited']
      );
      return response.rows;
    } catch (error) {
      console.error(error);
      throw new AppError('Error getting contact invites from database', 500);
    }
  }
}
