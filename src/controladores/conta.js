const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { idade_resposta, nome_resposta } = require('../validacoes/schema_resposta');

const cadastro = async (req,res) => {
    const { nome, cpf, email, data_nascimento, senha } = req.body;
    
    try {                
        const banco_cadastrado = await knex('dados_banco').select('*').first();
    
        if (!banco_cadastrado) {
            res.status(400).json({mensagem: `Cadastro bloqueado: ${nome_resposta(nome)} o sistema está sem banco controlador.`});
        }

        if (!nome || !cpf || !email || !data_nascimento || !senha) { 
            return res.status(400).json({mensagem: `Cadastro bloqueado: ${nome_resposta(nome)}, todos os campos são obrigatórios.`});
        }

        if (idade_resposta(data_nascimento) < 18) {
            return res.status(400).json({mensagem: `${nome_resposta(nome)} é necessário ter 18 anos para abrir uma conta no banco: ${nome_resposta(banco_cadastrado.nome)}.`});
        }

        const email_cadastrado = await knex('dados_cliente').where({email}).first();
        
        if (email_cadastrado) {
            return res.status(400).json({mensagem: `Cadastro bloqueado: ${nome_resposta(nome)} o email: ${email} já tem cadastro no banco.`});
        }

        const cpf_cadastrado = await knex('dados_cliente').where({cpf}).first();
        
        if (cpf_cadastrado) {
            return res.status(400).json({mensagem: `Cadastro bloqueado: ${nome_resposta(nome)} o cpf: ${cpf} já tem cadastro no banco.`});
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10); 
        
        knex.transaction(async (trx) => {
        
            const [ cliente_cadastrado ] = await trx('dados_cliente').insert({
            nome,
            cpf,
            email,
            data_nascimento,
            senha: senhaCriptografada,
            id_banco: banco_cadastrado.id_banco
            }).returning('*');
            
            if (!cliente_cadastrado) {
                res.status(400).json({ mensagem: 'O cadastro não foi realizado' });
            }
            
            await trx('dados_conta').insert({
                numero_conta: cliente_cadastrado.id_cliente,
                id_banco: banco_cadastrado.id_banco
            });
            
            await trx('dados_banco').increment('qtd_contas', 1);
        });
        
        return res.status(200).json({mensagem: `Cadastro efetivado: Parabéns! ${nome_resposta(nome)} agora você é cliente do banco ${nome_resposta(banco_cadastrado.nome)}`});

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
           


module.exports = {
    cadastro
}