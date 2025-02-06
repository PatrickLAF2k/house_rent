const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    nationality: Joi.string().min(3).max(100).required(),
    marital_status: Joi.string().min(3).max(50).required(),
    occupation: Joi.string().min(3).max(255).required(),
    date_of_birth: Joi.date().iso().required(),
    rg: Joi.string().min(7).max(12).required().messages({
        'string.empty': `RG não pode ser vazio`,
        'string.min': `RG deve ter no mínimo {#limit} caracteres`,
        'string.max': `RG deve ter no máximo {#limit} caracteres`
    }),
    issuing_authority: Joi.string().min(2).max(50).required(),
    cpf: Joi.string().length(11).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    password: Joi.string().min(6).required()
});

module.exports = userSchema;