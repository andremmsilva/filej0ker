import express from 'express';
import { authenticateToken } from '../../middleware/auth';
import { handleProfile, handleSearch } from '../handlers/users.handler';

const usersRouter = express.Router();

usersRouter.use(authenticateToken);
usersRouter.get('/', handleProfile);
usersRouter.post('/', handleSearch);

export { usersRouter };
