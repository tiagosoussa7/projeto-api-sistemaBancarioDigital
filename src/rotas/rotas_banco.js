const express = require('express');
const { cadastro, informacoes, consulta_conta, consulta_cliente, atualizar, excluir_contaCliente, excluir } = require('../controladores/banco');
const { banco_autenticacao } = require('../intermediarios/autenticacao');


const rota_banco = express();

rota_banco.post('/banco', cadastro);

rota_banco.use(banco_autenticacao);
rota_banco.get('/banco/informacao', informacoes);
rota_banco.get('/banco/consultar/conta', consulta_conta);
rota_banco.get('/banco/consultar/cliente', consulta_cliente);
rota_banco.put('/banco', atualizar);
rota_banco.delete('/banco/conta', excluir_contaCliente);
rota_banco.delete('/banco', excluir);


module.exports = rota_banco;