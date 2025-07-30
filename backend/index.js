const { HttpStatusCode } = require('axios');
const express = require('express');
const cors = require('cors');

const { chat } = require('./ollamaClient');

const app = express();
const PORT = 8000;

app.use(express.json()); // Middleware to auto parse JSON in request bodies
app.use(cors()); // Enable CORS for all routes

const conversationHistory = [];

app.post('/chat', async (request, response) => {

    const userMessage = request.body.message;
    conversationHistory.push({ 
        role: 'user', 
        content: userMessage 
    });

    try {
        const assistantReply = await chat(conversationHistory);
        conversationHistory.push({
            role: 'assistant',
            content: assistantReply,
        });
        
        response.json({ assistantReply });

    } catch (error) {
        console.error(error);
        response.status(HttpStatusCode.InternalServerError).json({ error: 'Failed to get response from Ollama'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});