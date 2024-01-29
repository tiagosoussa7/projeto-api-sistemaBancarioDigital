const knex = require("../../conexoes/knex");
const { criptar_senha } = require("../util_funcionalidades");

async function update_conta1(cliente, nome ) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({ nome: nome });
}
async function update_conta1(cliente, nome ) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({ nome: nome });
}
async function update_conta2(cliente, email ) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({ email: email });
}
async function update_conta3(cliente, cpf ) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({ cpf: cpf });
}
async function update_conta4(cliente, data_nascimento ) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({ data_nascimento: data_nascimento });
}
async function update_conta5(cliente, senha ) {
    await knex('dados_cliente').where({id_cliente: cliente.id_cliente}).update({ senha: await criptar_senha(senha) });
}

module.exports = {
    update_conta1,
    update_conta2,
    update_conta3,
    update_conta4,
    update_conta5
}