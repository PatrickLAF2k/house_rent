const tenantsRegisterSchema = require('../schemas/tenantsRegisterSchema.js');

const validateTenants = async (req, res, next) => {
    const { error } = tenantsRegisterSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ mensagem: error.details[0].message });
    }
    next();
}

module.exports = validateTenants;