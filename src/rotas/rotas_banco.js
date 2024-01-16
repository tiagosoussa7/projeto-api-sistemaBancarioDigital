const express = require('express');
const { cadastro } = require('../controladores/banco');

const rota_banco = express();
rota_banco.post('/banco', cadastro);


module.exports = rota_banco;