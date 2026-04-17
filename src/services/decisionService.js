// Coordinates everything: signal → resolve → format → save → alert

import signalsService from './signalsService.js';
import resolveDecision from '../domain/decisionResolver.js';
import formatImpact from '../domain/impactFormatter.js';
import snapshotBuilder from './decisionSnapshotBuilder.js';
import alertsService from './alertsService.js';

const severityMap = { BUY: 'info', HOLD: 'low', WAIT: 'high' };

const messageMap = (decision, fx_pair, confidence) => ({
    BUY:  `Buy signal detected for ${fx_pair}. Confidence: ${confidence}`,
    HOLD: `Hold recommended for ${fx_pair}. Monitor market conditions.`,
    WAIT: `High risk detected for ${fx_pair}. Consider waiting before transacting.`,
}[decision]);

const analyzeDecision = async ({ user_id, fx_pair, amount, time_horizon_days }) => {
    // 1. Fetch latest signal for the given FX pair
    const signal = await signalsService.getLatestSignal(fx_pair);
    if (!signal) throw new Error(`No signal found for fx_pair: ${fx_pair}`);

    // 2. Apply decision rules
    const decision = resolveDecision(signal);

    // 3. Shape the result
    const result = formatImpact(signal, decision);

    // 4. Persist the decision snapshot
    const saved = await snapshotBuilder.saveDecision({
        user_id,
        fx_pair,
        amount,
        time_horizon_days,
        signal_snapshot_id: signal.id,
        result,
    });

    // 5. Auto-generate an alert for this user
    await alertsService.generateAlert({
        user_id,
        message: messageMap(decision, fx_pair, signal.confidence),
        severity: severityMap[decision],
    });

    return { decisionId: saved.id, ...result };
};

export default { analyzeDecision };