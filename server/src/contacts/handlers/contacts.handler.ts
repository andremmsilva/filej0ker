import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../errors/appError';
import { UserService } from '../../users/data/users.data';
import {
  AddContactStrategyFactory,
} from '../data/addContactStrategy';
import { ContactService } from '../data/contacts.service';
import {
  AddContactRequestDto,
  ContactResponseDto,
  IRespondContactRequestBody,
  IRespondContactRequestParams,
} from '../dto/contacts.dto';

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
    const result = await ContactService.getContactRequests(
      userQuery[0].user_id
    );
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

  const previousContacts = await ContactService.getContact(
    userQuery[0].user_id,
    targetQuery[0].user_id
  );

  try {
    await ContactService.addContactRequest(
      AddContactStrategyFactory.makeStrategy(
        userQuery[0].user_id,
        targetQuery[0].user_id,
        previousContacts
      )
    );
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function respondToContactRequest(
  req: Request<IRespondContactRequestParams, {}, IRespondContactRequestBody>,
  res: Response,
  next: NextFunction
) {
  const contactReqId = req.params.reqId;
  const userQuery = await UserService.findByEmail(req.user!.email);
  if (userQuery.length !== 1) {
    next(new AppError('User not found', 403));
  }
}

export async function blockContact(
  req: Request,
  res: Response,
  next: NextFunction
) {}
