const knex = require("../../conexoes/knex");

async function deletar_banco(dado) {
    await knex.transaction(async (trx) => {
                
        await trx('dados_conta').where({ id_banco: dado }).del();
        await trx('dados_cliente').where({ id_banco: dado }).del();
        //await trx('transacoes').where({ id_banco: dado }).del();
  
        await trx('dados_banco').where({ id_banco: dado }).del();
  
    });  
}

module.exports = {
    deletar_banco
}