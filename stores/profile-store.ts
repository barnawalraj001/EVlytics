import { create } from "zustand";
import type { EvlyticsProfile, EvlyticsUser, EvlyticsVehicle } from "@/lib/evlytics-profile";
import {
    defaultEvlyticsProfile,
    loadProfileFromStorage,
    mergeEvlyticsProfile,
    saveProfileToStorage,
    withComputedEfficiency,
} from "@/lib/evlytics-profile";

export type ProfileUpdate = {
    user?: Partial<EvlyticsUser>;
    vehicle?: Partial<EvlyticsVehicle>;
};

type ProfileState = {
    profile: EvlyticsProfile;
    hydrated: boolean;
    hydrate: () => void;
    setProfile: (profile: EvlyticsProfile) => void;
    updateProfile: (partial: ProfileUpdate) => void;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: defaultEvlyticsProfile(),
    hydrated: false,

    hydrate: () => {
        if (typeof window === "undefined") return;
        const loaded = loadProfileFromStorage();
        const normalized = withComputedEfficiency(loaded);
        set({ profile: normalized, hydrated: true });
    },

    setProfile: (profile) => {
        const normalized = withComputedEfficiency(profile);
        saveProfileToStorage(normalized);
        set({ profile: normalized });
    },

    updateProfile: (partial) => {
        const current = get().profile;
        const merged = mergeEvlyticsProfile(current, {
            user: partial.user,
            vehicle: partial.vehicle,
        });
        const normalized = withComputedEfficiency(merged);
        saveProfileToStorage(normalized);
        set({ profile: normalized });
    },
}));
