const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).min(10).max(255).required().messages({
        'string.empty': `Nome não pode estar vazio`,
        'string.min': `Por favor, insira o nome completo`,
        'string.max': `Nome deve ter no máximo {#limit} caracteres`,
        'string.pattern.base': `Nome não pode conter caracteres especiais ou números`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    nationality: Joi.string().pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).min(3).max(100).required().messages({
        'string.empty': `Nacionalidade não pode estar vazia`,
        'string.min': `Por favor, insira a nacionalidade completa`,
        'string.max': `Nacionalidade deve ter no máximo {#limit} caracteres`,
        'string.pattern.base': `Nacionalidade não pode conter números ou caracteres especiais`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    marital_status: Joi.string().pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).min(3).max(50).required().messages({
        'string.empty': `Estado civil não pode estar vazio`,
        'string.min': `Por favor, insira o estado civil completo`,
        'string.max': `Estado civil deve ter no máximo {#limit} caracteres`,
        'string.pattern.base': `Estado civil não pode conter números ou caracteres especiais`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    occupation: Joi.string().pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).min(3).max(255).required().messages({
        'string.empty': `Ocupação não pode estar vazia`,
        'string.min': `Por favor, insira a ocupação completa`,
        'string.max': `Ocupação deve ter no máximo {#limit} caracteres`,
        'string.pattern.base': `Ocupação não pode conter números ou caracteres especiais`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    date_of_birth: Joi.string().trim().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required().messages({
        'string.empty': `Data de nascimento não pode estar vazia`,
        'string.pattern.base': `A data de nascimento deve estar no formato (DD/MM/AAAA)`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    rg: Joi.string().min(7).max(12).pattern(/^\d+$/).required().messages({
        'string.empty': `RG não pode estar vazio`,
        'string.min': `RG deve ter no mínimo {#limit} caracteres`,
        'string.max': `RG deve ter no máximo {#limit} caracteres`,
        'string.pattern.base': `RG deve conter apenas números`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    issuing_authority: Joi.string().min(2).max(50).pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).required().messages({
        'string.empty': `Órgão emissor não pode estar vazio`,
        'string.min': `Órgão emissor deve ter no mínimo {#limit} caracteres`,
        'string.max': `Órgão emissor deve ter no máximo {#limit} caracteres`,
        'string.pattern.base': `Órgão emissor não pode conter números ou caracteres especiais`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    cpf: Joi.string().length(11).pattern(/^\d+$/).required().messages({
        'string.empty': `CPF não pode estar vazio`,
        'string.length': `CPF deve ter exatamente {#limit} caracteres`,
        'string.pattern.base': `CPF deve conter apenas números`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    email: Joi.string().email().required().messages({
        'string.empty': `Email não pode estar vazio`,
        'string.email': `Por favor, insira um email válido`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    phone: Joi.string().min(10).max(20).required().messages({
        'string.empty': `Telefone não pode estar vazio`,
        'string.min': `Telefone deve ter no mínimo {#limit} caracteres`,
        'string.max': `Telefone deve ter no máximo {#limit} caracteres`,
        'any.required': `Todos os campos são obrigatórios`
    }),

    password: Joi.string().min(6).required().messages({
        'string.empty': `Senha não pode estar vazia`,
        'string.min': `Senha deve ter no mínimo {#limit} caracteres`,
        'any.required': `Todos os campos são obrigatórios`
    }),

});

module.exports = userSchema;