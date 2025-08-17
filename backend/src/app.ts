import express, { Application } from 'express';
import session from 'express-session';
import cors from 'cors';

import chatRoutes from '@/routes/chatRoutes';
import { SESSION_SECRET, CLIENT_ORIGIN } from '@/config/appConfig';
import { HttpStatusCode } from 'axios';

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

app.get('/api/health', (_request, response) => {
    response
        .status(HttpStatusCode.Ok)
        .json({ status: "ok" });
});

app.use('/api/chat', chatRoutes);

export default app;