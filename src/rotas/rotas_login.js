const express = require('express');
const { login_banco } = require('../controladores/login');

const rota_login_banco = express();

rota_login_banco.post('/banco/login', login_banco);

module.exports = rota_login_banco;