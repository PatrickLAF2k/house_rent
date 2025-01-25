const express = require('express');
const app = express();
const pool = require('./config/database'); // Importa o pool de conexão

// Middleware
app.use(express.json());

// Rotas
app.get('/', async (req, res) => {
  
});

module.exports = app; // Exporta o app para ser usado em outro arquivo
