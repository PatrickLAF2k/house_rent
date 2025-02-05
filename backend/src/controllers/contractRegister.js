const pool = require("../config/database")

// Função para verificar campos obrigatórios
const checkRequiredFields = (fields) => {
    for (const field in fields) {
        if (!fields[field]) {
            return false;
        }
    }
    return true;
}

const contractRegister = async (req, res) => {
    const { tenant_id, proprety_id, start_date, rent_value, payment_day } = req.body;
    // Obtém o ID do usuário logado a partir do token
    const owner_id = req.user.id;

    // Verificação de campos obrigatórios
    // if (!checkRequiredFields({ tenant_id, proprety_id, start_date, rent_value, payment_day })) {
    //     return res.status(400).json({ mensagem: `Todos os campos são obrigatórios` });
    // }

    try {
        //pegar so o que precisa
        const ownerData = await pool.query("SELECT * FROM owners WHERE id = $1", [owner_id])
        console.log(ownerData.rows[0]);

        //pegar so o que precisa
        const tenantData = await pool.query("SELECT * FROM tenants WHERE id = 6")
        console.log(tenantData.rows[0]);

        return res.status(201).json("Foi");



    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno do servidor (${error})` });
    }
}

module.exports = {
    contractRegister
}

// // Verificação se o imovel ja existe
// const existingProperty = await pool.query("SELECT * FROM properties WHERE zip_code = $1 AND street = $2 AND number = $3", [zip_code, street, number]);
// if (existingProperty.rows.length > 0) {
//     return res.status(409).json({ mensagem: `Imóvel já cadastrado` });
// }

// // Inserção de novo imóvel
// const newProperty = await pool.query('INSERT INTO properties (zip_code, street, number, neighborhood, municipality, city, state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
//     [zip_code, street, number, neighborhood, municipality, city, state])

// return res.status(201).json(newProperty.rows[0]);
