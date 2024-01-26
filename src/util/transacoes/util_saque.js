const knex = require("../../conexoes/knex");

async function registrar_saque( cliente, banco, valor) {
    knex.transaction( async (trx) => {
        await trx('dados_saques').insert({
            numero_conta: cliente.id_cliente,
            valor: parseFloat(valor),
            id_banco: banco.id_banco
        });

        await trx('dados_conta').increment('total_saques', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
        await trx('dados_conta').decrement('saldo', parseFloat(valor)).where({numero_conta: cliente.id_cliente});
        await trx('dados_banco').decrement('orcamento', parseFloat(valor));
    }); 
}

module.exports = {
    registrar_saque
}