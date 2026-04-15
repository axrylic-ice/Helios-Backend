// import the database connection pool
import pool from "../config/db.js";

// this function created all the table in the database
const migrate = async () => {
    try {
        // create users table
        // stores all registered users
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            company_name TEXT,
            country TEXT,
            created_at TIMESTAMP DEFAULT NOW()
                );
            `);

        // create fx_rates table
        // Read only. Data pipeline writes here, backend only reads it
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fx_rates (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                currency_pair TEXT NOT NULL,
                rate DECIMAL NOT NULL,
                timestamp TIMESTAMP DEFAULT NOW()
            )
        `)

        // create signals table
        // Read only. Data pipeline writes here, backend only reads it
        await pool.query(`
            CREATE TABLE IF NOT EXISTS signals (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                fx_pair TEXT NOT NULL,
                risk_score FLOAT NOT NULL,
                volatility_level TEXT NOT NULL,
                confidence FLOAT NOT NULL,
                summary TEXT,
                generated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Create decisions table
        // Stores every decision request made by a user
        await pool.query(`
            CREATE TABLE IF NOT EXISTS decisions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                fx_pair TEXT NOT NULL,
                amount DECIMAL NOT NULL,
                time_horizon_days INT NOT NULL,
                signal_snapshot_id UUID REFERENCES signals(id),
                result JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // Create alerts table
        // Stores notifications sent to users
        // is_read tracks whether the user has seen the alert
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alerts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                severity TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('All tables created successfully');
        process.exit(0);
    } catch (err) {
        console.log('Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();