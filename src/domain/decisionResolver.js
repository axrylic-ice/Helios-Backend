// Applies the business rules to a signal and returns a decision string

const resolveDecision = (signal) => {
    const { risk_score, confidence } = signal;

    if (risk_score > 0.7) return 'WAIT';
    if (risk_score < 0.3 && confidence > 0.7) return 'BUY';
    return 'HOLD';
};

export default resolveDecision;