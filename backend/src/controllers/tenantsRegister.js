const pool = require("../config/database")
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

const tenantsRegister = async (req, res) => {
    const { name, cpf, email, phone, date_of_birth, rg, address, address_number, neighborhood, municipality, state, zip_code } = req.body;

    // Verificação de campos obrigatórios
    if (!checkRequiredFields({ name, cpf, email, phone, date_of_birth, rg, address, address_number, neighborhood, municipality, state, zip_code })) {
        return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
    }

    try {
        // Verificação de email existente
        const existingEmail = await pool.query("SELECT * FROM tenants WHERE email = $1", [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(409).json({ mensagem: `Email já cadastrado` });
        }

        // Verificação de CPF existente
        const encryptedCpf = encrypt(cpf);
        const existingCpf = await pool.query("SELECT * FROM tenants WHERE cpf = $1", [encryptedCpf]);
        if (existingCpf.rows.length > 0) {
            return res.status(409).json({ mensagem: `CPF já cadastrado` });
        }

        // Verificação de RG existente
        const encryptedRg = encrypt(rg);
        const existingRg = await pool.query("SELECT * FROM tenants WHERE rg = $1", [encryptedRg]);
        if (existingRg.rows.length > 0) {
            return res.status(409).json({ mensagem: `RG já cadastrado` });
        }

        // Inserção de novo usuário
        const newUser = await pool.query('INSERT INTO tenants (name, cpf, email, phone, date_of_birth, rg, address, address_number, neighborhood, municipality, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING * ',
            [name, encryptedCpf, email, phone, date_of_birth, encryptedRg, address, address_number, neighborhood, municipality, state, zip_code])

        return res.status(201).json(newUser.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = {
    tenantsRegister
}
