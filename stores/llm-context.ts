import { rangeAt100Soc } from "@/lib/range-normalization";
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
                  /** Remaining km at current SOC (model output). */
                  predictedRangeKm: rp.predictedRangeKm,
                  /** Estimated full range at 100% SOC under same conditions. */
                  rangeAt100SocKm: rangeAt100Soc(
                      rp.predictedRangeKm,
                      rp.lastInputs.soc
                  ),
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
