import { describe, test } from '@jest/globals';
import {
  BaseUserResponse,
  RegisterRequestDTO,
} from '../../src/users/dto/auth.dto';
import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/createApp';
import { pool } from '../../src/middleware/db';
import { truncateAndReset } from '../utils';

describe('signup', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();
    await truncateAndReset();
  });

  beforeEach(async () => {
    await truncateAndReset();
  });

  afterAll(async () => {
    await truncateAndReset();
    await pool.end();
  });

  test('successful', async () => {
    const requestBody: RegisterRequestDTO = {
      username: 'andremmsilva',
      fullName: 'André Silva',
      password: 'andresilva',
      email: 'andre@test.com',
    };
    const expectedUser: BaseUserResponse = {
      user_id: expect.any(Number),
      email: 'andre@test.com',
      user_name: 'andremmsilva',
      full_name: 'André Silva',
      created_at: expect.any(String),
      user_role: 'Free',
      active: expect.any(Boolean),
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(requestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('auth');
    expect(response.body.user).toMatchObject(expectedUser);
  });

  test('invalid email', async () => {
    const requestBody: RegisterRequestDTO = {
      email: 'andre.com',
      username: 'andresilva',
      fullName: 'André Silva',
      password: 'andresilva',
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(requestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('invalid username', async () => {
    const requestBody: RegisterRequestDTO = {
      email: 'andre@test.com',
      username: 'an',
      fullName: 'André Silva',
      password: 'andresilva',
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(requestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('invalid full name', async () => {
    const requestBody: RegisterRequestDTO = {
      email: 'andre@test.com',
      username: 'andresilva',
      fullName: 'Andr$ S_%va;',
      password: 'andresilva',
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(requestBody)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('duplicate email', async () => {
    let firstReq: RegisterRequestDTO = {
      username: 'andremmsilva',
      fullName: 'André Silva',
      password: 'andresilva',
      email: 'andre@test.com',
    };

    let secondReq: RegisterRequestDTO = {
      username: 'andresilva03',
      fullName: 'André Silva',
      password: 'andresilva',
      email: 'andre@test.com',
    };

    let response = await request(app)
      .post('/auth/signup')
      .send(firstReq)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('auth');

    response = await request(app)
      .post('/auth/signup')
      .send(secondReq)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(409);
    expect(response.body).toHaveProperty('message');
  });

  test('duplicate username', async () => {
    let firstReq: RegisterRequestDTO = {
      username: 'andremmsilva',
      fullName: 'André Silva',
      password: 'andresilva',
      email: 'andre@test.com',
    };

    let secondReq: RegisterRequestDTO = {
      username: 'andremmsilva',
      fullName: 'André Silva',
      password: 'andresilva',
      email: 'andre2@test.com',
    };

    let response = await request(app)
      .post('/auth/signup')
      .send(firstReq)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('auth');

    response = await request(app)
      .post('/auth/signup')
      .send(secondReq)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(409);
    expect(response.body).toHaveProperty('message');
  });
});
