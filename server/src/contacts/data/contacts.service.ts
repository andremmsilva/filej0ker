import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { ContactRequestSQL, ContactResponseDto, ContactStatus } from '../dto/contacts.dto';
import { AddContactStrategy } from './addContactStrategy';
import { RespondToContactStrategy } from './respondToContactStrategy';

export class ContactService {
  static async findById(id: number): Promise<ContactRequestSQL[]> {
    try {
      const response = await pool.query<ContactRequestSQL>(
        `SELECT * FROM contact_requests
        WHERE id=$1;
        `,
        [id]
      );
      return response.rows;
    } catch (error) {
      console.error(error);
      throw new AppError('Error getting contact by id from database', 500);
    }
  }

  static async findBySenderReceiver(
    sender_id: number,
    receiver_id: number
  ): Promise<ContactRequestSQL[]> {
    try {
      const response = await pool.query<ContactRequestSQL>(
        `SELECT * FROM contact_requests
        WHERE firstId=$1 AND secondId=$2;
        `,
        [sender_id, receiver_id]
      );
      return response.rows;
    } catch (error) {
      console.error(error);
      throw new AppError('Error getting contact invites from database', 500);
    }
  }

  static async addContactRequest(strategy: AddContactStrategy): Promise<void> {
    await strategy.execute();
  }

  static async respondToContactRequest(
    strategy: RespondToContactStrategy
  ): Promise<void> {
    await strategy.execute();
  }

  static async getContacts(
    userId: number,
    status: ContactStatus
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
        [userId, status]
      );
      return response.rows;
    } catch (error) {
      console.error(error);
      throw new AppError('Error getting contact invites from database', 500);
    }
  }
}
