const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require("../conexoes/knex");
const { nome_resposta } = require('../validacoes/schema_resposta');

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


const login_geral = async (req, res) => {
    const { instituicao_nome, instituicao_senha, cpf, email, senha } = req.body;

    try {
        if (instituicao_nome && instituicao_senha) {
            
            const banco_cadastrado = await knex('dados_banco').select('nome', 'senha').first();
            
            if (!banco_cadastrado) return res.status(400).json({mensagem: 'Não existe instituição cadastrada no sistema'});

            if (banco_cadastrado.nome !== instituicao_nome) return res.status(400).json({mensagem: `O nome ${nome_resposta(instituicao_nome)} não corresponde ao do banco que está cadastrado no sistema.`});
        
            const banco_senha = await bcrypt.compare(instituicao_senha, banco_cadastrado.senha);

            if (!banco_senha) return res.status(400).json({mensagem: 'Senha inválida.'});

            const token = jwt.sign({senha: banco_cadastrado.senha}, 'senha_segura_token', {expiresIn: '10h'});

            return res.status(200).json({token: token});
        }
        
        if (cpf || email && senha) {
            
            if (cpf) {
                
                const cpf_cadastrado = await knex('dados_cliente').where({cpf}).first();

                if (!cpf_cadastrado) {
                    return res.status(400).json({mensagem: `Login negado: o CPF ${cpf} não foi encontrado.`}); 
                }
                
                const cliente_senha = await bcrypt.compare(senha, cpf_cadastrado.senha);

                if (!cliente_senha) return res.status(400).json({mensagem: 'Senha inválida.'});

                const token = jwt.sign({senha: cpf_cadastrado.senha}, 'senha_segura_token', {expiresIn: '10h'});

                return res.status(200).json({token: token});
            }
            
            if(email) {
                const email_cadastrado = await knex('dados_cliente').where({email}).first();

                if (!email_cadastrado) {
                    return res.status(400).json({mensagem: `Login negado: o email ${email} não foi encontrado.`}); 
                }

                const cliente_senha = await bcrypt.compare(senha, email_cadastrado.senha);

                if (!cliente_senha) return res.status(400).json({mensagem: 'Senha inválida.'});

                const token = jwt.sign({senha: email_cadastrado.senha}, 'senha_segura_token', {expiresIn: '10h'});

                return res.status(200).json({token: token});
            }
            

            //const cliente_senha = await bcrypt.compare(senha, `${cpf_cadastrado ? cpf_cadastrado.senha : email_cadastrado.senha}`);

            //if (!cliente_senha) return res.status(400).json({mensagem: 'Senha inválida.'});

            //const token = jwt.sign({senha: `${cpf_cadastrado ? cpf_cadastrado.senha : email_cadastrado.senha}`}, 'senha_segura_token', {expiresIn: '10h'});

            //return res.status(200).json({token: token});
        }
        
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios.'});

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    login_banco,
    login_geral
}