function envError(envVar: string) {
  throw new Error(
    `Please provide a value for the environment variable ${envVar}`
  );
}

export function verifyEnvs() {
  if (!process.env.EXPRESS_PORT) {
    envError("EXPRESS_PORT");
  }
  if (!process.env.POSTGRES_URL) {
    envError("POSTGRES_URL");
  }
  if (!process.env.JWT_SECRET) {
    envError("JWT_SECRET");
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    envError("JWT_REFRESH_SECRET");
  }
  if (!process.env.JWT_EXPIRATION) {
    envError("JWT_EXPIRATION");
  }
  if (!process.env.JWT_REFRESH_EXPIRATION) {
    envError("JWT_REFRESH_EXPIRATION");
  }
  if (!process.env.FRONTEND_URL) {
    envError("FRONTEND_URL");
  }
}
