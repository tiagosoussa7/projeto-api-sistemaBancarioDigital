const { 
    idade_resposta, 
    nome_resposta, 
    data_resposta 
} = require('../util/util_resposta');

const { 
    checar_email, 
    checar_cpf, 
    checar_saldo, 
    checar_banco, 
    checar_conta, 
    comparar_senha 
} = require('../util/util_funcionalidades');

const { insert_cliente } = require('../util/conta/util_cadastro');

const { detalhar_conta } = require('../util/conta/util_informacaoConta');

const { detalhar_cliente } = require('../util/conta/util_informacaoCliente');

const { delete_cliente } = require('../util/conta/util_excluir');

const { 
    detalhar_depositos, 
    detalhar_saques, 
    detalhar_transferencias 
} = require('../util/conta/util_extrato');

const { 
    update_conta1, 
    update_conta2, 
    update_conta3, 
    update_conta4, 
    update_conta5 
} = require('../util/conta/util_atualizar');

const cadastrar = async (req,res) => {
    const { nome, cpf, email, data_nascimento, senha } = req.body;

    try {
        const banco = await checar_banco();
        
        if (!banco) return res.status(400).json({mensagem: 'Cadastro negado: sistema bancário digital está sem um banco controlador.'});

        if (idade_resposta(data_nascimento) < 18) return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} você tem ${idade_resposta(data_nascimento)} anos de idade e para abrir conta na instituição ${nome_resposta(banco.nome)} é necessário ter no mínimo 18 anos.`});
                
        if (await checar_email(email)) return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} o email: ${email} já está cadastrado no banco: ${nome_resposta(banco.nome)}.`});
        
        if (await checar_cpf(cpf)) return res.status(400).json({mensagem: `Cadastro negado: ${nome_resposta(nome)} o CPF: ${cpf} já está cadastrado no banco: ${nome_resposta(banco.nome)}.`});
        
        await insert_cliente(nome, cpf, email, data_nascimento, senha, banco);
        
        return res.status(200).json({mensagem: `Cadastro efetivado: Parabéns! ${nome_resposta(nome)}, agora você é cliente do banco: ${nome_resposta(banco.nome)}`,});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const informacao_conta = async ( req, res ) => {
    const { cliente } = req;
    return detalhar_conta(cliente, await checar_conta(cliente.id_cliente), res);
}
    
const informacao_cliente = async (req, res) => {
    const { cliente } = req, dataFormatada = cliente.data_nascimento.toString();
    return detalhar_cliente(cliente, dataFormatada, res);
}
    
const extrato = async (req, res) => {
    const { cliente } = req, { transacao } = req.body;
    
    try {
        if ( transacao == 'deposito') return await detalhar_depositos('dados_depositos', cliente, res);
        
        if ( transacao == 'saque') return await detalhar_saques('dados_saques', cliente, res);

        if (transacao == 'transferencia') return await detalhar_transferencias(cliente, res);
        
        return res.status(200).json({mensagem: `Extrato negado: ${nome_resposta(cliente.nome)} é obrigatório especificar qual o tipo da transação.`})
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const atualizar = async (req, res) => {
    const { nome, email, cpf, data_nascimento, senha} = req.body;
    const { cliente } = req;
    
    try {
        if ((nome) && nome == cliente.nome) return res.status(400).json({mensagem: `Atualização negada: o nome ${nome_resposta(nome)} é o mesmo nome do seu cadastro.`});
        
        if ((email) && email == cliente.email) return res.status(400).json({mensagem: `Atualização negada: o email ${email} é o mesmo email do seu cadastro.`});
        
        if ((email) && email !== cliente.email) if(await checar_email(email)) return res.status(400).json({mensagem: `Atualização negada: o email ${email} já está cadastrado.`});
         
        if ((cpf) && cpf == cliente.cpf) return res.status(400).json({mensagem: `Atualização negada: o CPF: ${cpf} é o mesmo CPF do seu cadastro.`});

        if ((cpf) && cpf !== cliente.cpf) if(await checar_cpf(cpf)) return res.status(400).json({mensagem: `Atualização negada: o CPF: ${cpf} já está cadastrado.`});

        if ((data_nascimento) && data_nascimento == data_resposta(cliente.data_nascimento)) return res.status(400).json({mensagem: `Atualização negada: a data de nascimento ${data_nascimento} é a mesma do seu cadastro.`});
                
        if((data_nascimento) && idade_resposta(data_nascimento) < 18) return res.status(400).json({mensagem: `Atualização negada: não é aceito data de nascimento menor de 18 anos.`});

        if((senha) && await comparar_senha(senha, cliente.senha)) return res.status(400).json({mensagem: 'Atualização negada: a senha de atualização é a mesma do cadastro.'});

        if(nome) await update_conta1(cliente, nome);
        if(email) await update_conta2(cliente, email);
        if(cpf) await update_conta3(cliente, cpf);
        if(data_nascimento) await update_conta4(cliente, data_nascimento);
        if(senha) await update_conta5(cliente, senha);
        
        return res.status(400).json({mensagem: 'atualização efetivada.'})
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}   
    
const excluir = async (req, res) => { 
    const { cliente } = req;
    const { cpf, senha } = req.body;

    try {
        if(cpf !== cliente.cpf) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} este CPF: ${cpf} não corresponde ao do seu cadastro.`});

        if(!await comparar_senha(senha, cliente.senha )) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} a senha está incorreta.`});
            
        const saldo = await checar_saldo(cliente.id_cliente);

        if(saldo > 0) return res.status(400).json({mensagem: `Exclusão negada: ${nome_resposta(cliente.nome)} a sua conta de numero:${cliente.id_cliente} possui saldo de R$: ${saldo} ${saldo == 1 ? 'real.' : 'reais.'}`});

        await delete_cliente(cliente.id_cliente);

        return res.status(200).json({mensagem: 'Exclusão efetivada.'});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    cadastrar,
    informacao_conta,
    informacao_cliente,
    extrato,
    atualizar,
    excluir
}