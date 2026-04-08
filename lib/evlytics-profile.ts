/** localStorage key for persisted profile (MVP). Future: swap for Supabase sync. */
export const EVLYTICS_PROFILE_STORAGE_KEY = "evlytics_profile";

export type ChargingType = "Fast" | "Normal";

export interface EvlyticsUser {
    name: string;
    email: string;
    location: string;
}

export interface EvlyticsVehicle {
    model: string;
    batteryCapacity: number;
    range: number;
    efficiency: number;
    chargingType: ChargingType;
    costPerUnit: number;
    /** Average distance driven per month (km), for cost / savings estimates. */
    averageMonthlyKm: number;
}

export interface EvlyticsProfile {
    user: EvlyticsUser;
    vehicle: EvlyticsVehicle;
}

export function defaultEvlyticsProfile(): EvlyticsProfile {
    return {
        user: {
            name: "Raj Barnawal",
            email: "barnawalraj001@gmail.com",
            location: "",
        },
        vehicle: {
            model: "",
            batteryCapacity: 40,
            range: 300,
            efficiency: 7.5,
            chargingType: "Normal",
            costPerUnit: 8,
            averageMonthlyKm: 1200,
        },
    };
}

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeUser(base: EvlyticsUser, partial?: unknown): EvlyticsUser {
    if (!isRecord(partial)) return { ...base };
    return {
        name: typeof partial.name === "string" ? partial.name : base.name,
        email: typeof partial.email === "string" ? partial.email : base.email,
        location: typeof partial.location === "string" ? partial.location : base.location,
    };
}

function mergeVehicle(base: EvlyticsVehicle, partial?: unknown): EvlyticsVehicle {
    if (!isRecord(partial)) return { ...base };
    const charging =
        partial.chargingType === "Fast" || partial.chargingType === "Normal"
            ? partial.chargingType
            : base.chargingType;
    return {
        model: typeof partial.model === "string" ? partial.model : base.model,
        batteryCapacity:
            typeof partial.batteryCapacity === "number" && !Number.isNaN(partial.batteryCapacity)
                ? partial.batteryCapacity
                : base.batteryCapacity,
        range:
            typeof partial.range === "number" && !Number.isNaN(partial.range)
                ? partial.range
                : base.range,
        efficiency:
            typeof partial.efficiency === "number" && !Number.isNaN(partial.efficiency)
                ? partial.efficiency
                : base.efficiency,
        chargingType: charging,
        costPerUnit:
            typeof partial.costPerUnit === "number" && !Number.isNaN(partial.costPerUnit)
                ? partial.costPerUnit
                : base.costPerUnit,
        averageMonthlyKm:
            typeof partial.averageMonthlyKm === "number" &&
            !Number.isNaN(partial.averageMonthlyKm)
                ? partial.averageMonthlyKm
                : base.averageMonthlyKm,
    };
}

export function mergeEvlyticsProfile(
    base: EvlyticsProfile,
    partial?: unknown
): EvlyticsProfile {
    if (!isRecord(partial)) return { ...base, user: { ...base.user }, vehicle: { ...base.vehicle } };
    return {
        user: mergeUser(base.user, partial.user),
        vehicle: mergeVehicle(base.vehicle, partial.vehicle),
    };
}

/** km/kWh from full range and pack size. */
export function computeEfficiency(rangeKm: number, batteryKwh: number): number {
    if (batteryKwh <= 0 || rangeKm <= 0) return 0;
    return Math.round((rangeKm / batteryKwh) * 100) / 100;
}

export function withComputedEfficiency(profile: EvlyticsProfile): EvlyticsProfile {
    const { range, batteryCapacity } = profile.vehicle;
    return {
        ...profile,
        user: { ...profile.user },
        vehicle: {
            ...profile.vehicle,
            efficiency: computeEfficiency(range, batteryCapacity),
        },
    };
}

export function loadProfileFromStorage(): EvlyticsProfile {
    if (typeof window === "undefined") return defaultEvlyticsProfile();
    try {
        const raw = window.localStorage.getItem(EVLYTICS_PROFILE_STORAGE_KEY);
        if (!raw) return defaultEvlyticsProfile();
        const parsed = JSON.parse(raw) as unknown;
        return mergeEvlyticsProfile(defaultEvlyticsProfile(), parsed);
    } catch {
        return defaultEvlyticsProfile();
    }
}

export function saveProfileToStorage(profile: EvlyticsProfile): void {
    if (typeof window === "undefined") return;
    const normalized = withComputedEfficiency(profile);
    window.localStorage.setItem(
        EVLYTICS_PROFILE_STORAGE_KEY,
        JSON.stringify(normalized)
    );
}

export function clampNonNegative(n: number): number {
    if (Number.isNaN(n) || n < 0) return 0;
    return n;
}
