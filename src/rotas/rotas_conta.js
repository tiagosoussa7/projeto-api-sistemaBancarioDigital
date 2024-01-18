const express = require('express');
const { cadastro } = require('../controladores/conta');

const rota_conta = express();

rota_conta.post('/conta', cadastro);

module.exports = rota_conta;