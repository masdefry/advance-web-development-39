import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const ErrorMiddleware = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  res.status(err?.statusCode ?? 500).json({
    success: false,
    message: err?.isExpose ? err?.message : 'Internal Server Error',
    data: null,
  });
};
