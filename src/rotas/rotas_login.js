const express = require('express');
const { login } = require('../controladores/login')

const rota_login = express();

rota_login.post('/banco/login', login);
rota_login.post('/conta/login', login);

module.exports = rota_login;