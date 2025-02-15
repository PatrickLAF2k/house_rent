const pool = require("../config/database")
const bcrypt = require('bcrypt');
const { encrypt } = require("../config/encryption")

class Register {
    static async getByEmail(email, table) {
        const query = `SELECT * FROM ${table} WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    };

    static async getByCpf(cpf, table) {
        const encryptedCpf = encrypt(cpf);
        const query = `SELECT * FROM ${table} WHERE cpf = $1`;
        const result = await pool.query(query, [encryptedCpf]);
        return result.rows[0];
    };

    static async getByRg(rg, table) {
        const encryptedRg = encrypt(rg);
        const query = `SELECT * FROM ${table} WHERE rg = $1`;
        const result = await pool.query(query, [encryptedRg]);
        return result.rows[0];
    };

    static async create(data, table) {
        const columns = Object.keys(data);
        const values = Object.values(data);

        const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(',')}) RETURNING id, name, email`;
        const result = await pool.query(query, values);
        return result.rows[0];

    }


};

module.exports = Register;