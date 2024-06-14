import express from 'express';
import { handleProfile, handleSearch } from '../handlers/users';
import { authenticateToken } from '../middleware/auth';

const usersRouter = express.Router();

usersRouter.use(authenticateToken);
usersRouter.get('/', handleProfile);
usersRouter.post('/', handleSearch);

export { usersRouter };
