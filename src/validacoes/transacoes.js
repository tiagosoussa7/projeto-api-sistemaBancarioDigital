const joi = require('joi');

const schema_deposito = joi.object({
    valor: joi.number().positive().required().messages({
        'any.required': 'Deposito negado: o campo valor é obrigatório.',
        'number.positive': 'Deposito negado: não é aceito valores negativos ou zero',
        'number.base': 'Deposito negado: campo vazio, preencha com um valor positivo.'
    })
})

const schema_saque = joi.object({
    valor: joi.number().positive().required().messages({
        'any.required': 'Saque negado: o campo valor é obrigatório.',
        'number.positive': 'Saque negado: não é aceito valores negativos ou zero',
        'number.base': 'Saque negado: campo vazio, preencha com um valor positivo.'
    }),
    senha: joi.string().required().messages({
        'string.base': 'Saque negada: preencha corretamente o campo senha.',
        'string.empty': 'Saque negada: o campo senha está vazio.',
        'any.required': 'Saque negada: o campo senha é obrigatório.'
    })
})

const schema_transferencia = joi.object({
    valor: joi.number().positive().required().messages({
        'any.required': 'Deposito negado: o campo valor é obrigatório.',
        'number.positive': 'Deposito negado: não é aceito valores negativos ou zero',
        'number.base': 'Deposito negado: preencha com um valor positivo.'
    }),
    senha: joi.string().required().messages({
        'string.base': 'Saque negada: preencha corretamente o campo senha.',
        'string.empty': 'Saque negada: o campo senha está vazio.',
        'any.required': 'Saque negada: o campo senha é obrigatório.'
    }),
    conta_destino: joi.number().integer().positive().required().messages({
        'number.base': 'Transferencia negada: campo vazio, preencha com um número inteiro e positivo.',
        'number.integer': 'Transferencia negada: preencha com um número inteiro e positivo.',
        'number.positive': 'Transferencia negada: preencha com um número inteiro e positivo.',
        'any.required': 'Transferencia negada: o campo conta destino é obrigatório'
    })
});

module.exports = {
    schema_deposito,
    schema_saque,
    schema_transferencia
}