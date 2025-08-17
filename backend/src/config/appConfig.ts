import dotenv from 'dotenv';

dotenv.config(); // load .env values into process.env

export const PORT = Number(process.env.PORT) || 8000;
export const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-key';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';