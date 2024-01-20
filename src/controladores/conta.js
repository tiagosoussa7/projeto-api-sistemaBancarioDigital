const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { idade_resposta, nome_resposta } = require('../validacoes/schema_resposta');

const cadastro = async (req,res) => {
    const { nome, cpf, email, data_nascimento, senha } = req.body;
    
    if (!nome || !cpf || !email || !data_nascimento || !senha) { 
        return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)}, todos os campos são obrigatórios.`});
    }
    
    if (idade_resposta(data_nascimento) < 18) {
        return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} você tem ${idade_resposta(data_nascimento)} anos de idade e para abrir conta na instituição ${nome_resposta(req.banco.nome)} é necessário ter no mínimo 18 anos.`});
    }
    
    try {
        if (nome && cpf && email && data_nascimento && senha ) {
            
            const email_cadastrado = await knex('dados_cliente').where({email}).first();
        
            if (email_cadastrado) {
                return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} o email: ${email} já está cadastrado no banco: ${nome_resposta(req.banco.nome)}.`});
            }
        
            const cpf_cadastrado = await knex('dados_cliente').where({cpf}).first();
        
            if (cpf_cadastrado) {
                return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} o CPF: ${cpf} já está cadastrado no banco: ${nome_resposta(req.banco.nome)}.`});
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10); 

            knex.transaction(async (trx) => {

                const [cliente_cadastrado]  = await trx('dados_cliente').insert({
                    nome,
                    cpf,
                    email,
                    data_nascimento,
                    senha: senhaCriptografada,
                    id_banco: req.banco.id_banco
                }).returning('id_cliente');
            
                if (!cliente_cadastrado) {
                    res.status(400).json({ mensagem: 'O cadastro não foi realizado' });
                }
            
                await trx('dados_conta').insert({
                    numero_conta: cliente_cadastrado.id_cliente,
                    id_banco: req.banco.id_banco
                }).returning('*');
            
                await trx('dados_banco').increment('qtd_contas', 1);
            
            });
            
            return res.status(200).json({mensagem: `Cadastro efetivado: Parabéns! ${nome_resposta(nome)} agora você é cliente do banco: ${nome_resposta(req.banco.nome)}`,});
        }    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
            

module.exports = {
    cadastro
}