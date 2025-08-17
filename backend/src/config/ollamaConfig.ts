import dotenv from 'dotenv';

dotenv.config(); // load .env values into process.env

export const HOST = process.env.OLLAMA_HOST || "localhost";
export const PORT = Number(process.env.OLLAMA_PORT) || 11434;
export const PATH = process.env.OLLAMA_PATH || "/api/chat";
export const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";