"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/stores/profile-store";
import { useRangePredictionStore } from "@/stores/range-prediction-store";
import { useCo2SavingsStore } from "@/stores/co2-savings-store";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const hydrate = useProfileStore((s) => s.hydrate);
    const hydrateRangePrediction = useRangePredictionStore((s) => s.hydrate);
    const hydrateCo2Savings = useCo2SavingsStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
        hydrateRangePrediction();
        hydrateCo2Savings();
    }, [hydrate, hydrateRangePrediction, hydrateCo2Savings]);

    return <>{children}</>;
}
