/** Curated MVP presets — real-world range & pack size for quick Profile setup. */

export type MvpVehiclePreset = {
    id: string;
    /** Short label for the dropdown */
    label: string;
    /** Written to Profile vehicle model */
    model: string;
    batteryKwh: number;
    rangeKm: number;
};

export const MVP_VEHICLE_PRESETS: MvpVehiclePreset[] = [
    {
        id: "tiago-ev-lr",
        label: "Tata Tiago EV Long Range",
        model: "Tata Tiago EV Long Range",
        batteryKwh: 24,
        rangeKm: 230,
    },
    {
        id: "tigor-ev",
        label: "Tata Tigor EV",
        model: "Tata Tigor EV",
        batteryKwh: 26,
        rangeKm: 220,
    },
    {
        id: "citroen-e-c3",
        label: "Citroën ë-C3",
        model: "Citroën ë-C3",
        batteryKwh: 29.2,
        rangeKm: 240,
    },
];

export function matchMvpPresetId(vehicle: {
    model: string;
    batteryCapacity: number;
    range: number;
}): string | null {
    const m = vehicle.model.trim();
    for (const p of MVP_VEHICLE_PRESETS) {
        if (
            m === p.model &&
            Math.abs(vehicle.batteryCapacity - p.batteryKwh) < 0.05 &&
            Math.abs(vehicle.range - p.rangeKm) < 0.5
        ) {
            return p.id;
        }
    }
    return null;
}
