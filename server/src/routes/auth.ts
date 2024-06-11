import express from 'express';
import { handleLogin, handleLogout, handleSignup } from '../handlers/auth';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { RegisterRequestDTO } from '../dtos/user.dto';

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.post('/signup', validationMiddleware(RegisterRequestDTO), handleSignup);

export { authRouter };
