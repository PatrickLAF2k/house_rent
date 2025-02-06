const pool = require("../config/database")
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require("../config/encryption")

// Função para verificar campos obrigatórios
const checkRequiredFields = (fields) => {
    for (const field in fields) {
        if (!fields[field]) {
            return false;
        }
    }
    return true;
}

const userRegister = async (req, res) => {
    const { name, nationality, marital_status, occupation, date_of_birth, rg, issuing_authority, cpf, email, phone, password } = req.body;

    try {
        // Verificação de campos obrigatórios
        if (!checkRequiredFields({ name, nationality, marital_status, occupation, date_of_birth, rg, issuing_authority, cpf, email, phone, password })) {
            return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
        }

        // Verificação de email existente
        const existingEmail = await pool.query("SELECT * FROM owners WHERE email = $1", [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(409).json({ mensagem: `Email já cadastrado` });
        }

        // Verificação de CPF existente
        const encryptedCpf = encrypt(cpf);
        const existingCpf = await pool.query("SELECT * FROM owners WHERE cpf = $1", [encryptedCpf]);
        if (existingCpf.rows.length > 0) {
            return res.status(409).json({ mensagem: `CPF já cadastrado` });
        }

        // Inserção de novo usuário
        const encryptedRg = encrypt(rg);
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await pool.query('INSERT INTO owners (name, nationality, marital_status, occupation, date_of_birth, rg, issuing_authority, cpf, email, phone, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id,name, email  ',
            [name, nationality, marital_status, occupation, date_of_birth, encryptedRg, issuing_authority, encryptedCpf, email, phone, passwordHash])

        return res.status(201).json(newUser.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = {
    userRegister
}