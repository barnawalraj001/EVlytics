import { useProfileStore } from "./profile-store";
import { useRangePredictionStore } from "./range-prediction-store";

/**
 * Snapshot of all client stores meant for the EV assistant system prompt.
 * Safe to call from the browser when stores are hydrated.
 */
export function buildStoresContextForLlm(): string {
    const profile = useProfileStore.getState().profile;
    const rp = useRangePredictionStore.getState();

    const rangePrediction =
        rp.predictedRangeKm != null && rp.lastInputs != null
            ? {
                  predictedRangeKm: rp.predictedRangeKm,
                  lastInputs: rp.lastInputs,
                  predictedAt: rp.predictedAt,
              }
            : null;

    const payload = {
        profile,
        rangePrediction,
    };

    return `App store snapshot (JSON):
${JSON.stringify(payload, null, 2)}`;
}
