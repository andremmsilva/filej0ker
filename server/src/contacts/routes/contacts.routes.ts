import express from "express";
import { addContact, blockContact } from "../handlers/contacts.handler";
import { authenticateToken } from "../../middleware/auth";

const contactsRouter = express.Router();

// users need to be authenticated
contactsRouter.use(authenticateToken);

contactsRouter.post('/', addContact);
contactsRouter.post('/block', blockContact);

export {contactsRouter};

