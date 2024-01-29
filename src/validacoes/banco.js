const joi = require('joi');

const schema_cadastrar = joi.object({
    instituicao_nome: joi.string().required().messages({
        'any.required': 'Cadastro negado: o campo instituição nome é obrigatório.',
        'string.empty': 'Cadastro negado: o campo instituição nome está vazio.',
        'string.base': 'Cadastro negado: preencha corretamente o campo instituição nome.',
    }),
    instituicao_senha: joi.string().min(4).required().messages({
        'any.required': 'Cadastro negado: o campo instituição senha é obrigatório.',
        'string.base': 'Cadastro negado: preencha corretamente o campo instituição senha.',
        'string.min': 'Cadastro negado: a senha precisa ter no mínimo 4 caracteres.',
        'string.empty': 'Cadastro negado: o campo instituição senha está vazio.',
    })
})

const schema_consultaConta = joi.object({
    numero_conta: joi.number().integer().positive().messages({
        'number.base': 'Consulta negada: preencha um número inteiro e positivo.',
        'number.integer': 'Consulta negada: preencha um número inteiro e positivo.',
        'number.positive': 'Consulta negada: preencha um número inteiro e positivo.'
    }),
})

const schema_consultaCliente = joi.object({
    cpf: joi.string().max(11).messages({
        'string.max': 'Consulta negada: o CPF não pode ter mais que 11 dígitos.',
        'string.base': 'Consulta negada: o CPF deve ser digitado entre aspas duplas.'
    }),
})
const schema_atualizar = joi.object({
    instituicao_nome: joi.string().messages({
        'string.empty': 'Atualização negado: o campo instituição nome está vazio.',
        'string.base': 'Atualização negado: preencha corretamente o campo instituição nome.',
    }),
    instituicao_senha: joi.string().min(4).messages({
        'string.min': 'Atualização negado: a senha precisa ter no mínimo 4 caracteres.',
        'string.base': 'Atualização negado: preencha corretamente o campo instituição senha.',
        'string.empty': 'Atualização negado: o campo instituição senha está vazio.'
    })  
})

const schema_excluirConta = joi.object({
    numero_conta: joi.number().integer().positive().messages({
        'number.base': 'Consulta negada: preencha um número inteiro e positivo.',
        'number.integer': 'Consulta negada: preencha um número inteiro e positivo.',
        'number.positive': 'Consulta negada: preencha um número inteiro e positivo.'
    }),
    cpf: joi.string().max(11).messages({
        'string.max': 'Consulta negada: o CPF não pode ter mais que 11 dígitos.',
        'string.base': 'Consulta negada: o CPF deve ser digitado entre aspas duplas.'
    }),
})

const schema_excluir = joi.object({
    instituicao_nome: joi.string().required().messages({
        'any.required': 'Cadastro negado: o campo instituição nome é obrigatório.',
        'string.empty': 'Cadastro negado: o campo instituição nome está vazio.',
        'string.base': 'Cadastro negado: preencha corretamente o campo instituição nome.'
    }),
    instituicao_senha: joi.string().required().messages({
        'any.required': 'Cadastro negado: o campo instituição senha é obrigatório.',
        'string.base': 'Cadastro negado: preencha corretamente o campo instituição senha.',
        'string.min': 'Cadastro negado: a senha precisa ter no mínimo 4 caracteres.',
        'string.empty': 'Cadastro negado: o campo instituição senha está vazio.'
    })
})

module.exports = {
    schema_cadastrar,
    schema_consultaConta,
    schema_consultaCliente,
    schema_atualizar,
    schema_excluirConta,
    schema_excluir
}