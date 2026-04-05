/**
 * Model returns **remaining** range at current SOC, not full pack range.
 * Normalize to “what you’d get at 100% SOC” under the same conditions:
 *   range_at_100_soc = predicted_remaining_km / (soc / 100)
 */

export function rangeAt100Soc(
    predictedRemainingKm: number,
    socPercent: number
): number | null {
    if (
        predictedRemainingKm < 0 ||
        socPercent <= 0 ||
        socPercent > 100
    ) {
        return null;
    }
    return predictedRemainingKm / (socPercent / 100);
}

/** Ratio vs a rated full-range figure (0–100 scale), e.g. health or efficiency index. */
export function percentVsRated(
    ratedRangeKm: number,
    rangeAt100SocKm: number
): number | null {
    if (ratedRangeKm <= 0 || rangeAt100SocKm < 0) return null;
    const pct = (rangeAt100SocKm / ratedRangeKm) * 100;
    const clamped = Math.min(100, Math.max(0, pct));
    return Math.round(clamped * 10) / 10;
}

export function formatKmOneDecimal(km: number): string {
    if (!Number.isFinite(km)) return "—";
    return km % 1 === 0 ? `${Math.round(km)}` : km.toFixed(1);
}
