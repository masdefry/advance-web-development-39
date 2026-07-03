import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { Role } from '../../../generated/prisma';

export const AuthRoute = Router();

AuthRoute.post('/login', AuthController.loginUser);
AuthRoute.post('/register', AuthController.registerUser);
AuthRoute.post('/login-employee', AuthController.loginEmployee);
AuthRoute.post(
  '/register-employee',
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([Role.SUPER_ADMIN]),
  AuthController.registerEmployee,
);
