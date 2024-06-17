import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../users/data/users.data';
import { AddContactRequestDto } from '../dto/contacts.dto';
import { AppError } from '../../errors/appError';
import { ContactService } from '../data/contacts.data';

export async function addContact(
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
    await ContactService.addContact(userQuery[0].userid, targetQuery[0].userid);
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function blockContact(
  req: Request,
  res: Response,
  next: NextFunction
) {}