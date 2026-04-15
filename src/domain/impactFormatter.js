// Shapes the raw signal + decision into the clean response the user sees

const formatImpact = (signal, decision) => {
    return {
        decision,
        risk_score: signal.risk_score,
        confidence: signal.confidence,
        fx_pair: signal.fx_pair,
        summary: signal.summary,
    };
};

export default formatImpact;