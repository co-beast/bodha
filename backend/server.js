const express = require('express');
const session = require('express-session');
const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use('/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});