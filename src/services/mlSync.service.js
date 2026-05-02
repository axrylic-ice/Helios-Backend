// This service calls the ML model every hour
// and saves the result into the signals table
import axios from 'axios';
import pool from '../config/db.js';

const ML_ENGINE_URL = 'https://helios-ml-engine-183763913483.europe-west1.run.app/fx/decision';

export const syncMLSignal = async () => {
  try {
    console.log('Fetching signal from ML engine...');

    // Call the ML model
    const response = await axios.get(ML_ENGINE_URL);
    const data = response.data;

    console.log('ML engine response:', JSON.stringify(data, null, 2));

    // Extract the core fields from the response
    const fx_pair = 'NGN/USD';
    const risk_score = 1 - data.confidence;
    const volatility_level = data.volatility_level || 'MEDIUM';
    const confidence = data.confidence;
    const summary = `${data.decision} signal detected. Volatility: ${data.volatility_level}, USD Flow: ${data.usd_flow}`;

    // Save the full response as raw_data
    const result = await pool.query(
      `INSERT INTO signals (fx_pair, risk_score, volatility_level, confidence, summary, raw_data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [fx_pair, risk_score, volatility_level, confidence, summary, JSON.stringify(data)]
    );

    console.log('Signal saved with id:', result.rows[0].id);
    return result.rows[0];

  } catch (err) {
    console.error('ML sync failed:', err.message);
  }
};