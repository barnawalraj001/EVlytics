import { create } from "zustand";

const STORAGE_KEY = "ev_range_prediction";

export type RangePredictionInputs = {
    soc: number;
    temperature: number;
    speed: number;
    acUsageLabel: "low" | "medium" | "high";
    /** 0 = low, 1 = medium, 2 = high (API encoding) */
    acUsageCode: 0 | 1 | 2;
};

type PersistedSlice = {
    predictedRangeKm: number;
    lastInputs: RangePredictionInputs;
    predictedAt: string;
};

type RangePredictionState = {
    predictedRangeKm: number | null;
    lastInputs: RangePredictionInputs | null;
    predictedAt: string | null;
    hydrated: boolean;
    hydrate: () => void;
    setPrediction: (predictedRangeKm: number, inputs: RangePredictionInputs) => void;
    clearPrediction: () => void;
};

function loadFromStorage(): PersistedSlice | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<PersistedSlice>;
        if (typeof parsed.predictedRangeKm !== "number" || !parsed.lastInputs) return null;
        const li = parsed.lastInputs;
        if (
            typeof li.soc !== "number" ||
            typeof li.temperature !== "number" ||
            typeof li.speed !== "number" ||
            (li.acUsageCode !== 0 && li.acUsageCode !== 1 && li.acUsageCode !== 2)
        ) {
            return null;
        }
        return {
            predictedRangeKm: parsed.predictedRangeKm,
            lastInputs: li as RangePredictionInputs,
            predictedAt: typeof parsed.predictedAt === "string" ? parsed.predictedAt : new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

function saveToStorage(slice: PersistedSlice) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slice));
}

export const useRangePredictionStore = create<RangePredictionState>((set) => ({
    predictedRangeKm: null,
    lastInputs: null,
    predictedAt: null,
    hydrated: false,

    hydrate: () => {
        if (typeof window === "undefined") return;
        const loaded = loadFromStorage();
        if (loaded) {
            set({
                predictedRangeKm: loaded.predictedRangeKm,
                lastInputs: loaded.lastInputs,
                predictedAt: loaded.predictedAt,
                hydrated: true,
            });
        } else {
            set({ hydrated: true });
        }
    },

    setPrediction: (predictedRangeKm, lastInputs) => {
        const predictedAt = new Date().toISOString();
        const slice: PersistedSlice = { predictedRangeKm, lastInputs, predictedAt };
        saveToStorage(slice);
        set({ predictedRangeKm, lastInputs, predictedAt });
    },

    clearPrediction: () => {
        if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
        set({ predictedRangeKm: null, lastInputs: null, predictedAt: null });
    },
}));
