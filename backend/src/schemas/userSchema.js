const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(10).max(255).required().messages({
        'string.empty': `O nome só pode conter letras`,
        'string.min': `Por favor, insira o nome completo`,
        'string.max': `Nome deve ter no máximo {#limit} caracteres`,
        'any.required': `Nome obrigatório`
    }),
    nationality: Joi.string().min(3).max(100).required().messages({
        'string.empty': `Nacionalidade só pode conter letras`,
        'string.min': `Por favor, insira a nacionalidade`,
        'string.max': `Nacionalidade deve ter no máximo {#limit} caracteres`,
        'any.required': `Nacionalidade obrigatória`
    }),
    marital_status: Joi.string().min(3).max(50).required().messages({
        'string.empty': `Estado civil só pode conter letras`,
        'string.min': `Por favor, insira o estado civil`,
        'string.max': `Estado civil deve ter no máximo {#limit} caracteres`,
        'any.required': `Estado civil obrigatório`
    }),
    occupation: Joi.string().min(3).max(255).required().messages({
        'string.empty': `Ocupação só pode conter letras`,
        'string.min': `Por favor, insira a ocupação`,
        'string.max': `Ocupação deve ter no máximo {#limit} caracteres`,
        'any.required': `Ocupação obrigatória`
    }),
    date_of_birth: Joi.date().iso().required().messages({
        'date.base': `Data de nascimento inválida`,
        'date.format': `Data de nascimento inválida`,
        'any.required': `Data de nascimento obrigatória`,
        'date.format': `Data de nascimento deve seguir o padrão ISO`
    }),
    rg: Joi.string().min(7).max(12).required().messages({
        'string.empty': `RG não pode estar vazio`,
        'string.min': `RG deve ter no mínimo {#limit} caracteres`,
        'string.max': `RG deve ter no máximo {#limit} caracteres`,
        'any.required': `RG obrigatório`
    }),
    issuing_authority: Joi.string().min(2).max(50).required().messages({
        'string.empty': `Órgão emissor não pode estar vazio`,
        'string.min': `Órgão emissor deve ter no mínimo {#limit} caracteres`,
        'string.max': `Órgão emissor deve ter no máximo {#limit} caracteres`,
        'any.required': `Órgão emissor obrigatório`
    }),
    cpf: Joi.string().length(11).required().messages({
        'string.empty': `CPF não pode estar vazio`,
        'string.length': `CPF deve ter exatamente {#limit} caracteres`,
        'any.required': `CPF obrigatório`
    }),
    email: Joi.string().email().required().messages({
        'string.empty': `Email não pode estar vazio`,
        'string.email': `Email deve ser um email válido`,
        'any.required': `Email obrigatório`
    }),
    phone: Joi.string().min(10).max(20).required().messages({
        'string.empty': `Telefone não pode estar vazio`,
        'string.min': `Telefone deve ter no mínimo {#limit} caracteres`,
        'string.max': `Telefone deve ter no máximo {#limit} caracteres`,
        'any.required': `Telefone obrigatório`
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': `Senha não pode estar vazia`,
        'string.min': `Senha deve ter no mínimo {#limit} caracteres`,
        'any.required': `Senha obrigatória`
    })
});

module.exports = userSchema;