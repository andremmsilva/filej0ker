import { Express } from 'express';
import { createApp } from '../../src/createApp';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
} from '../../src/users/dto/auth.dto';
import { validate } from 'class-validator';

describe('users', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  test('validate emails', async () => {
    let reqData = new LoginRequestDTO();
    reqData.email = 'andre@test.com';
    reqData.password = 'password123';

    let errors = await validate(reqData);
    expect(errors.length).toEqual(0);

    reqData.email = 'andre.com';
    errors = await validate(reqData);
    expect(errors.length).toBeGreaterThan(0);

    reqData.email = 'andre@.';
    errors = await validate(reqData);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validate usernames', async () => {
    let reqData = new RegisterRequestDTO();
    reqData.email = 'andre@test.com';
    reqData.password = 'password123';
    reqData.fullName = 'André Silva';
    reqData.username = 'andremmsilva';

    let errors = await validate(reqData);
    expect(errors.length).toEqual(0);

    reqData.username = 'andresilva_-.';
    errors = await validate(reqData);
    expect(errors.length).toEqual(0);

    reqData.username = 'ad';
    errors = await validate(reqData);
    expect(errors.length).toBeGreaterThan(0);

    reqData.username = 'andRe%';
    errors = await validate(reqData);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validate full names', async () => {
    let reqData = new RegisterRequestDTO();
    reqData.email = 'andre@test.com';
    reqData.password = 'password123';
    reqData.fullName = 'André Silva';
    reqData.username = 'andremmsilva';

    let errors = await validate(reqData);
    expect(errors.length).toEqual(0);

    reqData.fullName = 'André Miguel Mendes Silva';
    errors = await validate(reqData);
    expect(errors.length).toEqual(0);

    reqData.fullName = 'AndreSilva';
    errors = await validate(reqData);
    expect(errors.length).toEqual(0);

    reqData.fullName = 'Andre123';
    errors = await validate(reqData);
    expect(errors.length).toBeGreaterThan(0);

    reqData.fullName = 'Andre %/';
    errors = await validate(reqData);
    expect(errors.length).toBeGreaterThan(0);
  });
});
