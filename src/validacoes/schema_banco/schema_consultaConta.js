const knex = require("../../conexoes/knex");
const { data_resposta, hora_resposta, nome_resposta } = require("../schema_resposta");

async function conta_consultada(numero_conta, res) {
    
    const conta_cadastrada = await knex('dados_conta').where({numero_conta: parseInt(numero_conta)}).first();
            
    if (conta_cadastrada) {
        const conta = await knex.select(
            'dados_conta.numero_conta',
            'dados_conta.saldo',
            'dados_conta.total_saques',
            'dados_conta.total_depositos',
            'dados_conta.qtd_transferencias',
            'dados_conta.data_abertura',
            'dados_conta.hora_abertura',
            'dados_cliente.nome'
        )
        .from('dados_conta')
        .join('dados_cliente', 'dados_conta.numero_conta', 'dados_cliente.id_cliente')
        .where({numero_conta}).first();
 
        const dados_conta = {
            Numero_conta: conta.numero_conta,
            Nome: nome_resposta(conta.nome),
            Saldo: conta.saldo,
            Total_saques: conta.total_saques,
            Total_depositos: conta.total_depositos,
            Numero_transferências: conta.qtd_transferencias,
            Conta_aberta: data_resposta(conta.data_abertura),
            Horário: hora_resposta(conta.hora_abertura)
        }
                
        return res.status(200).json({Dados_conta: dados_conta})
    } else {
        return res.status(200).json({mensagem: `Consulta negada: a conta de número: ${numero_conta} não foi encontrada no banco de dados.`});
    }
}

async function contas_consultadas(res) {
    
    const contas = await knex.select(
        'dados_conta.numero_conta',
        'dados_cliente.nome',
        'dados_conta.saldo',
        'dados_conta.total_saques',
        'dados_conta.total_depositos',
        'dados_conta.qtd_transferencias'
    )
    .from('dados_conta')
    .join('dados_cliente', 'dados_conta.numero_conta', 'dados_cliente.id_cliente')
    .orderBy('dados_conta.numero_conta', 'asc');
            
    return res.status(200).json({Dados_contas: contas});
}

module.exports = {
    conta_consultada,
    contas_consultadas
}