const express = require('express');
const rota_banco = require('./rotas/rotas_banco');


const app = express();
app.use(express.json());

app.use(rota_banco);

app.listen(3000);