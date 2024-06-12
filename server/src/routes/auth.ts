import express from 'express';
import { handleLogin, handleLogout, handleSignup } from '../handlers/auth';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { RegisterRequestDTO } from '../dtos/user.dto';
import { authenticateToken } from '../middleware/auth';

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', authenticateToken, handleLogout);
authRouter.post('/signup', validationMiddleware(RegisterRequestDTO), handleSignup);

export { authRouter };
