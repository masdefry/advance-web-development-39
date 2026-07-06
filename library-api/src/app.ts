import cors from 'cors';
import express from 'express';
import { API_PREFIX, PORT, WHITE_LIST } from './configs/env.config';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { AuthRoute } from './features/auth/auth.route';
import { BookRoute } from './features/book/book.route';
import cookieParser from 'cookie-parser';
import path from 'path';
import { TransactionRoute } from './features/transaction/transaction.route';
import { TransactionSchedule } from './jobs/transaction/transaction.schedule';

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

app.use(cookieParser());

TransactionSchedule.expiryReservation();

/* Serve static files from the uploads directory */
app.use(
  `${API_PREFIX}/src/uploads`,
  express.static(path.join(__dirname, 'uploads')),
);

app.use(`${API_PREFIX}/auth`, AuthRoute);
app.use(`${API_PREFIX}/books`, BookRoute);
app.use(`${API_PREFIX}/transactions`, TransactionRoute);

app.use(ErrorMiddleware);

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`[⚡APP] Application is running on port: ${PORT}`);
  });
}

export default app;

/*
  Buatlah endpoint get all books dengan query params search untuk filter berasarkan book title/author disertai dengan 
  pagination dan limit. Endpoint ini harus mengembalikan data buku yang sesuai dengan filter dan pagination yang diberikan.
*/
