import { Request, Response } from 'express';
import { AuthServices } from './auth.services';

export class AuthControllers {
  static async login(req: Request, res: Response) {
    await AuthServices.login()
  }
  static async register(req: Request, res: Response) {
    await AuthServices.register()
  }
}
