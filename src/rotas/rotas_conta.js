const express = require('express');
const { autenticacaoConta } = require('../intermediarios/autenticacao');
const { validacao_body } = require('../intermediarios/validacoes');

const { 
    cadastrar, 
    informacao_cliente, 
    informacao_conta, 
    atualizar, 
    extrato, 
    excluir 
} = require('../controladores/conta');

const { 
    schema_cadastrar, 
    schema_extrato, 
    schema_atualizar, 
    schema_excluir
} = require('../validacoes/conta');

const rota_conta = express();

rota_conta.post('/conta', validacao_body(schema_cadastrar),
    cadastrar
);

rota_conta.use(autenticacaoConta);

rota_conta.get('/conta/informacao', 
    informacao_conta
);

rota_conta.get('/conta/informacao/cliente', 
    informacao_cliente
);

rota_conta.get('/conta/extrato', validacao_body(schema_extrato), 
    extrato
);

rota_conta.put('/conta', validacao_body(schema_atualizar),
    atualizar
);

rota_conta.delete('/conta', validacao_body(schema_excluir),
    excluir
);

module.exports = rota_conta;