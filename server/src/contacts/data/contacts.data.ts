import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { ContactRequestSQL, ContactResponseDto } from '../dto/contacts.dto';

export class ContactService {
  static async addContactRequest(strategy: AddContactStrategy): Promise<void> {
    strategy.execute();
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

  static async getContact(
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
}

export abstract class AddContactStrategy {
  fromId: number;
  toId: number;

  constructor(fromId: number, toId: number) {
    this.fromId = fromId;
    this.toId = toId;
  }

  abstract execute(): Promise<void>;
}

export class EmptyAddContactStrategy extends AddContactStrategy {
  async execute(): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO contact_requests (
        firstId,
        secondId,
        contactStatus
        ) VALUES ($1, $2, $3)`,
        [this.fromId, this.toId, 'invited']
      );
    } catch (error) {
      console.error(error);
      throw new AppError('Error inviting contact in database', 500);
    }
  }
}

export class InvitedAddContactStategy extends AddContactStrategy {
  async execute(): Promise<void> {
    throw new AppError('Invite has already been made', 409);
  }
}

export class BlockedAddContactStategy extends AddContactStrategy {
  async execute(): Promise<void> {
    throw new AppError("You can't invite this user", 403);
  }
}

export class FriendsAddContactStategy extends AddContactStrategy {
  async execute(): Promise<void> {
    throw new AppError("You can't invite this user", 403);
  }
}

export class RefusedAddContactStategy extends AddContactStrategy {
  async execute(): Promise<void> {
    return new EmptyAddContactStrategy(this.fromId, this.toId).execute();
  }
}

export class AddContactStrategyFactory {
  static makeStrategy(
    fromId: number,
    toId: number,
    previousContacts: ContactRequestSQL[]
  ): AddContactStrategy {
    let strategy: AddContactStrategy;
    if (previousContacts.length === 0) {
      strategy = new EmptyAddContactStrategy(fromId, toId);
      return strategy;
    }

    switch (previousContacts[0].contactstatus) {
      case 'invited':
        strategy = new InvitedAddContactStategy(fromId, toId);
        break;
      case 'blocked':
        strategy = new BlockedAddContactStategy(fromId, toId);
        break;
      case 'friends':
        strategy = new FriendsAddContactStategy(fromId, toId);
        break;
      case 'refused':
        strategy = new RefusedAddContactStategy(fromId, toId);
      default:
        throw new AppError('Error sending a contact request', 500);
    }

    return strategy;
  }
}
