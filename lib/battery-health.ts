/**
 * Battery health & efficiency use **normalized** range at 100% SOC:
 *   range_at_100_soc = predicted_remaining / (soc / 100)
 *
 * Health  = range_at_100_soc / original_range (Profile)
 * Efficiency index = range_at_100_soc / ideal_range (Profile — same field as rated full range)
 *
 * Effective capacity ≈ rated kWh × (health / 100)
 */

import { percentVsRated } from "./range-normalization";

export type BatteryHealthTier =
    | "excellent"
    | "good"
    | "moderate"
    | "aging"
    | "poor"
    | "critical";

/** Implied health % vs Profile original / rated full range. */
export function computeBatteryHealthPercent(
    originalRangeKm: number,
    rangeAt100SocKm: number
): number | null {
    return percentVsRated(originalRangeKm, rangeAt100SocKm);
}

/** Same ratio vs “ideal” rated range — uses the same Profile range unless you split fields later. */
export function computeEfficiencyPercent(
    idealRangeKm: number,
    rangeAt100SocKm: number
): number | null {
    return percentVsRated(idealRangeKm, rangeAt100SocKm);
}

export function computeEffectiveCapacityKwh(
    ratedCapacityKwh: number,
    healthPercent: number
): number {
    if (ratedCapacityKwh <= 0) return 0;
    return Math.round((ratedCapacityKwh * healthPercent) / 100 * 10) / 10;
}

export function getBatteryHealthTier(health: number): BatteryHealthTier {
    if (health >= 90) return "excellent";
    if (health >= 80) return "good";
    if (health >= 70) return "moderate";
    if (health >= 60) return "aging";
    if (health >= 40) return "poor";
    return "critical";
}

export type TierCopy = {
    title: string;
    titleClassName: string;
    cardClassName: string;
    iconWrapClassName: string;
    replacementBadge: string;
    replacementLabel: string;
};

export function getTierCopy(tier: BatteryHealthTier): TierCopy {
    switch (tier) {
        case "excellent":
            return {
                title: "Battery in Excellent Condition",
                titleClassName: "text-emerald-400",
                cardClassName: "border-emerald-500/25 bg-emerald-500/5",
                iconWrapClassName: "bg-emerald-500/20",
                replacementBadge: "2–3 years",
                replacementLabel: "above 80% health",
            };
        case "good":
            return {
                title: "Battery in Good Condition",
                titleClassName: "text-green-400",
                cardClassName: "border-green-500/25 bg-green-500/5",
                iconWrapClassName: "bg-green-500/20",
                replacementBadge: "1.5–2 years",
                replacementLabel: "efficient performance",
            };
        case "moderate":
            return {
                title: "Moderate Battery Health",
                titleClassName: "text-yellow-400",
                cardClassName: "border-yellow-500/25 bg-yellow-500/5",
                iconWrapClassName: "bg-yellow-500/20",
                replacementBadge: "1–1.5 years",
                replacementLabel: "optimal performance",
            };
        case "aging":
            return {
                title: "Battery Showing Signs of Aging",
                titleClassName: "text-orange-400",
                cardClassName: "border-orange-500/25 bg-orange-500/5",
                iconWrapClassName: "bg-orange-500/20",
                replacementBadge: "6–12 months",
                replacementLabel: "maintenance window",
            };
        case "poor":
            return {
                title: "Battery in Poor Condition",
                titleClassName: "text-red-400",
                cardClassName: "border-red-500/25 bg-red-500/5",
                iconWrapClassName: "bg-red-500/20",
                replacementBadge: "Soon",
                replacementLabel: "servicing",
            };
        case "critical":
        default:
            return {
                title: "Critical Battery Condition",
                titleClassName: "text-red-600",
                cardClassName: "border-red-600/30 bg-red-950/20",
                iconWrapClassName: "bg-red-600/20",
                replacementBadge: "Immediate",
                replacementLabel: "replacement",
            };
    }
}
