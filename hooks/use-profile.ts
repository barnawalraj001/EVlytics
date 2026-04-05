import { useProfileStore } from "@/stores/profile-store";

/**
 * Global EVlytics profile (user + vehicle) backed by localStorage for MVP.
 * @see lib/evlytics-profile.ts — swap storage for Supabase later.
 */
export function useProfile() {
    const profile = useProfileStore((s) => s.profile);
    const updateProfile = useProfileStore((s) => s.updateProfile);
    const setProfile = useProfileStore((s) => s.setProfile);
    const hydrate = useProfileStore((s) => s.hydrate);
    const hydrated = useProfileStore((s) => s.hydrated);

    return { profile, updateProfile, setProfile, hydrate, hydrated };
}
