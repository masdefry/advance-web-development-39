import { prisma } from '../../configs/prisma-client.config';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { JWTUtil } from '../../utils/jwt.util';
import {
  AuthLoginInput,
  AuthRegisterEmployeeInput,
  AuthRegisterInput,
} from './auth.validation';

export class AuthService {
  static async loginUser({ body }: AuthLoginInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!existingUser) throw new Error('Invalid credential email/password');

    const isValid = await BcryptUtil.comparePassword(
      body.password,
      existingUser.password,
    );

    if (!isValid) throw new Error('Invalid credential email/password');

    const token = JWTUtil.signToken({
      sub: existingUser.id,
      role: existingUser.role,
    });

    const { password, idCardNumber, ...safeUser } = existingUser;

    return {
      token,
      safeUser,
    };
  }
  static async registerUser({ body }: AuthRegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) throw new Error('Email already exists');

    const passwordHashed = await BcryptUtil.hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: passwordHashed,
        fullName: body.fullName,
        idCardNumber: body.idCardNumber,
        role: body.role,
      },
    });

    const { password, idCardNumber, ...safeUser } = user;

    return safeUser;
  }

  static async loginEmployee({ body }: AuthLoginInput) {
    const existingUser = await prisma.employee.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!existingUser) throw new Error('Invalid credential email/password');

    const isValid = await BcryptUtil.comparePassword(
      body.password,
      existingUser.password,
    );

    if (!isValid) throw new Error('Invalid credential email/password');

    const token = JWTUtil.signToken({
      sub: existingUser.id,
      role: existingUser.role,
    });

    const { password, idCardNumber, ...safeUser } = existingUser;

    return {
      token,
      safeUser,
    };
  }
  static async registerEmployee({ body }: AuthRegisterEmployeeInput) {
    const existingUser = await prisma.employee.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) throw new Error('Email already exists');

    const passwordHashed = await BcryptUtil.hashPassword(body.password);

    const user = await prisma.employee.create({
      data: {
        email: body.email,
        password: passwordHashed,
        fullName: body.fullName,
        idCardNumber: body.idCardNumber,
        address: body.address, 
        role: body.role,
      },
    });

    const { password, idCardNumber, ...safeUser } = user;

    return safeUser;
  }
}
