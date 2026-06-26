import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { PORT, WHITE_LIST } from './configs/env.config';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.use(
  cors({
    origin: WHITE_LIST,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.message,
    data: null,
  });
});

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`[⚡APP] Application is running on port: ${PORT}`);
  });
}

export default app;
