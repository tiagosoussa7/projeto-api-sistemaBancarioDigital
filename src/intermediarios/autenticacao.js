const jwt = require('jsonwebtoken');
const knex = require("../conexoes/knex");

const banco_autenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({mensagem: 'Não autorizado.'});

    try {
        const token = authorization.split(' ')[1];

        if (!token) return res.status(400).json({mensagem: 'Não autorizado'});
        
        const { nome } = jwt.verify(token, 'senha_segura_token');
        
        const banco_cadastrado = await knex('dados_banco').where({ nome }).first();
        
        if (!banco_cadastrado) return res.status(401).json({mensagem: 'Sem autorização de acesso.'});

        req.banco = banco_cadastrado;
     
        next();
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    banco_autenticacao
}