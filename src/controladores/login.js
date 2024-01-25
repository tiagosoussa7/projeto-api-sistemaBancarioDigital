const knex = require("../conexoes/knex");
const { gerar_token } = require("../util/util_login");
const { nome_resposta } = require('../util/util_resposta');
const { chave_banco, chave_cliente } = require("../validacoes/senhaHash");

const login_banco = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    const bancoKey = chave_banco; 

    try {
        if (instituicao_nome && instituicao_senha) {
            
            const banco_cadastrado = await knex('dados_banco').select('nome', 'senha').first();
            
            if (!banco_cadastrado) return res.status(400).json({mensagem: 'Login negado: não existe instituição cadastrada no sistema'});

            if (banco_cadastrado.nome !== instituicao_nome) return res.status(400).json({mensagem: `Login negado: o nome ${nome_resposta(instituicao_nome)} não corresponde ao do banco cadastrado no sistema.`});
            
            return gerar_token(banco_cadastrado, bancoKey, instituicao_senha, res);
        }
                
        return res.status(400).json({mensagem: 'Login negado: todos os campos são obrigatórios.'});
        
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const login_conta = async (req, res) => {
    const { cpf, email, senha } = req.body;
    const clienteKey = chave_cliente; 
    
    try {
        if ((cpf || email) && senha) {
            
            if (cpf) {
                
                const cpf_cadastrado = await knex('dados_cliente').where({cpf}).first();
                
                if (!cpf_cadastrado) return res.status(400).json({mensagem: `Login negado: o CPF ${cpf} não foi encontrado.`}); 
                
                return gerar_token(cpf_cadastrado, clienteKey, senha, res);
            }
            
            if(email) {
                const email_cadastrado = await knex('dados_cliente').where({email}).first();

                if (!email_cadastrado) return res.status(400).json({mensagem: `Login negado: o email ${email} não foi encontrado.`}); 
                
                return gerar_token(email_cadastrado, clienteKey, senha, res);
            }
        }
        
        return res.status(400).json({mensagem: 'Login negado: todos os campos são obrigatórios.'});
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});        
    }
}
            
module.exports = {
    login_banco,
    login_conta
}

            
        
