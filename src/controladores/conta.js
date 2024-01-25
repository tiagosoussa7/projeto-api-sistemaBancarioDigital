const knex = require('../conexoes/knex');
const { idade_resposta, nome_resposta, data_resposta } = require('../util/util_resposta');
const { checar_email, checar_cpf, criptar_senha, comparar_senha, checar_saldo } = require('../util/util_funcionalidades');
const { cadastrar_cliente } = require('../util/conta/util_cadastro');
const { detalhar_conta } = require('../util/conta/util_informacaoConta');
const { detalhar_cliente } = require('../util/conta/util_informacaoCliente');
const { excluir_cliente } = require('../util/conta/util_excluir');

const cadastro = async (req,res) => {
    const { nome, cpf, email, data_nascimento, senha } = req.body;
    
    if (!nome || !cpf || !email || !data_nascimento || !senha) { 
        return res.status(400).json({mensagem: `Cadastro negado: todos os campos são obrigatórios.`});
    }
    
    try {
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

        await cadastrar_cliente(nome, cpf, email, data_nascimento, senha_criptografada, banco);
            
        return res.status(200).json({mensagem: `Cadastro efetivado: Parabéns! ${nome_resposta(nome)}, agora você é cliente do banco: ${nome_resposta(banco.nome)}`,});
       
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
                
        if (email !== cliente.email){ const email_cadastrado = await checar_email(email);
            
            if(email_cadastrado) return res.status(400).json({mensagem: `Atualização negada: o email ${email} já está cadastrado.`});
        }    
    
        if (data_nascimento === data_resposta(cliente.data_nascimento)) return res.status(400).json({mensagem: `Atualização negada: a data de nascimento ${data_nascimento} é a mesma do cadastro.`});
    
        if(idade_resposta(data_nascimento) < 18) return res.status(400).json({mensagem: `Atualização negada: não é aceito data de nascimento menor de 18 anos.`});
        
        const senha_comparadas = await comparar_senha(senha, cliente.senha);

        if(senha_comparadas) return res.status(400).json({mensagem: 'Atualização negada: a senha de atualização é a mesma do cadastro.'});

        const senha_criptografada = await criptar_senha(senha);
        
        await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({nome, email, data_nascimento, senha: senha_criptografada});
        
        return res.status(400).json({mensagem: 'atualização efetivada.'})
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
    
const excluir = async (req, res) => {
    const { cliente } = req;
    const { cpf, senha } = req.body;

    if ((cpf && !senha) || (!cpf && senha) ) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} o campo ${ cpf ? 'senha' : 'CPF'} é obrigatório.`});

    try {
        if (cpf && senha) {
            if(cpf !== cliente.cpf) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} este CPF: ${cpf} não corresponde ao do seu cadastro.`});

            const senha_comparadas = await comparar_senha(senha, cliente.senha);

            if(!senha_comparadas) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} a senha está incorreta.`});

            const saldo = await checar_saldo(cliente.id_cliente);

            if(saldo > 0) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} a sua conta de numero:${cliente.id_cliente} possui saldo de R$: ${saldo} ${saldo == 1 ? 'real.' : 'reais.'}`});

            await excluir_cliente(cliente.id_cliente);

            return res.status(200).json({mensagem: 'Exclusão efetivada.'});
        }

        return res.status(400).json({mensagem: 'Exclusão negada: os campos CPF e senha são obrigatórios.'});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
module.exports = {
    cadastro,
    informacao_conta,
    informacao_cliente,
    atualizar,
    excluir
}