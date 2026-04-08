import { create } from "zustand";
import type { Co2SavingsResult, IceType } from "@/lib/co2-savings";

const STORAGE_KEY = "ev_co2_savings";

export type PersistedCo2Savings = Co2SavingsResult & {
    monthlyDistanceKm: number;
    iceType: IceType;
    computedAt: string;
};

type Co2SavingsState = {
    /** Last successful calculation from CO₂ Savings page (persisted). */
    lastResult: PersistedCo2Savings | null;
    hydrated: boolean;
    hydrate: () => void;
    setLastResult: (input: {
        monthlyDistanceKm: number;
        iceType: IceType;
    } & Co2SavingsResult) => void;
};

function loadFromStorage(): PersistedCo2Savings | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const p = JSON.parse(raw) as Partial<PersistedCo2Savings>;
        if (
            typeof p.monthlyKg !== "number" ||
            typeof p.yearlyTons !== "number" ||
            typeof p.trees !== "number" ||
            typeof p.monthlyDistanceKm !== "number" ||
            (p.iceType !== "petrol" && p.iceType !== "diesel") ||
            typeof p.computedAt !== "string"
        ) {
            return null;
        }
        return p as PersistedCo2Savings;
    } catch {
        return null;
    }
}

function saveToStorage(slice: PersistedCo2Savings) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slice));
}

export const useCo2SavingsStore = create<Co2SavingsState>((set) => ({
    lastResult: null,
    hydrated: false,

    hydrate: () => {
        if (typeof window === "undefined") return;
        const loaded = loadFromStorage();
        if (loaded) {
            set({ lastResult: loaded, hydrated: true });
        } else {
            set({ hydrated: true });
        }
    },

    setLastResult: ({ monthlyDistanceKm, iceType, ...rest }) => {
        const computedAt = new Date().toISOString();
        const slice: PersistedCo2Savings = {
            monthlyDistanceKm,
            iceType,
            computedAt,
            ...rest,
        };
        saveToStorage(slice);
        set({ lastResult: slice });
    },
}));
