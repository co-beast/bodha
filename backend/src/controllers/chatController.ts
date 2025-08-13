import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { chatStreamGenerator } from "../services/ollamaClient";
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        conversation?: ChatMessage[];
    }
}

export async function streamMessage(request: Request, response: Response) {
    
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

        for await (const token of chatStreamGenerator(request.session.conversation)) {
            const escapedToken = token.replace(/\n/g, '\\n');
            response.write(`data: ${escapedToken}\n\n`);
        }

        response.write('event: end\ndata: \n\n');
        response.end();
    } catch (error) {
        console.error(error);
        response
            .status(HttpStatusCode.InternalServerError)
            .json({ error: 'Failed to get response' });
    }
}

export function clearChat(request: Request, response: Response) {

    if (!request.session) {
        response
            .status(HttpStatusCode.BadRequest)
            .json({ error: 'No session found.' });
    }

    request.session.conversation = [];
    response.json({ message: 'Chat session cleared successfully.' });
}