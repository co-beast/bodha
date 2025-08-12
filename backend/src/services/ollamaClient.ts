import http from 'http';
import { HttpStatusCode } from 'axios';
import { HOST, PORT, PATH, DEFAULT_MODEL } from '../config/ollamaConfig';
import { Response } from 'express';

interface OllamaRequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: Record<string, string>;
}

/** 
 * Sends conversation history as a list of messages to Ollama and streams the assistant's reply.
 *
 * Example Ollama streamed chunk (NDJSON format):
 * {
 *   "message": {
 *     "role": "assistant",
 *     "content": "Hello"
 *   },
 *   "done": false
 * }
 * 
 * The response is sent as Server-Sent Events (SSE) to the client.
* @param {Array} messages - [{ role: 'user', content: 'Hello' }]
 * @param {Object} response - Express response object to send streamed data
 * @param {string} model - The large language model to use
 */
async function chatStream(
    messages: ChatMessage[], 
    response: Response, 
    model: string = DEFAULT_MODEL
) {
    const options = createOllamaOptions();
    
    const ollamaRequest = http.request(options, (ollamaResponse) => {
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Connection', 'keep-alive');

        ollamaResponse.on('data', (rawChunk) => {
            const ndJsonLines = rawChunk.toString().trim().split('\n');
            for (const ndJsonLine of ndJsonLines) {
                if (!ndJsonLine) continue;
                try {
                    const parsedJsonChunk = JSON.parse(ndJsonLine);
                    const token = parsedJsonChunk.message?.content || '';

                    // Escape newlines so they can be sent via SSE and reconstructed in frontend
                    const escapedToken = token.replace(/\n/g, '\\n');
                    response.write(`data: ${escapedToken}\n\n`);
                } catch (error) {
                    console.error('Failed to parse Ollama chunk:', error);
                }
            }
        });

        ollamaResponse.on('end', () => {
            response.write('event: end\ndata: \n\n');
            response.end();
        });
    });

    ollamaRequest.on('error', (error) => {
        console.error('Ollama stream error:', error);
        response.status(HttpStatusCode.InternalServerError).end();
    });

    const requestBody = JSON.stringify({
        model,
        messages,
        stream: true
    });

    ollamaRequest.write(requestBody);
    ollamaRequest.end();
}

//#region Helper Functions

/** * Creates options for the Ollama HTTP request.
 * @returns {Object} Options for the HTTP request
 */ 
const createOllamaOptions = (): OllamaRequestOptions => {
    return {
        hostname: HOST,
        port: PORT,
        path: PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
//#endregion

export { chatStream };