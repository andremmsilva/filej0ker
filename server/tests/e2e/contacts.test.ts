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
  });

  afterAll(async () => {
    await truncateAndReset();
    await pool.end();
  });

  beforeEach(async () => {
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

  test('invite target to contacts', async () => {
    const reqData: AddContactRequestDto = {
      email: targetContact.user.email,
    };
    const response = await request(app)
      .post('/contacts/requests')
      .set({
        accept: 'application/json',
        authorization: `Bearer ${user.auth.accessToken}`,
      })
      .send(reqData);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('success');
  });

  test('invite target and confirm both can get the invite info', async () => {
    const reqData: AddContactRequestDto = {
      email: targetContact.user.email,
    };
    let response = await request(app)
      .post('/contacts/requests')
      .set({
        accept: 'application/json',
        authorization: `Bearer ${user.auth.accessToken}`,
      })
      .send(reqData);

    expect(response.status).toEqual(201);

    // Both the user and the targetContact should have the same results
    const usersToCheck = [user, targetContact];
    for (let i = 0; i < usersToCheck.length; i++) {
      const element = usersToCheck[i];
      response = await request(app)
        .get('/contacts/requests')
        .set({
          accept: 'application/json',
          authorization: `Bearer ${element.auth.accessToken}`,
        });

      expect(response.status).toEqual(200);
      expect(response.body.result[0]).toMatchObject({
        id: 1,
        firstid: 1,
        secondid: 2,
        createdat: expect.any(String),
        contactstatus: 'invited',
      });
    }
  });
});
