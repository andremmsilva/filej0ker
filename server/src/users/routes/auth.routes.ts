import express from 'express';
import { handleLogin, handleLogout, handleSignup } from '../handlers/auth.handler';
import { validationMiddleware } from '../../middleware/validationMiddleware';
import { RegisterRequestDTO } from '../dto/auth.dto';
import { authenticateToken } from '../../middleware/auth';

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', authenticateToken, handleLogout);
authRouter.post('/signup', validationMiddleware(RegisterRequestDTO), handleSignup);

export { authRouter };
