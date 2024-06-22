import express from 'express';
import { authRouter } from './users/routes/auth.routes';
import { verifyEnvs } from './utils/env';
import { loadEnv } from './loadEnv';
import { usersRouter } from './users/routes/users.routes';
import { contactsRouter } from './contacts/routes/contacts.routes';
import { errorHandler } from './errors/handler';
import cors from 'cors';
import cookieParser from "cookie-parser";

export function createApp() {
  loadEnv();
  verifyEnvs();
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: true,
    credentials: true
  }))
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/contacts', contactsRouter);

  // Error handling middleware should be the last middleware
  app.use(errorHandler);

  return app;
}
