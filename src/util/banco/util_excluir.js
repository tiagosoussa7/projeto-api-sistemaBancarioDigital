const knex = require("../../conexoes/knex");

async function excluir_banco(dado) {
    
    await knex.transaction(async (trx) => {
                
        await trx('dados_transferencias').where({ id_banco: dado }).del();
        await trx('dados_saques').where({ id_banco: dado }).del();
        await trx('dados_depositos').where({ id_banco: dado }).del();
        await trx('dados_conta').where({ id_banco: dado }).del();
        await trx('dados_cliente').where({ id_banco: dado }).del();
  
        await trx('dados_banco').where({ id_banco: dado }).del();
  
    });  
}

async function somar_saldos(dado) {

    const saldoContas = await knex('dados_conta')
      .where({ id_banco: dado })
      .sum('saldo as totalSaldo')
      .first();

    const totalSaldo = saldoContas.totalSaldo || 0;
    
    return totalSaldo;
}

module.exports = {
    excluir_banco,
    somar_saldos
}