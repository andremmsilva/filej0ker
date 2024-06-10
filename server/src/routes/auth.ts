import express from 'express';
import { handleLogin, handleLogout, handleSignup } from '../handlers/auth';

const authRouter = express.Router();

authRouter.post('/login', handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.post('/signup', handleSignup);

export { authRouter };
