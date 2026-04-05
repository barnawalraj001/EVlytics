"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/stores/profile-store";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const hydrate = useProfileStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return <>{children}</>;
}
