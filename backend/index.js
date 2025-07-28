const { HttpStatusCode } = require('axios');
const { query } = require('./ollamaClient');

const express = require('express');

const app = express();
const PORT = 8000;

app.use(express.json()); // Middleware to auto parse JSON in request bodies

app.get('/', (request, response) => {
    response.send('Hello World!');
});

app.post('/chat', async (request, response) => {

    const { message } = request.body;

    try {
        const result = await query(message);
        response.json({ result });

    } catch (error) {
        response.status(HttpStatusCode.InternalServerError).json({ error: 'Failed to get response from Ollama'});
    }
    
    response.json({ response: `You said ${message}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});