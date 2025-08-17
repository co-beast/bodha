import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { streamChat } from "@/services/chatService";
import 'express-session';

const SSE_DATA_PREFIX = "data: ";
const SSE_EVENT_END = "event: end";
const SSE_DELIMITER = "\n\n";

const NEWLINE_PATTERN = /\n/g;
const ESCAPED_NEWLINE = "\\n";

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
            const escapedToken = token.replace(NEWLINE_PATTERN, ESCAPED_NEWLINE);
            response.write(`${SSE_DATA_PREFIX}${escapedToken}${SSE_DELIMITER}`);
        }
        
        request.session.conversation.push({
            role: 'assistant',
            content: assistantReply
        });

        response.write(`${SSE_EVENT_END}\n${SSE_DATA_PREFIX}${SSE_DELIMITER}`);
        response.end();
    } catch (error) {
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
        return response
            .status(HttpStatusCode.BadRequest)
            .json({ error: 'No session found.' });
    }

    request.session.conversation = [];
    response.json({ message: 'Chat session cleared successfully.' });
}