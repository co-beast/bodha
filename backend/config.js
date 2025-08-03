const CONFIG = {
    OLLAMA_HOST: 'localhost',
    OLLAMA_PORT: 11434,
    OLLAMA_API_PATH: '/api/chat',
    OLLAMA_MODEL_DEFAULT: 'llama3.2:3b',
    get OLLAMA_URL() {
        return `http://${this.OLLAMA_HOST}:${this.OLLAMA_PORT}${this.OLLAMA_API_PATH}`;
    }
};

module.exports = CONFIG;