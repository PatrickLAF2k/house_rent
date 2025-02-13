const pool = require("../config/database")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN

const userlogin = async (req, res) => {
    const { email, password } = req.body;

    // Verificação de email existente
    try {
        const userVerify = await pool.query("SELECT * from owners where email = $1", [email])
        if (userVerify.rowCount < 1) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos" })
        }

        //Verificação de senha e gera o token de autenticação
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
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error.message})` });
    }
}
module.exports = {
    userlogin
}