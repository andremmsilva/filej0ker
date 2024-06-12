import express from "express";
import { authRouter } from "./routes/auth";
import { verifyEnvs } from "./utils/env";
import { loadEnv } from "./loadEnv";

export function createApp() {
  loadEnv();
  verifyEnvs();
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);

  // Error handling middleware should be the last middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
      });
    }
  );

  return app;
}
