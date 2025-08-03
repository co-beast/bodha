const { HttpStatusCode } = require('axios');

const express = require('express');
const router = express.Router();

const { chat, chatStream } = require('../services/ollamaClient.js');

router.post('/message', async (request, response) => {

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

router.post('/message/stream', async (request, response) => {

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

router.delete('/', (request, response) => {
    if (!request.session) {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'No session found.' });
    }
    
    request.session.conversation = [];
    response.json({ message: 'Chat session cleared successfully.' });
});

module.exports = router;