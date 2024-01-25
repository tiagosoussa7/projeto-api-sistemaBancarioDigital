const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { idade_resposta, nome_resposta, data_resposta, hora_resposta } = require('../util/util_resposta');
const { checar_email, checar_senha, checar_cpf, criptar_senha, comparar_senha } = require('../util/util_funcionalidades');
const { detalhar_cliente } = require('../util/conta/util_informacaoCliente');
const { detalhar_conta } = require('../util/conta/util_informacaoConta');

const cadastro = async (req,res) => {
    const { nome, cpf, email, data_nascimento, senha } = req.body;
    
    if (!nome || !cpf || !email || !data_nascimento || !senha) { 
        return res.status(400).json({mensagem: `Cadastro negado: todos os campos são obrigatórios.`});
    }
    
    
    try {
        //if (nome && cpf && email && data_nascimento && senha ) {
            const banco = await knex('dados_banco').select('id_banco', 'nome').first();
            
            if (!banco) return res.status(400).json({mensagem: 'Cadastro negado: sistema bancário digital está sem um banco controlador.'});

            if (idade_resposta(data_nascimento) < 18) {
                return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} você tem ${idade_resposta(data_nascimento)} anos de idade e para abrir conta na instituição ${nome_resposta(banco.nome)} é necessário ter no mínimo 18 anos.`});
            }
            
            const email_cadastrado = await checar_email(email);
        
            if (email_cadastrado) {
                return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} o email: ${email} já está cadastrado no banco: ${nome_resposta(banco.nome)}.`});
            }
        
            const cpf_cadastrado = await checar_cpf(cpf);
        
            if (cpf_cadastrado) {
                return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} o CPF: ${cpf} já está cadastrado no banco: ${nome_resposta(banco.nome)}.`});
            }

            const senha_criptografada = await criptar_senha(senha);

            knex.transaction(async (trx) => {

                const [cliente_cadastrado]  = await trx('dados_cliente').insert({
                    nome,
                    cpf,
                    email,
                    data_nascimento,
                    senha: senha_criptografada,
                    id_banco: banco.id_banco
                }).returning('id_cliente');
            
                if (!cliente_cadastrado) {
                    res.status(400).json({ mensagem: 'O cadastro não foi realizado' });
                }
            
                await trx('dados_conta').insert({
                    numero_conta: cliente_cadastrado.id_cliente,
                    id_banco: banco.id_banco
                }).returning('*');
            
                await trx('dados_banco').increment('qtd_contas', 1);
            
            });
            
            return res.status(200).json({mensagem: `Cadastro efetivado: Parabéns! ${nome_resposta(nome)}, agora você é cliente do banco: ${nome_resposta(banco.nome)}`,});
        //}    

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const informacao_conta = async ( req, res ) => {
    const { cliente } = req;
    const conta = await knex('dados_conta').where({numero_conta: cliente.id_cliente}).first();
    
    return detalhar_conta(cliente, conta, res);
}

const informacao_cliente = async (req, res) => {
    const { cliente } = req;
    const dataFormatada = cliente.data_nascimento.toString();
    
    return detalhar_cliente(cliente, dataFormatada, res);
}

const atualizar = async (req, res) => {
    const { nome, email, data_nascimento, senha} = req.body;
    const { cliente } = req;
    
    if (!nome || !email || !data_nascimento || !senha) return res.status(400).json({mensagem: 'Todos os campos são obrigatórios.'});
    
    try {
        
        if (nome === cliente.nome) return res.status(400).json({mensagem: `Atualização negada: o nome ${nome_resposta(nome)} é o mesmo nome do cadastro.`});
        
        if (email === cliente.email) return res.status(400).json({mensagem: `Atualização negada: o email ${email} é o mesmo email do cadastro.`});
                
        if (email !== cliente.email){
            const email_cadastrado = await checar_email(email);
            
            if(email_cadastrado) return res.status(400).json({mensagem: `Atualização negada: o email ${email} já está cadastrado.`});
        }    
    
        if (data_nascimento === data_resposta(cliente.data_nascimento)) return res.status(400).json({mensagem: `Atualização negada: a data de nascimento ${data_nascimento} é a mesma do cadastro.`});
    
        if(idade_resposta(data_nascimento) < 18) {
            return res.status(400).json({mensagem: `Atualização negada: não é aceito data de nascimento menor de 18 anos.`});
        }

        const senha_comparadas = await comparar_senha(senha, cliente.senha);

        if(senha_comparadas) return res.status(400).json({mensagem: 'Atualização negada: a senha de atualização é a mesma do cadastro.'});

        const senha_criptografada = await criptar_senha(senha);
        
        await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({nome, email, data_nascimento, senha: senha_criptografada});
        
        return res.status(400).json({mensagem: 'atualização efetivada.'})
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}



module.exports = {
    cadastro,
    informacao_conta,
    informacao_cliente,
    atualizar
}