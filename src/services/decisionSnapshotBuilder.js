// Saves the full decision record to the database

import pool from '../config/db.js';

const saveDecision = async ({ user_id, fx_pair, amount, time_horizon_days, signal_snapshot_id, result }) => {
    const { rows } = await pool.query(
        `INSERT INTO decisions (user_id, fx_pair, amount, time_horizon_days, signal_snapshot_id, result)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, fx_pair, amount, time_horizon_days, signal_snapshot_id, JSON.stringify(result)]
    );
    return rows[0];
};

export default { saveDecision };