const express = require('express');
const { login_geral } = require('../controladores/login')

const rota_login = express();

rota_login.post('/banco/login', login_geral);
rota_login.post('/conta/login', login_geral);

module.exports = rota_login;