import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validate } from '../../validations/validate';
import { AuthValidation } from './auth.validation';
import { StatusCodes } from 'http-status-codes';
import { JWTUtil } from '../../utils/jwt.util';
import { JWT_SECRET_VERIFICATION_KEY } from '../../configs/env.config';
import { ResponseError } from '../../utils/response-error.util';

export class AuthController {
  static async loginUser(req: Request, res: Response) {
    const { body } = validate(AuthValidation.LOGIN_USER, {
      body: req.body,
    });

    const { safeUser, token } = await AuthService.loginUser({ body });

    res.cookie(
      'token',
      { token },
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login user successful',
      data: safeUser,
    });
  }
  static async registerUser(req: Request, res: Response) {
    const { body } = validate(AuthValidation.REGISTER_USER, {
      body: req.body,
    });

    const safeUser = await AuthService.registerUser({ body });

    res.status(StatusCodes.CREATED).json({
      sucess: true,
      message: 'Register user successful',
      data: safeUser,
    });
  }

  static async loginEmployee(req: Request, res: Response) {
    const { body } = validate(AuthValidation.LOGIN_EMPLOYEE, {
      body: req.body,
    });

    const { safeUser, token } = await AuthService.loginEmployee({ body });

    res.cookie(
      'token',
      { token },
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login employee successful',
      data: safeUser,
    });
  }
  static async registerEmployee(req: Request, res: Response) {
    const { body } = validate(AuthValidation.REGISTER_EMPLOYEE, {
      body: req.body,
    });

    const safeUser = await AuthService.registerEmployee({ body });

    res.status(StatusCodes.CREATED).json({
      sucess: true,
      message: 'Register employee successful',
      data: safeUser,
    });
  }

  static async verifyEmployee(req: Request, res: Response) {
    const payload = res.locals.payload; 
    const { password } = req.body;

    const employee = await AuthService.verifyEmployee(payload.sub, password);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Employee verified successfully',
      data: employee,
    });
  }
}
