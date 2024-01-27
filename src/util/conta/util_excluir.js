const knex = require("../../conexoes/knex");

async function del_cliente(dado) {
    knex.transaction(async (trx) => {
        await trx('dados_cliente').where({ id_cliente: dado}).del();
        await trx('dados_banco').decrement('qtd_contas', 1);
    }); 
}

module.exports = {
    del_cliente
}