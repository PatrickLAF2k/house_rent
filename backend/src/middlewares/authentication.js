const jwt = require('jsonwebtoken');
const pool = require("../config/database")
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: "Acesso negado. Token não fornecido." });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const result = await pool.query('SELECT * FROM owners WHERE id = $1', [id]);
        const user = result.rows[0];
        console.log(user);
        

        if (!user) {
            return res.status(403).json({ mensagem: "Token inválido." });
        }
        req.user = user;

        next()

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = authenticateToken;