const express = require('express');
const { userRegister, login } = require('./controllers/users');
const tokenVerify = require('./middlewares/authentication');
const app = express();

// Middleware
app.use(express.json());

// Rotas
app.post('/register', userRegister );
app.post('/login', login );

app.use(tokenVerify)

module.exports = app;
