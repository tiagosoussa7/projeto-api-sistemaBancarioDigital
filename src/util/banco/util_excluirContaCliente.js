const knex = require("../../conexoes/knex");

async function deletar_dados(dado) {
    knex.transaction( async (trx) => {
    
        await trx('dados_conta').where({numero_conta: dado}).del();
        await trx('dados_cliente').where({id_cliente: dado}).del();
        await trx('dados_banco').decrement('qtd_contas', 1);
    });
}

module.exports = {
    deletar_dados
}