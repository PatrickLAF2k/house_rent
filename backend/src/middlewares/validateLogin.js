const loginSchema = require('../schemas/loginSchema');

const validateLogin = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ mensagem: error.details[0].message });
    }
    next();
}

module.exports = validateLogin;