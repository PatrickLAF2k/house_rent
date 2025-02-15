const bcrypt = require('bcrypt');
const { encrypt } = require("../config/encryption");
const Register = require("../models/register.model");

const userRegister = async (req, res) => {
    const { name, nationality, marital_status, occupation, date_of_birth, rg, issuing_authority, cpf, email, phone, password } = req.body;

    try {
        // Verificação de email existente
        const existingEmail = await Register.getByEmail(email, 'owners');
        if (existingEmail) {
            return res.status(409).json({ mensagem: `Email já cadastrado` });
        }

        // Verificação de CPF existente
        const existingCpf = await Register.getByCpf(cpf, 'owners');
        if (existingCpf) {
            return res.status(409).json({ mensagem: `CPF já cadastrado` });
        }

        // Verificação de RG existente
        const existingRg = await Register.getByRg(rg, 'owners');
        if (existingRg) {
            return res.status(409).json({ mensagem: `RG já cadastrado` });
        }

        // Criptografar a senha
        const passwordHash = await bcrypt.hash(password, 10);
        const encryptedRg = encrypt(rg);
        const encryptedCpf = encrypt(cpf);

        // Inserção de novo usuário
        const newUser = await Register.create({
            name,
            nationality,
            marital_status,
            occupation,
            date_of_birth,
            rg: encryptedRg,
            issuing_authority,
            cpf: encryptedCpf,
            email,
            phone,
            password: passwordHash
        }, 'owners');

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso", usuario: newUser });

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error.message})` });
    }
}

module.exports = {
    userRegister
};