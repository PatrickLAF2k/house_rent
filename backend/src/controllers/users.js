const pool = require("../config/database")
const bcrypt = require('bcrypt');
const { encrypt } = require("../config/encryption")

const userRegister = async (req, res) => {
    const { name, cpf, email, phone, password } = req.body;

    try {
        if (!name || !cpf || !email || !phone || !password) {
            return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const encryptedCpf = encrypt(cpf);

        const newUser = await pool.query('INSERT INTO owners (name, cpf, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
            [name, encryptedCpf, email, phone, passwordHash]
        )

        return res.status(201).json(newUser.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error.message})` });

    }
}

module.exports = {
    userRegister
}