const joi = require('joi');

const schema_cadastrar = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'Cadastro negado: o campo nome é obrigatório.',
        'string.empty': 'Cadastro negado: o campo nome está vazio.',
        'string.base': 'Cadastro negado: preencha corretamente o campo nome.',
    }),
    cpf: joi.string().required().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required().messages({
        'string.pattern.base': 'Cadastro negado: preencha o campo CPF no formato 000.000.000-00.',
        'string.empty': 'Cadastro negado: campo vazio, preencha o CPF  no formato 000.000.000-00.',
        'string.base': 'Cadastro negado: formato inválido, preencha o CPF no formato 000.000.000-00.',
        'any.required': 'Cadastro negado: o campo CPF é obrigatório.'
    }),
    email: joi.string().email().required().messages({
        'string.email': 'Cadastro negado: o email não é válido.',
        'string.base': 'Cadastro negado: o email não é válido.',
        'any.required': 'Cadastro negado: o campo email é obrigatório.'
    }),
    data_nascimento: joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required().messages({
        'string.pattern.base': 'Cadastro negado: preencha o campo data no formato dia/mês/ano - 00/00/0000.',
        'string.empty': 'Cadastro negado: preencha o campo data no formato dia/mês/ano - 00/00/0000.',
        'string.base': 'Cadastro negado: preencha o campo data no formato dia/mês/ano - 00/00/0000.',
    }),
    senha: joi.string().min(4).required().messages({
        'any.required': 'Cadastro negado: o campo senha é obrigatório.',
        'string.base': 'Cadastro negado: preencha corretamente o campo senha.',
        'string.min': 'Cadastro negado: a senha precisa ter no mínimo 4 caracteres.',
        'string.empty': 'Cadastro negado: o campo senha está vazio.',
    })
})

const schema_extrato = joi.object({
    extrato: joi.string().required().messages({
        'string.empty': 'Extrato negado: o campo extrato está vazio.',
        'any.required': 'Extrato negado: o campo extrato deve ser preenchido.',
        'string.base': 'Extrato negado: preencha corretamente o campo extrato.'
    })
})

const schema_atualizar = joi.object({
    nome: joi.string().messages({
        'string.empty': 'Atualização negada: o campo nome está vazio.',
        'string.base': 'Atualização negada: preencha corretamente o campo nome.',
    }),
    cpf: joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).messages({
        'string.pattern.base': 'Atualização negada: preencha o campo CPF no formato 000.000.000-00.',
        'string.empty': 'Atualização negada: campo vazio, preencha o CPF  no formato 000.000.000-00.',
        'string.base': 'Atualização negada: formato inválido, preencha o CPF no formato 000.000.000-00.'
    }),
    email: joi.string().email().messages({
        'string.email': 'Atualização negada: o email não é válido.',
        'string.base': 'Atualização negada: o email não é válido.'
    }),
    data_nascimento: joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).messages({
        'string.pattern.base': 'Atualização negada: preencha o campo data no formato dia/mês/ano - (00/00/0000).',
        'string.empty': 'Atualização negada: preencha o campo data no formato dia/mês/ano - (00/00/0000).',
        'string.base': 'Atualização negada: preencha o campo data no formato dia/mês/ano - (00/00/0000).',
    }),
    senha: joi.string().min(4).messages({
        'string.base': 'Atualização negada: preencha corretamente o campo senha.',
        'string.min': 'Atualização negada: a senha precisa ter no mínimo 4 caracteres.',
        'string.empty': 'Atualização negada: o campo senha está vazio.',
    })
})

const schema_excluir = joi.object({
    cpf: joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).required().messages({
        'string.pattern.base': 'Exclusão negada: preencha o campo CPF no formato 000.000.000-00.',
        'string.empty': 'Exclusão negada: campo vazio, preencha o CPF  no formato 000.000.000-00.',
        'string.base': 'Exclusão negada: formato inválido, preencha o CPF no formato 000.000.000-00.',
        'any.required': 'Exclusão negada: o campo CPF é obrigatório.'
    }),
    senha: joi.string().required().messages({
        'string.base': 'Exclusão negada: preencha corretamente o campo senha.',
        'string.empty': 'Exclusão negada: o campo senha está vazio.',
        'any.required': 'Exclusão negada: o campo senha é obrigatório.'
    })
})

module.exports = {
    schema_cadastrar,
    schema_extrato,
    schema_atualizar,
    schema_excluir
}