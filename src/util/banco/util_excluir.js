const knex = require("../../conexoes/knex");

async function delete_banco(dado) {
        await knex('dados_banco').where({ id_banco: dado }).del(); 
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
    delete_banco,
    somar_saldos
}