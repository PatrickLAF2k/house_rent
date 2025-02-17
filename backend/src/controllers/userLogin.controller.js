const Register = require("../models/register.model.js");
const AutheService = require("../config/authServices.js");
const bcrypt = require('bcrypt');


const userlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificação de email existente
        const user = await Register.getByEmail(email, 'owners');
        if (!user) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos" });
        }

        //Verificação de senha
        const passwordVerify = await bcrypt.compare(password, user.password);
        if (!passwordVerify) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos" });
        }

        //geração do token
        const token = AutheService.generateToken(user);

        return res.status(200).json({ mensagem: "Login efetuado com sucesso", token });

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error.message})` });
    }
};

module.exports = {
    userlogin
}