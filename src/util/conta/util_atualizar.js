const knex = require("../../conexoes/knex");
const { criptar_senha } = require("../util_funcionalidades");

async function update_conta(cliente, nome, email, data_nascimento, senha) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({nome: nome, email: email, data_nascimento: data_nascimento, senha: await criptar_senha(senha)});
}

module.exports = {
    update_conta
}