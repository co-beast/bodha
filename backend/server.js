const { HttpStatusCode } = require('axios');
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const { chat, chatStream } = require('./ollamaClient');

const app = express();
const PORT = 8000;

app.use(express.json()); // Middleware to auto parse JSON in request bodies
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

app.post('/chat', async (request, response) => {

    const userMessage = request.body.message;
    if (!userMessage) {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'Message is required' });
    }

    if (!request.session.conversation) {
        request.session.conversation = [];
    }
    
    request.session.conversation.push({ 
        role: 'user', 
        content: userMessage 
    });

    try {
        const assistantReply = await chat(request.session.conversation);
        request.session.conversation.push({
            role: 'assistant',
            content: assistantReply,
        });

        response.json({ assistantReply });

    } catch (error) {
        console.error(error);
        response.status(HttpStatusCode.InternalServerError).json({ error: 'Failed to get response from Ollama'});
    }
});

app.post('/chat/stream', async (request, response) => {

    const userMessage = request.body.message;
    if (!userMessage) {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'Message is required' });
    }

    if (!request.session.conversation) {
        request.session.conversation = [];
    }

    request.session.conversation.push({
        role: 'user',
        content: userMessage
    });

    try {
        await chatStream(request.session.conversation, response);
    } catch (error) {
        console.error(error);
        response.status(HttpStatusCode.InternalServerError).json({ error: 'Failed to get response from Ollama' });
    }
});

app.post('/reset', (request, response) => {
    if (!request.session) {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'No session found.' });
    }
    
    request.session.conversation = [];
    response.json({ message: 'Chat reset successfully.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});