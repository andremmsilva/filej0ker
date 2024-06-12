import { describe, test } from '@jest/globals';
import { BaseUserResponse, RegisterRequestDTO } from '../../src/dtos/user.dto';
import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/createApp';
import { pool } from '../../src/middleware/db';
import { truncateAndReset } from '../utils';

describe('signup', () => {
  let app: Express;

  const baseRequestBody: RegisterRequestDTO = {
    email: 'andre@test.com',
    fullName: 'André Silva',
    userName: 'andremmsilva',
    password: 'testpassword',
  };

  beforeAll(() => {
    app = createApp();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    if (process.env.NODE_ENV === 'test') await truncateAndReset();
  });

  test('successful', async () => {
    const expectedUser: BaseUserResponse = {
      userId: expect.any(Number),
      email: 'andre@test.com',
      userName: 'andremmsilva',
      fullName: 'André Silva',
      createdAt: expect.any(String),
      userRole: 'Free',
      active: expect.any(Boolean),
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(baseRequestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('auth');
    expect(response.body.user).toMatchObject(expectedUser);
  });

  test('invalid email', async () => {
    const requestBody: RegisterRequestDTO = {
      ...baseRequestBody,
    };

    requestBody.email = 'invalid.com'; // Replace email with an invalid one
    const response = await request(app)
      .post('/auth/signup')
      .send(requestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('invalid username', async () => {
    const requestBody: RegisterRequestDTO = {
      ...baseRequestBody,
    };

    requestBody.userName = 'a';
    const response = await request(app)
      .post('/auth/signup')
      .send(requestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('duplicate email', async () => {
    let response = await request(app)
      .post('/auth/signup')
      .send(baseRequestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('auth');

    const newRequestBody = { ...baseRequestBody };
    newRequestBody.userName = 'differentUser';

    response = await request(app)
      .post('/auth/signup')
      .send(newRequestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(409);
    expect(response.body).toHaveProperty('message');
  });

  test('duplicate username', async () => {
    let response = await request(app)
      .post('/auth/signup')
      .send(baseRequestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('auth');

    const newRequestBody = { ...baseRequestBody };
    newRequestBody.email = 'andre2@test.com';

    response = await request(app)
      .post('/auth/signup')
      .send(newRequestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(409);
    expect(response.body).toHaveProperty('message');
  });
});
