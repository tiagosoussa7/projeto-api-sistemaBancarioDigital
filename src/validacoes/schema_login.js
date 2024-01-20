const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function gerar_token(dado, senha, res) {
            
    const senha_cadastrada = await bcrypt.compare(senha, dado.senha);

    if (!senha_cadastrada) return res.status(400).json({mensagem: 'Senha inválida.'});

    const token = jwt.sign({senha: dado.senha}, 'senha_segura_token', {expiresIn: '10h'});

    return res.status(200).json({token: token});
}

module.exports = {
    gerar_token
}