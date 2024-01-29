const { nome_resposta } = require('../util/util_resposta');

const { 
    checar_banco, 
    comparar_senha, 
    checar_saldo, 
    checar_conta 
} = require('../util/util_funcionalidades');

const { registrar_deposito } = require('../util/transacoes/util_deposito');
const { registrar_saque } = require('../util/transacoes/util_saque');
const { insert_transferencia } = require('../util/transacoes/util_transferencia');

const deposito = async (req, res) => {
    const { cliente } = req;
    const { valor } = req.body;
    
    try {
        await registrar_deposito(cliente, await checar_banco(), valor);

        return res.status(200).json({mensagem: `Deposito efetivado: o valor de ${valor} ${ valor == 1 ? 'real' : 'reais'} foi depositado na sua conta ${nome_resposta(cliente.nome)}`})
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
    
const saque = async (req, res) => {
    const { cliente } = req;
    const { valor, senha } = req.body;

    try {
        if(!await comparar_senha(senha, cliente.senha)) return res.status(400).json({mensagem: `Saque negado: ${nome_resposta(cliente.nome)} a senha está incorreta.`});

        const saldo = await checar_saldo(cliente.id_cliente);
        
        if(saldo < parseFloat(valor)) return res.status(400).json({mensagem: `Saque negado: ${nome_resposta(cliente.nome)} seu saldo ${saldo} ${saldo <= 1 ? 'real' : 'reais'} é insuficiente para sacar o valor de ${valor} ${valor == 1 ? 'real' : 'reais'}.`});

        await registrar_saque(cliente, await checar_banco(), valor);
        
        return res.status(200).json({mensagem: `Saque efetivado: o valor de ${valor} ${ valor == 1 ? 'real' : 'reais'} foi sacado da sua conta ${nome_resposta(cliente.nome)}`});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}    
   
const transferencia = async (req, res) => {
    const { cliente } = req;
    const { conta_destino, valor, senha } = req.body;

    try {
        if (cliente.id_cliente == conta_destino) return res.status(400).json({mensagem: `Transferência negada: ${nome_resposta(cliente.nome)} o número de conta: ${conta_destino} informado é o seu.`});

        if (!await checar_conta(conta_destino)) return res.status(400).json({mensagem: `Transferência negada: ${nome_resposta(cliente.nome)} o numero da conta: ${conta_destino} informada não existe.`});

        const saldo = await checar_saldo(cliente.id_cliente);
        
        if(saldo < parseFloat(valor)) return res.status(400).json({mensagem: `Transferência negado: ${nome_resposta(cliente.nome)} seu saldo de R$:${saldo} ${saldo <= 1 ? 'real' : 'reais'} é insuficiente para tranferir o valor de R$:${valor} ${valor == 1 ? 'real' : 'reais'}.`});

        if (!await comparar_senha(senha, cliente.senha)) return res.status(400).json({mensagem: `Transferência negada: ${nome_resposta(cliente.nome)} a senha está incorreta.`});

        await insert_transferencia(cliente, conta_destino, await checar_banco(), valor);

        return res.status(400).json({mensagem: `Tranferência efetivada: ${nome_resposta(cliente.nome)} o valor de ${valor} ${valor == 1 ? 'real' : 'reais'} foi transferido para a conta de número: ${conta_destino}.`})
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
    
module.exports = {
    deposito,
    saque,
    transferencia
}