const express = require('express');
const { cadastro, informacao_cliente, informacao_conta, atualizar } = require('../controladores/conta');
const { autenticacaoCliente } = require('../intermediarios/autenticacao.js');

const rota_conta = express();

rota_conta.post('/conta', cadastro);

rota_conta.use(autenticacaoCliente);
rota_conta.get('/conta/informacao', informacao_conta);
rota_conta.get('/conta/informacao/cliente', informacao_cliente);
rota_conta.put('/conta', atualizar);

module.exports = rota_conta;