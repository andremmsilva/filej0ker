import jwt from "jsonwebtoken";

export function generateAccessToken(email: string) {
  return jwt.sign({email: email}, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION!,
  });
}

export function generateRefreshToken(email: string) {
  return jwt.sign({email: email}, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION!,
  });
}
