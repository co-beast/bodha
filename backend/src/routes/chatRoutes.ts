import { Router, Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { chatStream } from '../services/ollamaClient';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    conversation?: ChatMessage[];
  }
}

const router = Router();

/**
 * Receives a user message, appends it to the session conversation,
 * and streams the assistant's reply back to the client.
 * @route POST /chat/message/stream
 * @param {Object} request - Express request object containing user message
 * @param {Object} response - Express response object to stream the assistant's reply
 */
router.post(
    '/message/stream', 
    async (request: Request, response: Response) => {

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
router.delete('/', (request: Request, response: Response): void => {
    if (!request.session) {
        response.status(HttpStatusCode.BadRequest).json({ error: 'No session found.' });
        return;
    }
    
    request.session.conversation = [];
    response.json({ message: 'Chat session cleared successfully.' });
});

export = router;