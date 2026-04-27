INSERT INTO signals (fx_pair, risk_score, volatility_level, confidence, summary, raw_data)
VALUES (
  'NGN/USD',
  0.73,
  'HIGH',
  0.81,
  'High volatility pressure detected',
  '{
    "confidence": 0.81,
    "decision": "WAIT",
    "engine_health": "GOOD",
    "estimated_devaluation": 2.3,
    "volatility_level": "HIGH",
    "liquidity_level": "LOW",
    "usd_flow": "OUTFLOW",
    "lstm_sequence": [0.72, 0.74, 0.73, 0.75, 0.73],
    "polymarket_sentiment": 0.62,
    "x": {
      "parallel": 1620.0,
      "official": 1580.0,
      "spread": 40.0
    },
    "news": [
      {
        "headline": "CBN tightens FX controls",
        "summary": "Central bank announces new restrictions on dollar purchases",
        "source": "BusinessDay",
        "url": "https://businessday.ng",
        "impact": "HIGH"
      },
      {
        "headline": "Oil prices drop 3%",
        "summary": "Brent crude falls amid global demand concerns affecting Nigeria export revenue",
        "source": "Reuters",
        "url": "https://reuters.com",
        "impact": "HIGH"
      },
      {
        "headline": "Remittance inflows steady",
        "summary": "Diaspora remittances remain stable providing some FX support",
        "source": "Nairametrics",
        "url": "https://nairametrics.com",
        "impact": "MEDIUM"
      }
    ],
    "fx_other_pairs": {
      "EURNGN": 1720.0,
      "GBPNGN": 2040.0,
      "AUDNGN": 1050.0
    }
  }'
);