const pool = require("../config/database")
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require("../config/encryption")

const userRegister = async (req, res) => {
    const { name, cpf, email, phone, password } = req.body;

    try {
        if (!name || !cpf || !email || !phone || !password) {
            return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
        }

        const existingEmail = await pool.query("SELECT * FROM owners WHERE email = $1", [email]);
        if (existingEmail.rows.length > 0){
            return res.status(409).json({ mensagem: `Email já cadastrado` });
        }
        
        const encryptedCpf = encrypt(cpf);
        const existingCpf = await pool.query("SELECT * FROM owners WHERE cpf = $1", [encryptedCpf]);
        if (existingCpf.rows.length > 0){
            return res.status(409).json({ mensagem: `CPF já cadastrado` });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await pool.query('INSERT INTO owners (name, cpf, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
            [name, encryptedCpf, email, phone, passwordHash])

        return res.status(201).json(newUser.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = {
    userRegister
}