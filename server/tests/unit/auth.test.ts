import { verify } from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../../src/utils/tokens';
import { createApp } from '../../src/createApp';
import { Express } from 'express';

describe('auth', () => {
  let app: Express;
  const testEmail = 'andre@test.com';

  beforeAll(() => {
    app = createApp();
  });

  test('verify access token', () => {
    const token = generateAccessToken(testEmail);
    expect(verify(token, process.env.JWT_SECRET!)).toMatchObject({
      email: testEmail,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  test('verify refresh token', () => {
    const token = generateRefreshToken(testEmail);
    expect(verify(token, process.env.JWT_REFRESH_SECRET!)).toMatchObject({
      email: testEmail,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});
