import express from "express";
import { sendContactRequest, blockContact, getContactRequests, respondToContactRequest, getContacts } from "../handlers/contacts.handler";
import { authenticateToken } from "../../middleware/auth";

const contactsRouter = express.Router();

// users need to be authenticated
contactsRouter.use(authenticateToken);

contactsRouter.get('/', getContacts);

contactsRouter.get('/requests', getContactRequests);
contactsRouter.post('/requests', sendContactRequest);
contactsRouter.post('/requests/:reqId', respondToContactRequest);
contactsRouter.post('/block', blockContact);

export {contactsRouter};

