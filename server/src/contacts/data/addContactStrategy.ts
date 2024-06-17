import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { ContactRequestSQL } from '../dto/contacts.dto';

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
