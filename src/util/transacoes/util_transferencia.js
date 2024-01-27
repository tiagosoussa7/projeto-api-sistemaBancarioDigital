const knex = require("../../conexoes/knex");

async function insert_transferencia( cliente, conta_destino, banco, valor) {
    
    knex.transaction( async (trx) => {
        await trx('transferencias_enviadas').insert({
            conta_origem: cliente.id_cliente,
            valor: parseFloat(valor),
            conta_destino: conta_destino,
            id_banco: banco.id_banco
        });
        
        await trx('transferencias_recebidas').insert({
            conta_destino: conta_destino,
            valor: parseFloat(valor),
            conta_origem: cliente.id_cliente,
            id_banco: banco.id_banco
        });

        await trx('dados_conta').decrement('saldo', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
        await trx('dados_conta').increment('saldo', parseFloat(valor)).where({numero_conta: conta_destino});
        await trx('dados_conta').increment('qtd_transferencias', 1 ).where({numero_conta: cliente.id_cliente});
        await trx('dados_conta').increment('qtd_transferencias', 1 ).where({numero_conta: conta_destino});

    }); 
}

module.exports = {
    insert_transferencia
}