// loadEnv.js
import dotenv from 'dotenv';
import fs from 'fs';

export function loadEnv() {
  const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    throw new Error(`Environment file ${envFile} not found`);
  }
}
