import { Request, Response } from 'express';
import { RegisterUserDTO } from '../dtos/RegisterUser.dto';

export function handleLogin(req: Request, res: Response) {
  res.status(500).send('Not implemented yet!');
}

export function handleLogout(req: Request, res: Response) {
  res.status(500).send('Not implemented yet!');
}

export function handleSignup(req: Request<{}, {}, RegisterUserDTO>, res: Response) {
  
}
