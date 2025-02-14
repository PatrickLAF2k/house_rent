const pool = require("../config/database");
const { encrypt } = require("../config/encryption");

const tenantsRegister = async (req, res) => {
    // Obtém o ID do usuário logado a partir do token
    const owner_id = req.user.id;

    const { name, nationality, marital_status, date_of_birth, rg, issuing_authority, cpf, email, phone, address, address_number, neighborhood, municipality, state, zip_code } = req.body;


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

        // Inserção de novo inquilino
        const newTenant = await pool.query(
            "INSERT INTO tenants (owner_id, name, nationality, marital_status, date_of_birth, rg, issuing_authority, cpf, email, phone, address, address_number, neighborhood, municipality, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id, name, email",
            [owner_id, name, nationality, marital_status, date_of_birth, encryptedRg, issuing_authority, encryptedCpf, email, phone, address, address_number, neighborhood, municipality, state, zip_code]
        );

        return res.status(201).json({ mensagem: "Inquilino cadastrado com sucesso", inquilino: newTenant.rows[0] });

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error.message})` });
    }
};

module.exports = {
    tenantsRegister
};