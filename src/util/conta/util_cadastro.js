const knex = require("../../conexoes/knex");
const { criptar_senha } = require("../util_funcionalidades");

async function insert_cliente(nome, cpf, email, data_nascimento, senha, banco) {

    knex.transaction(async (trx) => {
        const [cliente_cadastrado]  = await trx('dados_cliente').insert({
            nome: nome,
            cpf: cpf,
            email: email,
            data_nascimento: data_nascimento,
            senha: await criptar_senha(senha),
            id_banco: banco.id_banco
        }).returning('id_cliente');
        
        await trx('dados_conta').insert({
            numero_conta: cliente_cadastrado.id_cliente,
            id_banco: banco.id_banco
        }).returning('*');
        
        await trx('dados_banco').increment('qtd_contas', 1);
        
    });
}

module.exports = {
    insert_cliente
}