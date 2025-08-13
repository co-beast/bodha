import http from 'http';
import { HOST, PORT, PATH, DEFAULT_MODEL } from '../config/ollamaConfig';

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
 */
export async function* chatStreamGenerator(
    messages: ChatMessage[],
    model: string = DEFAULT_MODEL
): AsyncGenerator<string> {

    const requestOptions = createOllamaRequestOptions();

    let pendingResolve: ((value: string) => void) | null = null;
    const queue: string[] = [];
    let done = false;

    const ollamaRequest = http.request(requestOptions, (ollamaResponse) => {

        let buffer = '';

        ollamaResponse.on('data', (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // keep incomplete line

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const parsed = JSON.parse(line);
                    const token = parsed.message?.content || '';

                    if (token) {
                        if (pendingResolve) {
                            pendingResolve(token);
                            pendingResolve = null;
                        } else {
                            queue.push(token);
                        }
                    }

                } catch (error) {
                    console.error('Failed to parse ollama chunk response', error);
                }
            }
        });

        ollamaResponse.on('end', () => {
            done = true;
            if (pendingResolve) {
                pendingResolve('');
                pendingResolve = null;
            }
        });
    });

    ollamaRequest.on('error', (error) => {
        console.error('Ollama request error:', error);
        done = true;
        if (pendingResolve) {
            pendingResolve('');
            pendingResolve = null;
        }
    });

    ollamaRequest.write(
        JSON.stringify({ model, messages, stream: true })
    );

    ollamaRequest.end();

    while (!done || queue.length > 0) {
        if (queue.length > 0) {
            yield queue.shift()!;
        } else {
            // wait until we get new data
            const token = await new Promise<string>((resolve) => {
                pendingResolve = resolve;
            });
            if (token) yield token;
        }
    }
}

/**
 *  Creates options for the Ollama HTTP request.
 */
const createOllamaRequestOptions = (): OllamaRequestOptions => {
    return {
        hostname: HOST,
        port: PORT,
        path: PATH,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
}