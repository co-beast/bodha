const axios = require('axios');
const http = require('http');

const { HttpStatusCode } = require('axios');

const { HOST, PORT, PATH, DEFAULT_MODEL } = require('../config/ollamaConfig.js');
const OLLAMA_URL = `http://${HOST}:${PORT}${PATH}`;

/**
 * Sends conversation history to Ollama and returns assistant reply in one shot.
 * @param {Array} messages - [{ role: 'user', content: 'Hello' }]
 * @param {string} model - The large language model to use
 */
async function chat(messages, model = DEFAULT_MODEL) {

    try {
        const response = await axios.post(OLLAMA_URL, {
            model,
            messages,
            stream: false
        });

        return response.data.message.content;

    } catch (error) {
        console.error(`Ollama error: ${error}`);
        throw new Error('Failed to get response from Ollama');
    }
}

/** 
 * Sends conversation history to Ollama and streams the assistant reply.
 * @param {Array} messages - [{ role: 'user', content: 'Hello' }]
 * @param {Object} response - Express response object to send streamed data
 * @param {string} model - The large language model to use
 */
async function chatStream(messages, response, model = DEFAULT_MODEL) {

    const options = createOllamaOptions();

    const ollamaRequest = http.request(options, (ollamaResponse) => {
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Connection', 'keep-alive');

        ollamaResponse.on('data', (chunk) => {
            const lines = chunk.toString().trim().split('\n');
            for (const line of lines) {
                if (!line) continue;
                try {
                    const data = JSON.parse(line);
                    const content = data.message?.content || '';
                    response.write(`data: ${content}\n\n`);
                } catch (error) {
                    console.error('Stream parse error:', error);
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

const createOllamaOptions = () => {
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

module.exports = { chat, chatStream };