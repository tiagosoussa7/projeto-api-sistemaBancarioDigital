const express = require('express');
const { deposito, saque, transferencia } = require('../controladores/transacoes');

const rota_transacoes = express();

rota_transacoes.post('/transacoes/deposito', deposito);
rota_transacoes.post('/transacoes/saque', saque);
rota_transacoes.post('/transacoes/transferencia', transferencia);

module.exports = rota_transacoes;