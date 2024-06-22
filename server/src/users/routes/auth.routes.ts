import express from 'express';
import {handleLogin, handleLogout, handleRefresh, handleSignup} from '../handlers/auth.handler';
import { validateBody } from '../../middleware/validationMiddleware';
import {LoginRequestDTO, RegisterRequestDTO} from '../dto/auth.dto';
import { authenticateToken } from '../../middleware/auth';

const authRouter = express.Router();

authRouter.post('/login', validateBody(LoginRequestDTO), handleLogin);
authRouter.post('/logout', authenticateToken, handleLogout);
authRouter.post('/signup', validateBody(RegisterRequestDTO), handleSignup);
authRouter.post('/refresh', authenticateToken, handleRefresh);

export { authRouter };
