const { Pool } = require('');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // Most managed Postgres providers require SSL
        rejectUnauthorized: false
    }
});

// Only attempt connection if URL exists
if (!process.env.DATABASE_URL) {
    console.error('CRITICAL: DATABASE_URL environment variable is missing!');
}

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err.message);
});

// Initialize tables
const initDB = async () => {
    if (!process.env.DATABASE_URL) return;
    try {
        // Test connection
        const res = await pool.query('SELECT NOW()');
        console.log('DATABASE CONNECTION SUCCESSFUL: Server time is', res.rows[0].now);

        // Create table
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
        console.error('DATABASE INITIALIZATION ERROR:', err.message);
        console.error('Check your DATABASE_URL and Supabase password.');
    }
};

initDB();

module.exports = {
    query: (text, params) => pool.query(text, params)
};
