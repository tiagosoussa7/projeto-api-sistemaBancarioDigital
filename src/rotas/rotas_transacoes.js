const express = require('express');
const { validacao_body } = require('../intermediarios/validacoes');

const { 
    deposito, 
    saque, 
    transferencia 
} = require('../controladores/transacoes');

const { 
    schema_deposito, 
    schema_saque, 
    schema_transferencia 
} = require('../validacoes/transacoes');

const rota_transacoes = express();

rota_transacoes.post('/transacoes/deposito', 
    validacao_body(schema_deposito),
    deposito
);

rota_transacoes.post('/transacoes/saque', 
    validacao_body(schema_saque), 
    saque
);

rota_transacoes.post('/transacoes/transferencia', 
    validacao_body(schema_transferencia),
    transferencia
);

module.exports = rota_transacoes;