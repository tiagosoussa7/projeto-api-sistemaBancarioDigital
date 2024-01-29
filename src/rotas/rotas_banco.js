const express = require('express');
const { autenticacaoBanco } = require('../intermediarios/autenticacao');
const { validacao_body } = require('../intermediarios/validacoes');
const { 
    cadastrar, 
    informacoes, 
    consulta_conta, 
    consulta_cliente, 
    atualizar, 
    excluir_contaCliente, 
    excluir 
} = require('../controladores/banco');

const { 
    schema_cadastrar, 
    schema_consultaConta,
    schema_consultaCliente,
    schema_atualizar, 
    schema_excluirConta, 
    schema_excluir
} = require('../validacoes/banco');

const rota_banco = express();

rota_banco.post('/banco', 
    validacao_body(schema_cadastrar), 
    cadastrar
);

rota_banco.get('/banco/informacao', autenticacaoBanco, informacoes);

rota_banco.get('/banco/consultar/conta', autenticacaoBanco,
    validacao_body(schema_consultaConta),
    consulta_conta
);

rota_banco.get('/banco/consultar/cliente', autenticacaoBanco, 
    validacao_body(schema_consultaCliente),
    consulta_cliente
);

rota_banco.put('/banco', autenticacaoBanco,
    validacao_body(schema_atualizar),
    atualizar
);

rota_banco.delete('/banco/conta', autenticacaoBanco,
    validacao_body(schema_excluirConta),
    excluir_contaCliente);

rota_banco.delete('/banco', autenticacaoBanco,
    validacao_body(schema_excluir),
    excluir
);

module.exports = rota_banco;