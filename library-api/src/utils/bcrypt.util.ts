import bcrypt from 'bcrypt';

export class BcryptUtil {
  static async hashPassword(password: string, saltRounds: number = 10) {
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(plainPassword: string, passwordHashed: string) {
    return await bcrypt.compare(plainPassword, passwordHashed);
  }
}
