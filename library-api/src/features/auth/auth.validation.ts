import * as zod from 'zod';
import { Role } from '../../../generated/prisma';

export class AuthValidation {
  static readonly REGISTER_USER = zod.object({
    body: zod.object({
      email: zod
        .string()
        .min(1, 'Email is required field')
        .email('Email format is invalid')
        .transform((email) => email.trim().toLocaleLowerCase()),
      password: zod.string().min(1, 'Password is required field'),
      fullName: zod
        .string()
        .min(1, 'Fullname is required field')
        .min(10, 'Fullname must be 5-100 characters')
        .max(100, 'Fullname must be 5-100 characters'),
      idCardNumber: zod
        .string()
        .min(1, 'Id card number is required field')
        .max(20, 'Id card number have maximum 20 characters'),
      role: zod.enum([Role.CUSTOMER]),
    }),
  });

  static readonly LOGIN_USER = zod.object({
    body: zod.object({
      email: zod
        .string()
        .min(1, 'Email is required field')
        .email('Email format is invalid')
        .transform((email) => email.trim().toLocaleLowerCase()),
      password: zod.string().min(1, 'Password is required field'),
    }),
  });

  static readonly REGISTER_EMPLOYEE = zod.object({
    body: zod.object({
      email: zod
        .string()
        .min(1, 'Email is required field')
        .email('Email format is invalid')
        .transform((email) => email.trim().toLocaleLowerCase()),
      fullName: zod
        .string()
        .min(1, 'Fullname is required field')
        .min(10, 'Fullname must be 5-100 characters')
        .max(100, 'Fullname must be 5-100 characters'),
      idCardNumber: zod
        .string()
        .min(1, 'Id card number is required field')
        .max(20, 'Id card number have maximum 20 characters'),
      address: zod
        .string()
        .min(1, 'Address is required field'),
      role: zod.enum([Role.ADMIN, Role.SUPER_ADMIN]),
    }),
  });

  static readonly LOGIN_EMPLOYEE = zod.object({
    body: zod.object({
      email: zod
        .string()
        .min(1, 'Email is required field')
        .email('Email format is invalid')
        .transform((email) => email.trim().toLocaleLowerCase()),
      password: zod.string().min(1, 'Password is required field'),
    }),
  });
}

export type AuthRegisterInput = zod.infer<typeof AuthValidation.REGISTER_USER>;
export type AuthRegisterEmployeeInput = zod.infer<
  typeof AuthValidation.REGISTER_EMPLOYEE
>;
export type AuthLoginInput = zod.infer<typeof AuthValidation.LOGIN_USER>;
export type AuthLoginEmployeeInput = zod.infer<
  typeof AuthValidation.LOGIN_EMPLOYEE
>;
