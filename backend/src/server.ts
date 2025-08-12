import express, { Application } from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 8000;
const SESSION_SECRET: string = process.env.SESSION_SECRET || 'default-secret-key';
const CORS_ORIGIN: string = process.env.CORS_ORIGIN || 'http://localhost:5173';


app.use(express.json());
app.use(cors({
    origin: CORS_ORIGIN, 
    credentials: true,
}));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});