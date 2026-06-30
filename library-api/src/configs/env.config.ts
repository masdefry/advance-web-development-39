import 'dotenv/config';

export const PORT = parseInt(process.env.PORT as string) || 8001;
export const API_PREFIX = process.env.API_PREFIX;
export const WHITE_LIST = process.env.WHITE_LIST?.split(','); // ["localhost:3000", "localhost:5173"]
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; 
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;