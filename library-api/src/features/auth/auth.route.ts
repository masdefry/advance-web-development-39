import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { Role } from '../../../generated/prisma';
import {
  JWT_SECRET_KEY,
  JWT_SECRET_VERIFICATION_KEY,
} from '../../configs/env.config';

export const AuthRoute = Router();

AuthRoute.post('/login', AuthController.loginUser);
AuthRoute.post('/register', AuthController.registerUser);
AuthRoute.post('/login-employee', AuthController.loginEmployee);
AuthRoute.post(
  '/register-employee',
  AuthMiddleware.authenticated(JWT_SECRET_KEY!),
  AuthMiddleware.authorized([Role.SUPER_ADMIN]),
  AuthController.registerEmployee,
);
AuthRoute.patch('/verify-employee', AuthMiddleware.extractToken(JWT_SECRET_VERIFICATION_KEY!), AuthController.verifyEmployee);
