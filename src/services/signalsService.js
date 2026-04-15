// PLACEHOLDER — teammate will replace this with the real implementation

import pool from '../config/db.js';

const getLatestSignal = async (fx_pair) => {
    const { rows } = await pool.query(
        `SELECT * FROM signals WHERE fx_pair = $1 ORDER BY generated_at DESC LIMIT 1`,
        [fx_pair]
    );
    return rows[0] || null;
};

export default { getLatestSignal };