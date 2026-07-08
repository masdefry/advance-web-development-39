import 'dotenv/config';

export const PORT = parseInt(process.env.PORT as string) || 8001;
export const API_PREFIX = process.env.API_PREFIX;
export const WHITE_LIST = process.env.WHITE_LIST?.split(','); // ["localhost:3000", "localhost:5173"]
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const NODEMAILER_GOOGLE_APP_PASSWORD =
  process.env.NODEMAILER_GOOGLE_APP_PASSWORD;
export const JWT_SECRET_VERIFICATION_KEY = 'abc12345';
export const JWT_VERIFICATION_EXPIRES_IN = '1h';
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_DB = process.env.REDIS_DB;
