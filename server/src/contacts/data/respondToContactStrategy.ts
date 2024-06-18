import { AppError } from '../../errors/appError';
import { pool } from '../../middleware/db';
import { ContactStatus, RespondToContactAction } from '../dto/contacts.dto';

async function updateContact(status: ContactStatus, contactId: number) {
  try {
    await pool.query(
      `
      UPDATE contact_requests
      SET contactStatus=$1
      WHERE id=$2
      `,
      [status, contactId]
    );
  } catch (error) {
    throw new AppError('Error accepting contact request', 500);
  }
}

export abstract class RespondToContactStrategy {
  contactId: number;

  constructor(contactId: number) {
    this.contactId = contactId;
  }

  abstract execute(): Promise<void>;
}

export class AcceptContactStrategy extends RespondToContactStrategy {
  async execute(): Promise<void> {
    await updateContact('friends', this.contactId);
  }
}

export class RefuseContactStrategy extends RespondToContactStrategy {
  async execute(): Promise<void> {
    await updateContact('refused', this.contactId);
  }
}

export class BlockContactStrategy extends RespondToContactStrategy {
  async execute(): Promise<void> {
    await updateContact('blocked', this.contactId);
  }
}

export class RespondToContactStrategyFactory {
  static makeStrategy(
    action: RespondToContactAction,
    contactId: number
  ): RespondToContactStrategy {
    switch (action) {
      case 'accept':
        return new AcceptContactStrategy(contactId);
      case 'block':
        return new BlockContactStrategy(contactId);
      case 'refuse':
        return new RefuseContactStrategy(contactId);

      default:
        throw new AppError('Error responding to contact request', 500);
    }
  }
}
