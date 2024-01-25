const knex = require("../../conexoes/knex");

async function excluir_cliente(dado) {
    knex.transaction(async (trx) => {
                
        //await trx('dados_transferencias').where({ numero_conta: dado }).del();
        //await trx('dados_saques').where({ numero_conta: dado }).del();
        //await trx('dados_depositos').where({ numero_conta: dado }).del();
        await trx('dados_conta').where({ numero_conta: dado}).del();
        await trx('dados_cliente').where({ id_cliente: dado}).del();
  
        await trx('dados_banco').decrement('qtd_contas', 1);
    }); 
}

module.exports = {
    excluir_cliente
}