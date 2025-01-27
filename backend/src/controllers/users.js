const pool = require("../config/database")

const userRegister = async (req, res) => {
    const { name, cpf, email, phone, password } = req.body;

    try {

        const newUser = await pool.query('INSERT INTO owners (name, cpf, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
            [name, cpf, email, phone, password]
        )

        return res.status(201).json(newUser.rows[0])
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor ${error}` });

    }
}

module.exports = {
    userRegister
}