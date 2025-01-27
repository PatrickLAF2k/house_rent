const pool = require("../config/database")
const bcrypt = require('bcrypt');

const userRegister = async (req, res) => {
    const { name, cpf, email, phone, password } = req.body;

    try {
        if (!name || !cpf || !email || !phone || !password) {
            return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await pool.query('INSERT INTO owners (name, cpfHash, email, phone, passwordHash) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
            [name, cpf, email, phone, passwordHash]
        )


        return res.status(201).json(newUser.rows[0])
    } catch (error) {
        console.log(error.message);
        console.log(name, cpf, email, phone, password);


        return res.status(500).json({ mensagem: `Erro interno do servidor` });

    }
}

module.exports = {
    userRegister
}