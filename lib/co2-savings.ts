/** Emission factors (g CO₂ / km) — same as CO₂ Savings page. */
export const PETROL_G_PER_KM = 120;
export const DIESEL_G_PER_KM = 130;
export const EV_G_PER_KM = 20;
export const TREE_KG_CO2_PER_YEAR = 21.7;

export type IceType = "petrol" | "diesel";

export function getIceEmissionGPerKm(type: IceType): number {
    return type === "petrol" ? PETROL_G_PER_KM : DIESEL_G_PER_KM;
}

export type Co2SavingsResult = {
    monthlyKg: number;
    yearlyTons: number;
    trees: number;
};

export function calculateCo2Savings(
    distanceKm: number,
    iceType: IceType
): Co2SavingsResult {
    const ice = getIceEmissionGPerKm(iceType);
    const monthlySavedKg = ((ice - EV_G_PER_KM) * distanceKm) / 1000;
    const yearlySavedTons = (monthlySavedKg * 12) / 1000;
    const trees = (monthlySavedKg * 12) / TREE_KG_CO2_PER_YEAR;

    return {
        monthlyKg: Math.round(monthlySavedKg),
        yearlyTons: Math.round(yearlySavedTons * 10) / 10,
        trees: Math.round(trees),
    };
}
