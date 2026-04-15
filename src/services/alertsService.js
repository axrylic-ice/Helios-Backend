// Handles creating, reading, and marking alerts

import pool from '../config/db.js';

// Auto-called internally when a decision is made
const generateAlert = async ({ user_id, message, severity }) => {
    const { rows } = await pool.query(
        `INSERT INTO alerts (user_id, message, severity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, message, severity]
    );
    return rows[0];
};

const getAlerts = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC`,
        [user_id]
    );
    return rows;
};

const markAsRead = async (alert_id, user_id) => {
    const { rows } = await pool.query(
        `UPDATE alerts SET is_read = TRUE
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [alert_id, user_id]
    );
    return rows[0] || null;
};

export default { generateAlert, getAlerts, markAsRead };