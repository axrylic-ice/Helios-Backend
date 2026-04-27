// Applies the business rules to a signal and returns a decision string
// Decision comes directly from the model output if available

const resolveDecision = (signal) => {
  // If the model already made a decision, trust it
  if (signal.raw_data?.decision) {
    return signal.raw_data.decision;
  }

  // Fallback to rule based logic
  const { risk_score, confidence } = signal;
  if (risk_score > 0.7) return 'WAIT';
  if (risk_score < 0.3 && confidence > 0.7) return 'ACT';
  return 'HOLD';
};

export default resolveDecision;