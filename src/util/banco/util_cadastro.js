const knex = require("../../conexoes/knex");
const { criptar_senha } = require("../util_funcionalidades");

async function insert(nome, senha) {
    await knex('dados_banco').insert({
        nome: nome,
        senha: await criptar_senha(senha)
    });
}

module.exports = {
    insert
}