import cors from 'cors';
import express from 'express';
import { API_PREFIX, PORT, WHITE_LIST } from './configs/env.config';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { AuthRoute } from './features/auth/auth.route';
import { BookRoute } from './features/book/book.route';

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

app.use(`${API_PREFIX}/auth`, AuthRoute);
app.use(`${API_PREFIX}/books`, BookRoute);

app.use(ErrorMiddleware);

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`[⚡APP] Application is running on port: ${PORT}`);
  });
}

export default app;
