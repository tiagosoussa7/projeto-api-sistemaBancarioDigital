const knex = require("../../conexoes/knex");

async function cadastro_banco(nome, senha) {
    await knex('dados_banco').insert({
        nome: nome,
        senha: senha
    });
}

module.exports = {
    cadastro_banco
}