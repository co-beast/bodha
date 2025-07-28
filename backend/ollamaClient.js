const axios = require('axios');

const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function query(prompt, model='llama3.2:3b') {
    
    try {
        const payload = {
            model, 
            prompt,
            stream: false
        }

        const response = axios.post(OLLAMA_URL, payload);
        return (await response).data.response;

    } catch (error) {
        console.error(`Error querying Ollama: ${error.message}`);
        throw new Error('Ollama request failed');
    }
}

module.exports = { query };