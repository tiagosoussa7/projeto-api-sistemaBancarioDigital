const knex = require("../../conexoes/knex");

async function cadastrar_cliente(nome, cpf, email, data_nascimento, senha_criptografada, banco) {

    knex.transaction(async (trx) => {
        const [cliente_cadastrado]  = await trx('dados_cliente').insert({
            nome: nome,
            cpf: cpf,
            email: email,
            data_nascimento: data_nascimento,
            senha: senha_criptografada,
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
    cadastrar_cliente
}