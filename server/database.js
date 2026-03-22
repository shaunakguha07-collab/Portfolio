const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // Most managed Postgres providers require SSL
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('CRITICAL: Unexpected error on idle client:', err.message);
    console.error(err);
});

// Test the connection immediately
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DATABASE CONNECTION ERROR:', err.message);
        console.error('Full connection string error details:', err);
    } else {
        console.log('DATABASE CONNECTION SUCCESSFUL: Server time is', res.rows[0].now);
    }
});

// Initialize tables
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('PostgreSQL: Messages table is ready.');
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

initDB();

module.exports = {
    query: (text, params) => pool.query(text, params)
};
