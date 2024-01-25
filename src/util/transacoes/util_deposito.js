const knex = require("../../conexoes/knex");

async function registrar_deposito( cliente, banco, valor) {
    knex.transaction( async (trx) => {
        await trx('dados_depositos').insert({
            numero_conta: cliente.id_cliente,
            valor_deposito: parseFloat(valor),
            id_banco: banco.id_banco
        });

        await trx('dados_conta').increment('total_depositos', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
        await trx('dados_conta').increment('saldo', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
        await trx('dados_banco').increment('orcamento', parseFloat(valor));
    }); 
}

module.exports = {
    registrar_deposito
}