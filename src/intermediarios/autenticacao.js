const jwt = require('jsonwebtoken');
const knex = require('../conexoes/knex');

const autenticacaoBanco = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
    
        if (!authorization) return res.status(401).json({mensagem: 'Não autorizado.'});
        
        const token = authorization.split(' ')[1];
    
        if (!token) return res.status(400).json({mensagem: 'Não autorizado.'});
        
        const { senha } = jwt.verify(token, process.env.SECRET_KEY_BANCO);
    
        const cadastro = await knex('dados_banco').where({ senha }).first();
    
        if (!cadastro) return res.status(401).json({mensagem: 'Não autorizado: sistema bancário digital offline.'});
    
        req.banco = cadastro;
    
        next();
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const autenticacaoConta = async (req, res, next) => {
    try {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({mensagem: 'Não autorizado.'});
    
    const token = authorization.split(' ')[1];

    if (!token) return res.status(400).json({mensagem: 'Não autorizado.'});
    
    const { senha } = jwt.verify(token, process.env.SECRET_KEY_CONTA);

    const cadastro = await knex('dados_cliente').where({ senha }).first();

    if (!cadastro) return res.status(401).json({mensagem: 'Não autorizado.'});

    req.cliente = cadastro;

    next();
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    autenticacaoBanco,
    autenticacaoConta
}