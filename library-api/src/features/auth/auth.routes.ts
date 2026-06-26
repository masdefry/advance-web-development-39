import { Router } from 'express';
import { AuthControllers } from './auth.controllers';

export const AuthRoutes = Router();

AuthRoutes.post('/login', AuthControllers.login);
AuthRoutes.post('/register', AuthControllers.register);
