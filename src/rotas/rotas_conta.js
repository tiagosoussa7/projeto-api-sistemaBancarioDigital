const express = require('express');
const { cadastro } = require('../controladores/conta');
const { banco_autenticacao } = require('../intermediarios/autenticacao');

const rota_conta = express();

rota_conta.post('/conta', banco_autenticacao, cadastro);

module.exports = rota_conta;