const knex = require("../conexoes/knex");
const { gerar_token } = require("../validacoes/schema_login");
const { nome_resposta } = require('../validacoes/schema_resposta');

const login = async (req, res) => {
    const { instituicao_nome, cpf, email, senha } = req.body;

    try {
        if (instituicao_nome && senha) {
            
            const banco_cadastrado = await knex('dados_banco').select('nome', 'senha').first();
            
            if (!banco_cadastrado) return res.status(400).json({mensagem: 'Login negado: não existe instituição cadastrada no sistema'});

            if (banco_cadastrado.nome !== instituicao_nome) return res.status(400).json({mensagem: `Login negado: o nome ${nome_resposta(instituicao_nome)} não corresponde ao do banco cadastrado no sistema.`});
            
            return gerar_token(banco_cadastrado, senha, res);
        }
        
        if ((cpf || email) && senha) {
            
            if (cpf) {
                
                const cpf_cadastrado = await knex('dados_cliente').where({cpf}).first();

                if (!cpf_cadastrado) return res.status(400).json({mensagem: `Login negado: o CPF ${cpf} não foi encontrado.`}); 
                                
                return gerar_token(cpf_cadastrado, senha, res);
            }
            
            if(email) {
                const email_cadastrado = await knex('dados_cliente').where({email}).first();

                if (!email_cadastrado) return res.status(400).json({mensagem: `Login negado: o email ${email} não foi encontrado.`}); 
                
                return gerar_token(email_cadastrado, senha, res);
            }
        }
                
        return res.status(400).json({mensagem: 'Login negado: todos os campos são obrigatórios.'});

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
            
module.exports = {
    login
}

            
        
