const express = require('express');
const { cadastro, informacao_cliente, informacao_conta, atualizar, excluir, extrato } = require('../controladores/conta');
const { autenticacaoConta } = require('../intermediarios/autenticacao');

const rota_conta = express();

rota_conta.post('/conta', cadastro);

rota_conta.use(autenticacaoConta);
rota_conta.get('/conta/informacao', informacao_conta);
rota_conta.get('/conta/informacao/cliente', informacao_cliente);
rota_conta.get('/conta/extrato', extrato);
rota_conta.put('/conta', atualizar);
rota_conta.delete('/conta', excluir);

module.exports = rota_conta;