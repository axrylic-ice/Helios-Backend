import { getLatestSignalService } from './signals.service.js'; // ← updated import
import resolveDecision from '../domain/decisionResolver.js';
import formatImpact from '../domain/impactFormatter.js';
import snapshotBuilder from './decisionSnapshotBuilder.js';
import alertsService from './alertsService.js';
import AppError from '../middleware/AppError.js'; // ← use AppError

const severityMap = { BUY: 'info', HOLD: 'low', WAIT: 'high' };

const messageMap = (decision, fx_pair, confidence) => ({
    BUY:  `Buy signal detected for ${fx_pair}. Confidence: ${confidence}`,
    HOLD: `Hold recommended for ${fx_pair}. Monitor market conditions.`,
    WAIT: `High risk detected for ${fx_pair}. Consider waiting before transacting.`,
}[decision]);

const analyzeDecision = async ({ user_id, fx_pair, amount, time_horizon_days }) => {
    // 1. Fetch latest signal using teammate's real service
    const signal = await getLatestSignalService(fx_pair); // ← throws AppError if not found

    // 2. Apply decision rules
    const decision = resolveDecision(signal);

    // 3. Shape the result
    const result = formatImpact(signal, decision);

    // 4. Save the decision snapshot
    const saved = await snapshotBuilder.saveDecision({
        user_id,
        fx_pair,
        amount,
        time_horizon_days,
        signal_snapshot_id: signal.id,
        result,
    });

    // 5. Auto-generate alert
    await alertsService.generateAlert({
        user_id,
        message: messageMap(decision, fx_pair, signal.confidence),
        severity: severityMap[decision],
    });

    return { decisionId: saved.id, ...result };
};

export default { analyzeDecision };