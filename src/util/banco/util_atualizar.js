const knex = require("../../conexoes/knex");
const { criptar_senha } = require("../util_funcionalidades");

async function update_banco1(nome, senha, id_banco) {
    await knex('dados_banco').where({ id_banco }).update({nome: nome, senha: await criptar_senha(senha)});
}
async function update_banco2(nome, id_banco) {
    await knex('dados_banco').where({ id_banco }).update({nome: nome});
}
async function update_banco3(senha, id_banco) {
    await knex('dados_banco').where({ id_banco }).update({senha: await criptar_senha(senha)});
}

module.exports = {
    update_banco1,
    update_banco2,
    update_banco3
}