import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../users/data/users.data';
import {
  AddContactRequestDto,
  ContactResponseDto,
  IRespondContactRequestParams,
} from '../dto/contacts.dto';
import { AppError } from '../../errors/appError';
import { ContactService } from '../data/contacts.data';

export async function getContacts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  throw new Error('Not implemented');
}

export async function getContactRequests(
  req: Request,
  res: Response<ContactResponseDto[]>,
  next: NextFunction
) {
  const userQuery = await UserService.findByEmail(req.user!.email);
  if (userQuery.length !== 1) {
    next(new AppError('User not found', 403));
  }

  try {
    const result = await ContactService.getContactRequests(userQuery[0].user_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function sendContactRequest(
  req: Request<{}, {}, AddContactRequestDto>,
  res: Response,
  next: NextFunction
) {
  const userQuery = await UserService.findByEmail(req.user!.email);
  if (userQuery.length !== 1) {
    next(new AppError('User not found', 403));
  }

  const targetQuery = await UserService.findByEmail(req.body.email);
  if (targetQuery.length !== 1) {
    next(new AppError('Target contact not found', 400));
  }

  try {
    await ContactService.addContactRequest(
      userQuery[0].user_id,
      targetQuery[0].user_id
    );
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function respondToContactRequest(
  req: Request<IRespondContactRequestParams>,
  res: Response,
  next: NextFunction
) {
  throw new Error('Not implemented');
}

export async function blockContact(
  req: Request,
  res: Response,
  next: NextFunction
) {}
