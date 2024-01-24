const express = require('express');
const rota_banco = require('./rotas/rotas_banco');
const rota_conta = require('./rotas/rotas_conta');
const rota_login = require('./rotas/rota_login');

const app = express();
app.use(express.json());

app.use(rota_login);
app.use(rota_banco);
app.use(rota_conta); 


app.listen(3000);