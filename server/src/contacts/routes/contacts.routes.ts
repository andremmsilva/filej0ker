import express, { RequestHandler } from 'express';
import {
  sendContactRequest,
  blockContact,
  getContactRequests,
  respondToContactRequest,
  getContacts,
} from '../handlers/contacts.handler';
import { authenticateToken } from '../../middleware/auth';
import { validateBody, validateParams } from '../../middleware/validationMiddleware';
import {
  AddContactRequestDto,
  RespondToContactRequestDto,
  RespondToContactRequestParams,
} from '../dto/contacts.dto';

const contactsRouter = express.Router();

// users need to be authenticated
contactsRouter.use(authenticateToken);

contactsRouter.get('/', getContacts);

contactsRouter.get('/requests', getContactRequests);
contactsRouter.post(
  '/requests',
  validateBody(AddContactRequestDto),
  sendContactRequest
);
contactsRouter.post(
  '/requests/:reqId',
  validateParams(RespondToContactRequestParams),
  validateBody(RespondToContactRequestDto),
  respondToContactRequest
);
contactsRouter.post('/block', blockContact);

export { contactsRouter };
