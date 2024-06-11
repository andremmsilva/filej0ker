import { Request, Response } from 'express';
import { BaseAuthResponse, RegisterRequestDTO } from '../dtos/user.dto';

export function handleLogin(req: Request, res: Response) {
  res.status(500).send('Not implemented yet!');
}

export function handleLogout(req: Request, res: Response) {
  res.status(500).send('Not implemented yet!');
}

export function handleSignup(
  req: Request<{}, {}, RegisterRequestDTO>,
  res: Response<BaseAuthResponse>
) {

  res.status(201).json({
    auth: {
      accessToken: '',
      refreshToken: ''
    },
    user: {
      userId: 1,
      email: 'andre@test.com',
      userName: 'andremmsilva',
      fullName: 'André Silva',
      createdAt: new Date(Date.now()),
      userRole: 'Free',
      active: true
    }
  });
}
