const knex = require("../conexoes/knex");
const { checar_cpf, checar_email, checar_banco } = require("../util/util_funcionalidades");
const { gerar_token } = require("../util/util_login");
const { nome_resposta } = require('../util/util_resposta');
const { chave_banco, chave_cliente } = require("../validacoes/senhaHash");

const login_banco = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    const bancoKey = chave_banco, banco = await checar_banco();

    try {
        if (instituicao_nome && instituicao_senha) {
            if (!banco) return res.status(400).json({mensagem: 'Login negado: não existe instituição cadastrada no sistema'});
            
            if (banco.nome !== instituicao_nome) return res.status(400).json({mensagem: `Login negado: o nome ${nome_resposta(instituicao_nome)} não corresponde ao do banco cadastrado no sistema.`});

            return gerar_token(banco, bancoKey, instituicao_senha, res);
        }
            
        return res.status(400).json({mensagem: `Login negado: o campo ${instituicao_nome ? 'senha da instituição' : 'nome da instituição'} é obrigatório.`});
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
                if (!await checar_cpf(cpf)) return res.status(400).json({mensagem: `Login negado: o CPF ${cpf} não foi encontrado.`}); 
                
                return gerar_token(cpf_cadastrado, clienteKey, senha, res);
            }
                
            if(email) {
                if (!await checar_email(email)) return res.status(400).json({mensagem: `Login negado: o email ${email} não foi encontrado.`}); 
            
                return gerar_token(await checar_email(email), clienteKey, senha, res);
            }
        }

        return res.status(400).json({mensagem: `Login negado: o campo ${cpf || email ? 'senha' : 'CPF ou email'} é obrigatório.`});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});        
    }
}
                            
module.exports = {
    login_banco,
    login_conta
}