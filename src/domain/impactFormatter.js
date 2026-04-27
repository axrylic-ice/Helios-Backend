// Shapes the raw signal and decision into the clean response the user sees

const formatImpact = (signal, decision) => {
  const raw = signal.raw_data || {};

  return {
    decision,
    confidence: raw.confidence || signal.confidence,
    engine_health: raw.engine_health || null,
    fx_pair: signal.fx_pair,
    summary: signal.summary,
    market_state: {
      estimated_devaluation: raw.estimated_devaluation || null,
      volatility_level: raw.volatility_level || signal.volatility_level,
      liquidity_level: raw.liquidity_level || null,
      usd_flow: raw.usd_flow || null,
    },
    model_outputs: {
      lstm_sequence: raw.lstm_sequence || [],
      polymarket_sentiment: raw.polymarket_sentiment || null,
    },
    signal_sources: {
      parallel: raw.x?.parallel || null,
      official: raw.x?.official || null,
      spread: raw.x?.spread || null,
    },
    news: raw.news || [],
    fx_other_pairs: raw.fx_other_pairs || {},
  };
};

export default formatImpact;