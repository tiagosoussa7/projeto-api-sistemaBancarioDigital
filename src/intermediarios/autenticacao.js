const jwt = require('jsonwebtoken');
const knex = require("../conexoes/knex");
const { chave_banco, chave_cliente } = require('../validacoes/senhaHash');
const { autenticacao_geral } = require('../validacoes/schema_autenticacao');

const autenticacaoBanco = async (req, res, next) => {
    const bancoKey = chave_banco, tabela_banco = 'dados_banco';

    try {
        let dados_banco = await autenticacao_geral(tabela_banco, bancoKey, req, res);

        req.banco = dados_banco;
        console.log(req.banco);

        next();

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const autenticacaoCliente = async (req, res, next) => {
    const clienteKey = chave_cliente, tabela_cliente = 'dados_cliente';

    try {
        let dados_cliente = await autenticacao_geral(tabela_cliente, clienteKey, req, res);

        req.cliente = dados_cliente;
        console.log(req.cliente);

        next();

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

module.exports = {
    autenticacaoBanco,
    autenticacaoCliente
}