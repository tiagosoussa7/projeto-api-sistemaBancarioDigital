const express = require('express');
const rota_banco = require('./rotas/rotas_banco');
const rota_login_banco  = require('./rotas/rotas_login');
const rota_conta = require('./rotas/rotas_conta');



const app = express();
app.use(express.json());

app.use(rota_login_banco);
app.use(rota_conta);
app.use(rota_banco);

app.listen(3000);