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

const propertiesRegister = async (req, res) => {
    const { zip_code, street, number, neighborhood, municipality, city, state } = req.body;

    // Verificação de campos obrigatórios
    if (!checkRequiredFields({ zip_code, street, number, neighborhood, municipality, city, state })) {
        return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
    }

    try {

        // Verificação se o imovel ja existe
        const existingProperty = await pool.query("SELECT * FROM properties WHERE zip_code = $1 AND street = $2 AND number = $3", [zip_code, street, number]);
        if (existingProperty.rows.length > 0) {
            return res.status(409).json({ mensagem: `Imóvel já cadastrado` });
        }

        // Inserção de novo imóvel
        const newProperty = await pool.query('INSERT INTO properties (zip_code, street, number, neighborhood, municipality, city, state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
            [zip_code, street, number, neighborhood, municipality, city, state])

        return res.status(201).json(newProperty.rows[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = {
    propertiesRegister
}
