import 'dotenv/config';

export const PORT = parseInt(process.env.PORT as string) || 8001;
export const API_PREFIX = process.env.API_PREFIX;
export const WHITE_LIST = process.env.WHITE_LIST?.split(','); // ["localhost:3000", "localhost:5173"]