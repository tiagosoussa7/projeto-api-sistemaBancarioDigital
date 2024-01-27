const knex = require("../../conexoes/knex");
const { criptar_senha } = require("../util_funcionalidades");

async function update_1(nome, senha, id_banco) {
    await knex('dados_banco').where({ id_banco }).update({nome: nome, senha: await criptar_senha(senha)});
}
async function update_2(nome, id_banco) {
    await knex('dados_banco').where({ id_banco }).update({nome: nome});
}
async function update_3(senha, id_banco) {
    await knex('dados_banco').where({ id_banco }).update({senha: await criptar_senha(senha)});
}

module.exports = {
    update_1,
    update_2,
    update_3
}