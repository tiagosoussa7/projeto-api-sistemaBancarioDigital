const express = require('express');
const { cadastro, atualizar } = require('../controladores/banco');

const rota_banco = express();
rota_banco.post('/banco', cadastro);
rota_banco.put('/banco', atualizar);


module.exports = rota_banco;