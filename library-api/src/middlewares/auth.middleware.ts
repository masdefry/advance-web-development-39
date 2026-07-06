import { NextFunction, Request, Response } from 'express';
import { JWTUtil } from '../utils/jwt.util';
import { ResponseError } from '../utils/response-error.util';
import { StatusCodes } from 'http-status-codes';

export class AuthMiddleware {
  static authenticated(secretKey: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const cookies = req?.cookies;
      if (!cookies?.token)
        throw new ResponseError(
          StatusCodes.UNAUTHORIZED,
          'Token must be provided',
        );

      const payload = JWTUtil.verifyToken(cookies?.token?.token, secretKey);

      res.locals.payload = payload;

      next();
    };
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

  static extractToken(secretKey: string){ 
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req?.headers?.authorization?.split(' ')[1];
    
      let payload: any;
      if (!token)
        throw new ResponseError(
          StatusCodes.UNAUTHORIZED,
          'Token must be provide',
        );

      payload = JWTUtil.verifyToken(token, secretKey!);

      res.locals.payload = payload; 

      next();
    }
  }
}
