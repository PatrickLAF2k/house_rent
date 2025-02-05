const jwt = require('jsonwebtoken');
const pool = require("../config/database");

// Obtém a chave secreta do JWT a partir das variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;


const authenticateToken = async (req, res, next) => {
    // Obtém o cabeçalho de autorização da requisição
    const { authorization } = req.headers;

    // Verifica se o cabeçalho de autorização está presente
    if (!authorization) {
        return res.status(401).json({ mensagem: "Acesso negado. Token não fornecido." });
    }

    // Extrai o token do cabeçalho de autorização
    const token = authorization.split(' ')[1];

    try {
        // Verifica e decodifica o token JWT
        const { id } = jwt.verify(token, JWT_SECRET);

        // Consulta o banco de dados para verificar se o usuário existe
        const result = await pool.query('SELECT * FROM owners WHERE id = $1', [id]);
        const user = result.rows[0];

        // Verifica se o usuário foi encontrado
        if (!user) {
            return res.status(403).json({ mensagem: "Token inválido." });
        }

        // Adiciona o usuário ao objeto de requisição para uso posterior
        req.user = user;

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = authenticateToken;