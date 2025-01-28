const express = require('express');
const tokenVerify = require('./middlewares/authentication');
const { userRegister } = require('./controllers/userRegister');
const { userlogin } = require('./controllers/userLogin');
const { tenantsRegister } = require('./controllers/tenantsRegister');
const app = express();

// Middleware
app.use(express.json());

// Rotas
app.post('/register', userRegister);
app.post('/login', userlogin);

app.use(tokenVerify)
app.post('/tenantsRegister', tenantsRegister);

app.get('/user', (req, res) => {
    res.status(200).json({ mensagem: "Rota protegida" });
});

module.exports = app;
