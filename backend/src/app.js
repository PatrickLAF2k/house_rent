const express = require('express');
const authenticateToken = require('./middlewares/authentication');

//Rotas
const { userRegister } = require('./controllers/userRegister');
const { userlogin } = require('./controllers/userLogin');
const { tenantsRegister } = require('./controllers/tenantsRegister');
const { propertiesRegister } = require('./controllers/propertiesRegister');
const { contractRegister } = require('./controllers/contractRegister');
const validateUser = require('./middlewares/validateUser');
const validateLogin = require('./middlewares/validateLogin');

const app = express();

app.use(express.json());

// Rotas
app.post('/register', validateUser, userRegister);
app.post('/login', validateLogin, userlogin);

app.use(authenticateToken)

app.post('/tenants/register', tenantsRegister);
app.post('/properties/register', propertiesRegister);
app.post('/contract/register', contractRegister);

module.exports = app;
