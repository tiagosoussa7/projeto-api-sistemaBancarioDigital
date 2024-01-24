const jwt = require('jsonwebtoken');
const knex = require('../conexoes/knex');


async function autenticacao_geral(tabela, chave, req, res) {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({mensagem: 'Não autorizado.'});

    const token = authorization.split(' ')[1];

    if (!token) return res.status(400).json({mensagem: 'Não autorizado'});
    
    const { senha } = jwt.verify(token, chave);
    
    const dado_cadastrado = await knex(tabela).where({ senha }).first();
    
    if (!dado_cadastrado) return res.status(401).json({mensagem: 'Não autorizado: o sistema bancario digital está offline.'});

    return dado_cadastrado;
}

module.exports = {
    autenticacao_geral
}