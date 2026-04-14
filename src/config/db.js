import pg from 'pg';

import dotenv from 'dotenv';

dotenv.config();

// create a connection pool
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test the connection when the server starts
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Database connected successfully');
    }
});

export default pool;