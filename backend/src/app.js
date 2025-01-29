const express = require('express');
const authenticateToken = require('./middlewares/authentication');
const { userRegister } = require('./controllers/userRegister');
const { userlogin } = require('./controllers/userLogin');
const { tenantsRegister } = require('./controllers/tenantsRegister');
const { propertiesRegister } = require('./controllers/propertiesRegister');
const app = express();

// Middleware
app.use(express.json());

// Rotas
app.post('/register', userRegister);
app.post('/login', userlogin);

app.use(authenticateToken)
app.post('/tenants/register', tenantsRegister);
app.post('/properties/register', propertiesRegister);

module.exports = app;
