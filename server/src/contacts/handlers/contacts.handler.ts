import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../errors/appError';
import { UserService } from '../../users/data/users.data';
import { AddContactStrategyFactory } from '../data/addContactStrategy';
import { ContactService } from '../data/contacts.service';
import {
  AddContactRequestDto,
  ContactResponseDto,
  RespondToContactRequestDto,
  RespondToContactRequestParams,
} from '../dto/contacts.dto';
import { RespondToContactStrategyFactory } from '../data/respondToContactStrategy';

export async function getContacts(
  req: Request,
  res: Response<ContactResponseDto[]>,
  next: NextFunction
) {
  const userQuery = await UserService.findByEmail(req.user!.email);
  if (userQuery.length !== 1) {
    next(new AppError('User not found', 403));
  }

  try {
    const result = await ContactService.getContacts(
      userQuery[0].user_id,
      'friends'
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
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
    const result = await ContactService.getContacts(
      userQuery[0].user_id,
      'invited'
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

  const previousContacts = await ContactService.findBySenderReceiver(
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
  req: Request<RespondToContactRequestParams, {}, RespondToContactRequestDto>,
  res: Response,
  next: NextFunction
) {
  const contactReqId = parseInt(req.params.reqId);
  if (Number.isNaN(contactReqId)) {
    next(new AppError('Contact request not found', 403));
  }
  const userQuery = await UserService.findByEmail(req.user!.email);
  if (userQuery.length !== 1) {
    next(new AppError('User not found', 403));
  }

  const contactQuery = await ContactService.findById(contactReqId);
  if (contactQuery.length !== 1) {
    next(new AppError('Contact request not found', 403));
  }

  if (contactQuery[0].contactstatus !== 'invited') {
    next(
      new AppError(
        "You can't respond to an already accepted or blocked invite",
        400
      )
    );
  }

  const action = req.body.action;
  try {
    await ContactService.respondToContactRequest(
      RespondToContactStrategyFactory.makeStrategy(action, contactReqId)
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function blockContact(
  req: Request,
  res: Response,
  next: NextFunction
) {}
