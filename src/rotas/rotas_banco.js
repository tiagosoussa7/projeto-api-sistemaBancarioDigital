const express = require('express');
const { cadastro, atualizar, informacoes, excluir } = require('../controladores/banco');
const { banco_autenticacao } = require('../intermediarios/autenticacao');

const rota_banco = express();

rota_banco.post('/banco', cadastro);

rota_banco.use(banco_autenticacao);
rota_banco.get('/banco', informacoes);
rota_banco.put('/banco', atualizar);
rota_banco.delete('/banco', excluir);


module.exports = rota_banco;