import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const ErrorMiddleware = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.message,
    data: null,
  });
};
