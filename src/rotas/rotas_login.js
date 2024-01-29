const express = require('express');
const { validacao_body } = require('../intermediarios/validacoes');
const { 
    login_banco, 
    login_conta 
} = require('../controladores/login');

const { 
    schema_banco, 
    schema_conta 
} = require('../validacoes/login');

const rota_login = express();

rota_login.post('/banco/login', 
    validacao_body(schema_banco), 
    login_banco);

rota_login.post('/conta/login', 
    validacao_body(schema_conta), 
    login_conta
);

module.exports = rota_login;