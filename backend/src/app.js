const express = require('express');
const { userRegister } = require('./controllers/users');
const app = express();

// Middleware
app.use(express.json());

// Rotas
app.post('/register', userRegister );

module.exports = app; // Exporta o app para ser usado em outro arquivo
