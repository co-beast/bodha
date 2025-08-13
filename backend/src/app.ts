import express, { Application } from 'express';
import session from 'express-session';
import cors from 'cors';

import chatRoutes from './routes/chatRoutes';
import { SESSION_SECRET, CLIENT_ORIGIN } from './config';

const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
}));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    }
}));

app.use('/api/chat', chatRoutes);

export default app;