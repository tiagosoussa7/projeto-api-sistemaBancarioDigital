const bcrypt = require('bcrypt');
const knex = require('../conexoes/knex');

async function comparar_senha(senha1, senha2) {
    const senha = await bcrypt.compare(senha1, senha2);
    return senha;
}

async function criptar_senha(senha) {
    const senha_criptografada = await bcrypt.hash(senha, 10);
    return senha_criptografada;
}

async function checar_cpf(dado) {
    const cpf = await knex('dados_cliente').where({cpf: dado}).first();
    return cpf;
}

async function checar_email(dado) {
    const email = await knex('dados_cliente').where({email: dado}).first();
    return email;
}

async function checar_banco() {
    const banco = await knex('dados_banco').select('*').first();
    return banco;
}

async function checar_saldo(dado) {
    const saldo = await knex('dados_conta').where({numero_conta: dado}).first();
    return saldo.saldo;
}


module.exports = {
    comparar_senha,
    criptar_senha,
    checar_cpf,
    checar_email,
    checar_banco,
    checar_saldo
}