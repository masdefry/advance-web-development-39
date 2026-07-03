import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET_KEY, JWT_SECRET_VERIFICATION_KEY, JWT_VERIFICATION_EXPIRES_IN } from '../configs/env.config';
import type { StringValue } from 'ms';
export class JWTUtil {
  static signToken(payload: any) {
    return jwt.sign({ ...payload }, JWT_SECRET_KEY! as string, {
      expiresIn: JWT_EXPIRES_IN! as StringValue,
    });
  }

  static signVerificationToken(payload: any) {
    return jwt.sign({ ...payload }, JWT_SECRET_VERIFICATION_KEY! as string, {
      expiresIn: JWT_VERIFICATION_EXPIRES_IN! as StringValue,
    });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET_KEY!);
  }
}
