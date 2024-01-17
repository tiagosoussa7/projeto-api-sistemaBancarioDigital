const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require("../conexoes/knex");

const login_banco = async (req, res) => {
    const { nome, senha} = req.body;

    if (!nome || !senha) return res.status(400).json({mensagem: 'Os campos nome e senha são obrigatórios'});

    try {
        const banco_cadastrado = await knex('dados_banco').select('nome', 'senha').first();
        
        if (banco_cadastrado.nome !== nome) return res.status(400).json({mensagem: `O nome ${nome} não corresponde ao do banco que está cadastrado no sistema.`});
        
        const senha_correta = await bcrypt.compare(senha, banco_cadastrado.senha);

        if (!senha_correta) return res.status(400).json({mensagem: 'Senha inválida.'});

        const token = jwt.sign({nome: banco_cadastrado.nome}, 'senha_segura_token', {expiresIn: '10h'});

        return res.status(200).json({token: token});
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    login_banco
}