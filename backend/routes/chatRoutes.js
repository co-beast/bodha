const { HttpStatusCode } = require('axios');

const express = require('express');
const router = express.Router();

const { chat, chatStream } = require('../services/ollamaClient.js');

/**
 * Receives a user message, appends it to the session conversation,
 * and returns the assistant's reply.
 * @route POST /chat/message
 * @param {Object} request - Express request object containing user message
 * @param {Object} response - Express response object to send back the assistant's reply
 */
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

/**
 * Receives a user message, appends it to the session conversation,
 * and streams the assistant's reply back to the client.
 * @route POST /chat/message/stream
 * @param {Object} request - Express request object containing user message
 * @param {Object} response - Express response object to stream the assistant's reply
 */
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

/**
 * Deletes the conversation history stored in the session.
 * @route DELETE /chat      
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object to confirm session cleared
 */
router.delete('/', (request, response) => {
    if (!request.session) {
        return response.status(HttpStatusCode.BadRequest).json({ error: 'No session found.' });
    }
    
    request.session.conversation = [];
    response.json({ message: 'Chat session cleared successfully.' });
});

module.exports = router;