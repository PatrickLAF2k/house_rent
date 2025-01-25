const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Rotas
app.post('/login', );

module.exports = app; // Exporta o app para ser usado em outro arquivo
