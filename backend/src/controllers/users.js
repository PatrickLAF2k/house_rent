const pool = require("../config/database")
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require("../config/encryption")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN

const userRegister = async (req, res) => {
    const { name, cpf, email, phone, password } = req.body;

    try {
        if (!name || !cpf || !email || !phone || !password) {
            return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
        }

        const existingEmail = await pool.query("SELECT * FROM owners WHERE email = $1", [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(409).json({ mensagem: `Email já cadastrado` });
        }

        const encryptedCpf = encrypt(cpf);
        const existingCpf = await pool.query("SELECT * FROM owners WHERE cpf = $1", [encryptedCpf]);
        if (existingCpf.rows.length > 0) {
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

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userVerify = await pool.query("SELECT * from owners where email = $1", [email])
        if (userVerify.rowCount < 1) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos" })
        }

        const passwordVerify = await bcrypt.compare(password, userVerify.rows[0].password)
        if (!passwordVerify) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos" })

        } else {
            const token = jwt.sign(
                { id: userVerify.rows[0].id, email: userVerify.rows[0].email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES }
            );
            return res.status(200).json({ mensagem: "Login efetuado com sucesso", token })
        }

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}


module.exports = {
    userRegister,
    login
}