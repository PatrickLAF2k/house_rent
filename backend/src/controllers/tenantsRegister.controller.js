const { encrypt } = require("../config/encryption");
const Register = require("../models/register.model");


const tenantsRegister = async (req, res) => {
    // Obtém o ID do usuário logado a partir do token
    const owner_id = req.user.id;
    const { name, nationality, marital_status, date_of_birth, rg, issuing_authority, cpf, email, phone, address, address_number, neighborhood, municipality, state, zip_code } = req.body;


    try {
        // Verificação de email existente
        const existingEmail = await Register.getByEmail(email, 'tenants');
        if (existingEmail) {
            return res.status(409).json({ mensagem: `Email já cadastrado` });
        }

        // Verificação de CPF existente
        const existingCpf = await Register.getByCpf(cpf, 'tenants');
        if (existingCpf) {
            return res.status(409).json({ mensagem: `CPF já cadastrado` });
        }

        // Verificação de RG existente
        const existingRg = await Register.getByRg(rg, 'tenants');
        if (existingRg) {
            return res.status(409).json({ mensagem: `RG já cadastrado` });
        }

        // Criptografar RG e CPF
        const encryptedRg = encrypt(rg);
        const encryptedCpf = encrypt(cpf);

        // Inserção de novo usuário
        const newUser = await Register.create({
            owner_id,
            name,
            nationality,
            marital_status,
            date_of_birth,
            rg: encryptedRg,
            issuing_authority,
            cpf: encryptedCpf,
            email,
            phone,
            address,
            address_number,
            neighborhood,
            municipality,
            state,
            zip_code
        }, 'tenants');

        return res.status(201).json({ mensagem: "Inquilino cadastrado com sucesso", inquilino: newUser });

    } catch (error) {

        return res.status(500).json({ mensagem: `Erro interno do servidor (${error.message})` });
    }
};

module.exports = {
    tenantsRegister
};