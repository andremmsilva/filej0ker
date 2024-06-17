import express from 'express';
import { handleLogin, handleLogout, handleSignup } from '../handlers/auth.handler';
import { validateBody } from '../../middleware/validationMiddleware';
import { RegisterRequestDTO } from '../dto/auth.dto';
import { authenticateToken } from '../../middleware/auth';

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', authenticateToken, handleLogout);
authRouter.post('/signup', validateBody(RegisterRequestDTO), handleSignup);

export { authRouter };
