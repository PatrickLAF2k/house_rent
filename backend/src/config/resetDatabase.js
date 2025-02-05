const pool = require('./database');

const resetDatabase = async () => {
    await pool.query('TRUNCATE TABLE owners CASCADE');
    await pool.query('TRUNCATE TABLE tenants CASCADE');
    await pool.query('TRUNCATE TABLE properties CASCADE');
    await pool.query('TRUNCATE TABLE contract CASCADE');
};

module.exports = resetDatabase;