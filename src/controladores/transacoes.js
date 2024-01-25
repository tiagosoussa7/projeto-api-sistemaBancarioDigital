const knex = require('../conexoes/knex');
const { registrar_deposito } = require('../util/transacoes/util_deposito');
const { checar_banco } = require('../util/util_funcionalidades');
const { nome_resposta } = require('../util/util_resposta');

const deposito = async (req, res) => {
    const { cliente } = req;
    const { valor } = req.body;
    
    try {
        if (!valor) return res.status(200).json({mensagem: `Deposito negado: ${nome_resposta(cliente.nome)} digite o valor a ser depositado.`});

        if (parseFloat(valor) === 0 || parseFloat(valor) < 0) return res.status(400).json({mensagem: `Deposito negado: ${nome_resposta(cliente.nome)} não é aceito valor ${ parseFloat(valor) == 0 ? 'zero' : 'negativo'} para deposito.`});
        
        const banco = await checar_banco();

        await registrar_deposito(cliente, banco, valor);

        //knex.transaction( async (trx) => {
            //await trx('dados_depositos').insert({
                //numero_conta: cliente.id_cliente,
                //valor_deposito: parseFloat(valor),
                //id_banco: banco.id_banco
            //});

            //await trx('dados_conta').increment('total_depositos', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
            //await trx('dados_banco').increment('orcamento', parseFloat(valor));
        //}); 

        return res.status(200).json({mensagem: `Deposito efetivado: o valor de ${valor} ${ parseFloat(valor) == 1 ? 'real' : 'reais'} foi depositado na sua conta ${nome_resposta(cliente.nome)}`})
        
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
    
}
const saque = async (req, res) => {
    return res.status(200).json({mensagem: `saque`});
}
    
const transferencia = async (req, res) => {
    return res.status(200).json({mensagem: `transferência`});
}


module.exports = {
    deposito,
    saque,
    transferencia
}