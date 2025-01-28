const jwt = require('jsonwebtoken');
const pool = require("../config/database")
const JWT_SECRET = process.env.JWT_SECRET;

const tokenVerify = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const result = await pool.query('SELECT * FROM owners WHERE id = $1', [id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ mensagem: "Não autorizado" });
        }
        req.user = user;

        next()

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = tokenVerify;