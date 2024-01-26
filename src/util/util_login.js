const jwt = require('jsonwebtoken');
const { comparar_senha } = require('./util_funcionalidades');

async function gerar_token(dado, chave, senha, res) { 

    if (!await comparar_senha(senha, dado.senha)) return res.status(400).json({mensagem: 'Login negado: senha inválida.'});

    const token = jwt.sign({senha: dado.senha}, chave, {expiresIn: '10h'});

    return res.status(200).json({token: token});
}

module.exports = {
    gerar_token
}