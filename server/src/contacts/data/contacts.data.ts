import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';

export class ContactService {
  static async addContact(fromId: number, toId: number): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO user_contacts (
        firstId,
        secondId,
        contactStatus) VALUES ($1, $2, $3)`,
        [fromId, toId, 'invited']
      );
    } catch (error) {
      console.error(error);
      throw new AppError('Error adding contact to database', 500);
    }
  }
}
