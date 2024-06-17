import { Express } from 'express';
import { createApp } from '../../src/createApp';
import { truncateAndReset } from '../utils';
import { pool } from '../../src/middleware/db';
import request from 'supertest';
import {
  AuthResponseDto,
  RegisterRequestDTO,
} from '../../src/users/dto/auth.dto';
import { AddContactRequestDto } from '../../src/contacts/dto/contacts.dto';

describe('contacts', () => {
  let app: Express;
  let user: AuthResponseDto, targetContact: AuthResponseDto;

  beforeAll(async () => {
    app = createApp();
    await truncateAndReset();

    const userData: RegisterRequestDTO = {
      username: 'andresilva',
      fullName: 'André Silva',
      password: 'password123',
      email: 'andre@test.com',
    };

    const targetData: RegisterRequestDTO = {
      username: 'joaoalberto',
      fullName: 'João Chino',
      password: 'password124',
      email: 'joao@test.com',
    };

    let response = await request(app)
      .post('/auth/signup')
      .set({ Accept: 'application/json' })
      .send(userData);

    user = response.body as AuthResponseDto;

    response = await request(app)
      .post('/auth/signup')
      .set({ Accept: 'application/json' })
      .send(targetData);

    targetContact = response.body as AuthResponseDto;
  });

  afterAll(async () => {
    await truncateAndReset();
    await pool.end();
  });

  test('invite target to contacts', async () => {
    const reqData: AddContactRequestDto = {
      email: targetContact.user.email,
    };
    const response = await request(app)
      .post('/contacts')
      .set({
        accept: 'application/json',
        authorization: `Bearer ${user.auth.accessToken}`,
      })
      .send(reqData);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('success');
  });
});
