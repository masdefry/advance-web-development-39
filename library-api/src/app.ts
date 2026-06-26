import cors from 'cors';
import express from 'express';
import { PORT, WHITE_LIST } from './configs/env.config';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { AuthRoutes } from './features/auth/auth.routes';

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

app.use('/auth', AuthRoutes);

app.use(ErrorMiddleware);

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`[⚡APP] Application is running on port: ${PORT}`);
  });
}

export default app;
