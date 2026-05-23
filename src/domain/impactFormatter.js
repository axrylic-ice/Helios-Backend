// Shapes the raw signal and decision into the clean response the user sees

const formatImpact = (signal, decision) => {
  const raw = signal.raw_data || {};

  // Normalize news impact values to uppercase
  // Her model returns lowercase 'neutral', we need consistent casing
  const normalizeImpact = (impact) => {
    if (!impact || typeof impact !== 'string') return 'LOW';
    const upper = impact.toUpperCase();
    if (upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') return upper;
    // Map neutral to LOW since it is not a strong signal
    return 'LOW';
  };
  // Normalize news items to handle description vs summary
  const normalizeNews = (newsArray) => {
    if (!newsArray || newsArray.length === 0) return [];
    return newsArray.map((item) => ({
      headline: item.headline || null,
      summary: item.summary || item.description || null,
      source: item.source || null,
      url: item.url || null,
      impact: normalizeImpact(item.impact),
    }));
  };

  return {
    decision,
    confidence: raw.confidence || signal.confidence,
    engine_health: raw.engine_health || 'UNKNOWN',
    fx_pair: signal.fx_pair,
    summary: signal.summary,
    market_state: {
      estimated_devaluation: raw.estimated_devaluation || null,
      volatility_level: raw.volatility_level || signal.volatility_level,
      liquidity_level: raw.liquidity_level || null,
      usd_flow: raw.usd_flow || null,
    },
    model_outputs: {
      polymarket_sentiment: raw.polymarket_sentiment || null,
    },
    signal_sources: {
      parallel: raw.x?.parallel || null,
      official: raw.x?.official || null,
      spread: raw.x?.spread || null,
    },
    news: normalizeNews(raw.news),
    fx_other_pairs: raw.fx_other_pairs || {},
  };
};

export default formatImpact;