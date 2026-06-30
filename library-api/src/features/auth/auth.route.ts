import { Router } from 'express';
import { AuthController } from './auth.controller';

export const AuthRoute = Router();

AuthRoute.post('/login', AuthController.loginUser);
AuthRoute.post('/register', AuthController.registerUser);
AuthRoute.post('/login-employee', AuthController.loginEmployee);
AuthRoute.post('/register-employee', AuthController.registerEmployee);
