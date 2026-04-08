/**
 * EV vs petrol monthly cost from Profile: pack size, full range, monthly km, ₹/kWh.
 * Petrol side uses configurable defaults (km/l, ₹/l).
 */

export const DEFAULT_PETROL_MILEAGE_KM_PER_L = 15;
export const DEFAULT_PETROL_PRICE_PER_L = 100;

/** Wh/km = (battery kWh × 1000) / full range km */
export function computeWhPerKm(
    batteryKwh: number,
    fullRangeKm: number
): number | null {
    if (batteryKwh <= 0 || fullRangeKm <= 0) return null;
    return (batteryKwh * 1000) / fullRangeKm;
}

/** ₹/km for EV = (Wh/km × ₹/kWh) / 1000 */
export function computeEvCostPerKmRupees(
    whPerKm: number,
    costPerKwh: number
): number {
    return (whPerKm * costPerKwh) / 1000;
}

/** ₹/km for petrol = ₹/l ÷ km/l */
export function computePetrolCostPerKm(
    petrolPricePerL: number,
    mileageKmPerL: number
): number | null {
    if (mileageKmPerL <= 0 || petrolPricePerL < 0) return null;
    return petrolPricePerL / mileageKmPerL;
}

export type MonthlyFuelComparison = {
    whPerKm: number;
    evCostPerKm: number;
    evMonthly: number;
    petrolCostPerKm: number;
    petrolMonthly: number;
    savings: number;
    petrolMileageKmPerL: number;
    petrolPricePerL: number;
};

export function computeMonthlyFuelComparison(params: {
    monthlyKm: number;
    batteryKwh: number;
    fullRangeKm: number;
    costPerKwh: number;
    petrolKmPerL?: number;
    petrolPricePerL?: number;
}): MonthlyFuelComparison | null {
    const {
        monthlyKm,
        batteryKwh,
        fullRangeKm,
        costPerKwh,
        petrolKmPerL = DEFAULT_PETROL_MILEAGE_KM_PER_L,
        petrolPricePerL = DEFAULT_PETROL_PRICE_PER_L,
    } = params;

    if (monthlyKm <= 0 || costPerKwh < 0) return null;

    const whPerKm = computeWhPerKm(batteryKwh, fullRangeKm);
    if (whPerKm === null) return null;

    const evCostPerKm = computeEvCostPerKmRupees(whPerKm, costPerKwh);
    const evMonthly = monthlyKm * evCostPerKm;

    const petrolCostPerKm = computePetrolCostPerKm(
        petrolPricePerL,
        petrolKmPerL
    );
    if (petrolCostPerKm === null) return null;

    const petrolMonthly = monthlyKm * petrolCostPerKm;
    const savings = petrolMonthly - evMonthly;

    return {
        whPerKm,
        evCostPerKm,
        evMonthly,
        petrolCostPerKm,
        petrolMonthly,
        savings,
        petrolMileageKmPerL: petrolKmPerL,
        petrolPricePerL,
    };
}

export function formatRupeesInr(n: number): string {
    const rounded = Math.round(n);
    return `₹${rounded.toLocaleString("en-IN")}`;
}
