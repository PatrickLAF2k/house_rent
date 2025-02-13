const userSchema = require('../schemas/userSchema');

const validateUser = async (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ mensagem: error.details[0].message });
    }
    next();
}

module.exports = validateUser;