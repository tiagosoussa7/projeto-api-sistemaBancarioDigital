const knex = require("../../conexoes/knex");

async function registrar_transferencia( cliente, conta_destino, banco, valor) {
    knex.transaction( async (trx) => {
        await trx('dados_transferencias').insert({
            numero_conta: cliente.id_cliente,
            valor_transferencias: parseFloat(valor),
            conta_destino: conta_destino,
            id_banco: banco.id_banco
        });

        await trx('dados_conta').decrement('saldo', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
        await trx('dados_conta').increment('saldo', parseFloat(valor)).where({numero_conta: conta_destino});
        await trx('dados_conta').increment('qtd_transferencias', 1 ).where({numero_conta: cliente.id_cliente});
        await trx('dados_conta').increment('qtd_transferencias', 1 ).where({numero_conta: conta_destino});

    }); 
}

module.exports = {
    registrar_transferencia
}