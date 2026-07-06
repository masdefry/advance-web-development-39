import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/prisma-client.config';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { JWTUtil } from '../../utils/jwt.util';
import { ResponseError } from '../../utils/response-error.util';
import {
  AuthLoginInput,
  AuthRegisterEmployeeInput,
  AuthRegisterInput,
} from './auth.validation';
import transporter from '../../configs/nodemailer.config';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export class AuthService {
  static async loginUser({ body }: AuthLoginInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!existingUser)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        'Invalid credential email/password',
      );

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

    if (!existingUser?.password || !existingUser.verified)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        'User account is not verified',
      );

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

    return await prisma.$transaction(async (tx) => {
      const user = await tx.employee.create({
        data: {
          email: body.email,
          fullName: body.fullName,
          idCardNumber: body.idCardNumber,
          address: body.address,
          role: body.role,
        },
      });

      const verificationToken = JWTUtil.signVerificationToken({ sub: user.id });

      const mainDir = path.join(process.cwd());
      const templateHtml = fs.readFileSync(
        `${mainDir}/src/templates/email-verification.html`,
        'utf-8',
      );
      const compiledTemplateHtml = Handlebars.compile(templateHtml);
      const html = compiledTemplateHtml({
        companyName: 'Ruang Baca',
        name: user?.fullName,
        verificationUrl: `http://localhost:3001/email-verification/${verificationToken}`,
      });

      await transporter.sendMail({
        to: body.email,
        subject: 'Welcome New Employee',
        html,
      });

      const { password, idCardNumber, ...safeUser } = user;
      return safeUser;
    });

  }

  static async verifyEmployee(sub: string, password: string) {
    console.log(sub);
    const existingUser = await prisma.employee.findUnique({
      where: {
        id: sub,
      },
    });

    if (!existingUser)
      throw new ResponseError(StatusCodes.NOT_FOUND, `User not found`);

    const hashedPassword = await BcryptUtil.hashPassword(password);

    const employee = await prisma.employee.update({
      data: {
        password: hashedPassword,
        verified: true,
      },
      where: {
        id: sub,
      },
    });

    const {
      id,
      password: employeePassword,
      idCardNumber,
      address,
      ...safeUser
    } = employee;

    return safeUser;
  }
}

/*
  - Register employee di handle oleh ADMIN/SUPER_ADMIN
  - Setiap employee baru yg ter-register, akan mendapatkan email verification untuk meng-aktivasi akun nya sekaligus melakukan set password
  - Employee yang akun nya belum ter-verifikasi, tidak bisa melakukan login 
*/
