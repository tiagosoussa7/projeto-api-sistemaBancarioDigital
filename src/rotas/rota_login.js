const express = require('express');
const { login_banco, login_conta } = require('../controladores/login')

const rota_login = express();

rota_login.post('/banco/login', login_banco);
rota_login.post('/conta/login', login_conta);

module.exports = rota_login;