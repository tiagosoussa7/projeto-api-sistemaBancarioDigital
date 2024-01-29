const { nome_resposta } = require('../util/util_resposta');

const { 
    checar_cpf, 
    checar_email, 
    checar_banco 
} = require("../util/util_funcionalidades");
const { 
    chave_banco, 
    chave_conta 
} = require("../validacoes/senhaHash");

const { gerar_token } = require("../util/util_login");

const login_banco = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    
    try {
        const banco = await checar_banco();
        
        if (!banco) return res.status(400).json({mensagem: 'Login negado: não existe instituição cadastrada no sistema'});
            
        if (banco.nome !== instituicao_nome) return res.status(400).json({mensagem: `Login negado: o nome ${nome_resposta(instituicao_nome)} não corresponde ao do banco cadastrado no sistema.`});

        return gerar_token(banco, chave_banco, instituicao_senha, res);
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
       
const login_conta = async (req, res) => {
    const { cpf, email, senha } = req.body; 
    
    try {
        if (cpf && senha) { if (!await checar_cpf(cpf)) return res.status(400).json({mensagem: `Login negado: o CPF ${cpf} não foi encontrado.`}); 
            
            return gerar_token(await checar_cpf(cpf), chave_conta, senha, res);
        }
            
        if(email && senha) { if (!await checar_email(email)) return res.status(400).json({mensagem: `Login negado: o email ${email} não foi encontrado.`}); 
                
            return gerar_token(await checar_email(email), chave_conta, senha, res);
        }
        
        return res.status(400).json({mensagem: `Login negado: preencha o campo email ou CPF.`});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});        
    }
}

module.exports = {
    login_banco,
    login_conta
}                                           