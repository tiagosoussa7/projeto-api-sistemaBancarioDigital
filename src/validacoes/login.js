const joi = require('joi');

const schema_banco = joi.object({
    instituicao_nome: joi.string().required().messages({
        'any.required': 'Login negado: o campo instituição nome é obrigatório.',
        'string.empty': 'Login negado: o campo instituição nome está vazio.',
        'string.base': 'Login negado: preencha corretamente o campo instituição nome.',
    }),
    instituicao_senha: joi.string().required().messages({
        'any.required': 'Login negado: o campo instituição senha é obrigatório.',
        'string.base': 'Login negado: preencha corretamente o campo instituição senha.',
        'string.empty': 'Login negado: o campo instituição senha está vazio.'
    })
});

const schema_conta = joi.object({
    cpf: joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).messages({
        'string.pattern.base': 'Login negada: preencha o campo CPF no formato 000.000.000-00.',
        'string.empty': 'Login negada: campo vazio, preencha o CPF  no formato 000.000.000-00.',
        'string.base': 'Login negada: formato inválido, preencha o CPF no formato 000.000.000-00.'
    }),
    email: joi.string().email().messages({
        'string.email': 'Login negado: o email não é válido.',
        'string.base': 'Login negado: o email não é válido'
    }),
    senha: joi.string().required().messages({
        'any.required': 'Login negado: o campo senha é obrigatório.',
        'string.base': 'Login negado: preencha corretamente o campo senha.',
        'string.empty': 'Login negado: o campo senha está vazio.'
    })
});

module.exports = {
    schema_banco,
    schema_conta
}