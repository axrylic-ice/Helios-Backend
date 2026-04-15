import pool from "../config/db.js";
import AppError from "../middleware/AppError.js";

// get latest signal service
export const getLatestSignalService = async (fx_pair) => {
    // check that an FX pair was provided
    if (!fx_pair) {
        throw new AppError('Fx pair is required', 400);
    }

    // fetch the most recent signal for this FX pair
    const result = await pool.query(
        `SELECT id, fx_pair, risk_score, volatility_level, confidence, summary, generated_at
        FROM signals
        WHERE fx_pair = $1
        ORDER BY generated_at DESC
        LIMIT 1`,
        [fx_pair]
    );

    const signal = result.rows[0];
    // if no signal was found
    if (!signal) {
        throw new AppError(`No signal found for FX pair: ${fx_pair}`, 404);
    }

    return signal;
}