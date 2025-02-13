const joi = require('joi');

const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.empty': `Email não pode estar vazio`,
        'string.email': `Email inválido`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    password: joi.string().min(6).required().messages({
        'string.empty': `Senha não pode estar vazia`,
        'string.min': `Senha deve ter no mínimo {#limit} caracteres`,
        'any.required': `Todos os campos são obrigatórios`
    })
})

module.exports = loginSchema;