"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/stores/profile-store";
import { useRangePredictionStore } from "@/stores/range-prediction-store";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const hydrate = useProfileStore((s) => s.hydrate);
    const hydrateRangePrediction = useRangePredictionStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
        hydrateRangePrediction();
    }, [hydrate, hydrateRangePrediction]);

    return <>{children}</>;
}
