import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { streamChat } from "../services/chatService";
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        conversation?: ChatMessage[];
    }
}

/**
 * Appends the user's message and the assistant's reply to the session conversation, streaming the reply as SSE.
 */
export async function handleChatMessage(request: Request, response: Response) {
    
    const userMessage = request.body.message;
    if (!userMessage) {
        return response
            .status(HttpStatusCode.BadRequest)
            .json({ error: 'Message is required'})
    }

    if (!request.session.conversation) {
        request.session.conversation = [];
    }

    request.session.conversation.push({
        role: 'user',
        content: userMessage,
    });

    try {
        // Set up SSE headers
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Connection', 'keep-alive');

        let assistantReply = '';

        for await (const token of streamChat(request.session.conversation)) {
            assistantReply += token;
            const escapedToken = token.replace(/\n/g, '\\n');
            response.write(`data: ${escapedToken}\n\n`);
        }
        
        request.session.conversation.push({
            role: 'assistant',
            content: assistantReply
        });

        response.write('event: end\ndata: \n\n');
        response.end();
    } catch (error) {
        console.error(error);
        response
            .status(HttpStatusCode.InternalServerError)
            .json({ error: 'Failed to get response' });
    }
}

/**
 * Clears the session's conversation history.
 */
export function handleClearChat(request: Request, response: Response) {

    if (!request.session) {
        response
            .status(HttpStatusCode.BadRequest)
            .json({ error: 'No session found.' });
    }

    request.session.conversation = [];
    response.json({ message: 'Chat session cleared successfully.' });
}