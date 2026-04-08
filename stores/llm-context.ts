import { rangeAt100Soc } from "@/lib/range-normalization";
import { computeBatteryHealthPercent } from "@/lib/battery-health";
import {
    computeMonthlyFuelComparison,
    DEFAULT_PETROL_MILEAGE_KM_PER_L,
    DEFAULT_PETROL_PRICE_PER_L,
} from "@/lib/monthly-fuel-savings";
import { useProfileStore } from "./profile-store";
import { useRangePredictionStore } from "./range-prediction-store";
import { useCo2SavingsStore } from "./co2-savings-store";

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

    const v = profile.vehicle;
    const monthlyFuelComparison = computeMonthlyFuelComparison({
        monthlyKm: v.averageMonthlyKm,
        batteryKwh: v.batteryCapacity,
        fullRangeKm: v.range,
        costPerKwh: v.costPerUnit,
    });

    const co2 = useCo2SavingsStore.getState();

    let batteryHealthEstimate: {
        healthPercent: number;
        note: string;
    } | null = null;
    const r100 = rangePrediction?.rangeAt100SocKm;
    if (rangePrediction && profile.vehicle.range > 0 && r100 != null && r100 > 0) {
        const pct = computeBatteryHealthPercent(profile.vehicle.range, r100);
        if (pct != null) {
            batteryHealthEstimate = {
                healthPercent: Math.round(pct),
                note: "From last Range Prediction (normalized to 100% SOC) vs Profile rated full range",
            };
        }
    }

    const payload = {
        profile,
        rangePrediction,
        batteryHealthEstimate,
        monthlyFuelComparison,
        monthlyFuelPetrolDefaults: {
            petrolKmPerL: DEFAULT_PETROL_MILEAGE_KM_PER_L,
            petrolPricePerL: DEFAULT_PETROL_PRICE_PER_L,
        },
        /** Last CO₂ Savings calculator run (yearly tons, trees, ICE type, km/mo). Null if never run. */
        co2Savings: co2.lastResult,
    };

    return `App store snapshot (JSON):
${JSON.stringify(payload, null, 2)}`;
}
