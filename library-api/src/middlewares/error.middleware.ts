import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseError } from '../utils/response-error.util';
import { logger } from '../configs/logger.config';

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  __: NextFunction,
) => {
  if (err instanceof ResponseError)
    logger.warn(err?.message, { path: req.url, stack: err.stack });

  logger.error(err?.message, { path: req.url, stack: err.stack });

  res.status(err?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.isExpose ? err?.message : 'Internal Server Error',
    data: null,
  });
};
