const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { idade_resposta, nome_resposta, data_resposta, hora_resposta } = require('../validacoes/schema_resposta');

const cadastro = async (req,res) => {
    const { nome, cpf, email, data_nascimento, senha } = req.body;
    
    if (!nome || !cpf || !email || !data_nascimento || !senha) { 
        return res.status(400).json({mensagem: `Cadastro negado: todos os campos são obrigatórios.`});
    }
    
    
    try {
        if (nome && cpf && email && data_nascimento && senha ) {
            
            if (idade_resposta(data_nascimento) < 18) {
                return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} você tem ${idade_resposta(data_nascimento)} anos de idade e para abrir conta na instituição ${nome_resposta(req.banco.nome)} é necessário ter no mínimo 18 anos.`});
            }
            
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
            
            return res.status(200).json({mensagem: `Cadastro efetivado: Parabéns! ${nome_resposta(nome)}, agora você é cliente do banco: ${nome_resposta(req.banco.nome)}`,});
        }    

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const informacao_cliente = async (req, res) => {

    const cliente_informacoes = {
        Numero_conta: req.cliente.id_cliente,
        Nome: nome_resposta(req.cliente.nome),
        Idade: idade_resposta(req.cliente.data_nascimento),
        CPF: req.cliente.cpf,
        Data_nascimento: data_resposta(req.cliente.data_nascimento),
        Email: req.cliente.email   
    }
    
    return res.status(200).json({Informações_cliente: cliente_informacoes});
}

const informacao_conta = async ( req, res ) => {
    const conta = await knex('dados_conta').where({numero_conta: req.cliente.id_cliente}).first();
    
    const dados_conta = {
        Numero_conta: conta.numero_conta,
        Nome: nome_resposta(req.cliente.nome),
        Saldo: conta.saldo,
        Total_saques: conta.total_saques,
        Total_depositos: conta.total_depositos,
        Numero_transferências: conta.qtd_transferencias,
        Conta_aberta: data_resposta(conta.data_abertura),
        Horário: hora_resposta(conta.hora_abertura)
    }
    
    return res.status(200).json({Informações_conta: dados_conta});

}

            

module.exports = {
    cadastro,
    informacao_cliente,
    informacao_conta
}