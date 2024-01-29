require('dotenv').config();
const express = require('express');
const rota_login = require('./rotas/rotas_login');
const rota_banco = require('./rotas/rotas_banco');
const rota_conta = require('./rotas/rotas_conta');
const rota_transacoes = require('./rotas/rotas_transacoes');

const app = express();
app.use(express.json());

app.use(rota_login);
app.use(rota_banco);
app.use(rota_conta); 
app.use(rota_transacoes); 

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`);
});