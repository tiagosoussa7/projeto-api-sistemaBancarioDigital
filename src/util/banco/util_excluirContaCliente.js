const knex = require("../../conexoes/knex");

async function del_conta(dado) {
    knex.transaction( async (trx) => {
        await trx('dados_cliente').where({id_cliente: dado}).del();
        await trx('dados_banco').decrement('qtd_contas', 1);
    });
}

async function nome(dado) {
    const nome = await knex('dados_cliente').where({id_cliente: dado}).select('nome').first();
    return nome.nome;
}

module.exports = {
    del_conta,
    nome
}