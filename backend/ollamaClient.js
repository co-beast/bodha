const axios = require('axios');

const OLLAMA_URL = 'http://localhost:11434/api/chat';

/**
 * Sends conversation history to Ollama and returns assistant reply
 * @param {Array} messages - [{ role: 'user', content: 'Hello' }]
 * @param {string} model - Model name (default: llama3.2:3b)
 */
async function chat(messages, model = 'llama3.2:3b') {

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

module.exports = { chat };