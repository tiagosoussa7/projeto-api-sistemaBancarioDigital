const express = require('express');
const { cadastro, informacoes, consulta_conta, consulta_cliente, atualizar, excluir_contaCliente, excluir } = require('../controladores/banco');
const { autenticacaoBanco } = require('../intermediarios/autenticacao');


const rota_banco = express();

rota_banco.post('/banco', cadastro);

rota_banco.get('/banco/informacao', autenticacaoBanco, informacoes);
rota_banco.get('/banco/consultar/conta', autenticacaoBanco, consulta_conta);
rota_banco.get('/banco/consultar/cliente', autenticacaoBanco, consulta_cliente);
rota_banco.put('/banco', autenticacaoBanco, atualizar);
rota_banco.delete('/banco/conta', autenticacaoBanco, excluir_contaCliente);
rota_banco.delete('/banco', autenticacaoBanco, excluir);


module.exports = rota_banco;