import { NextFunction, Request, Response } from 'express';
import { JWTUtil } from '../utils/jwt.util';
import { ResponseError } from '../utils/response-error.util';
import { StatusCodes } from 'http-status-codes';

export class AuthMiddleware {
  static authenticated(req: Request, res: Response, next: NextFunction) {
    const { token } = req?.cookies.token;

    const payload = JWTUtil.verifyToken(token);

    res.locals.payload = payload;

    next();
  }

  static authorized(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { payload } = res?.locals;

      if (!allowedRoles.includes(payload.role))
        throw new ResponseError(
          StatusCodes.UNAUTHORIZED,
          'Unauthorized user role',
        );

      next();
    };
  }
}
