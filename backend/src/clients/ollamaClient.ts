import http, { IncomingMessage } from 'http';
import { HOST, PORT, PATH, DEFAULT_MODEL } from '@/config/ollamaConfig';

interface OllamaRequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: Record<string, string>;
}

interface OllamaChunkResponse {
    message: {
        content: string;
    }
}

/**
 * Calls the Ollama chat API with the given conversation history (streaming enabled)
 * and yields the assistant's reply tokens as they arrive.
 *
 * Example streamed chunk (NDJSON) from ollama:
 * {
 *   "message": { "role": "assistant", "content": "Hello" },
 *   "done": false
 * }
 */
export async function* chat(
    messages: ChatMessage[],
    model: string = DEFAULT_MODEL
): AsyncGenerator<string> {

    const requestOptions = createRequestOptions();
    const requestBody = JSON.stringify({ model, messages, stream: true });

    const response = await new Promise<IncomingMessage>((resolve, reject) => {
        const request = http.request(requestOptions, resolve);
        request.on('error', reject);
        request.write(requestBody);
        request.end();
    });
    response.setEncoding('utf8');

    let buffer = '';
    for await (const chunk of response) {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const token = extractToken(line);
            if (token) yield token;
        }
    }
}

const createRequestOptions = (): OllamaRequestOptions => {
    return {
        hostname: HOST,
        port: PORT,
        path: PATH,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
}

const extractToken = (ndJsonString: string): string | null => {
    if (!ndJsonString.trim()) return null;
    try {
        const chunk: OllamaChunkResponse = JSON.parse(ndJsonString);
        return chunk.message.content;
    } catch (error) {
        // skip invalid token but do not break entire stream
        return null;
    }
}