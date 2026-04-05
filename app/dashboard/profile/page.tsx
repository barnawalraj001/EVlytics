"use client";

import { useEffect, useMemo, useState } from "react";
import {
    User,
    Car,
    Battery,
    Gauge,
    Zap,
    MapPin,
    Mail,
    Pencil,
    Save,
    X,
    IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/hooks/use-profile";
import {
    type EvlyticsProfile,
    clampNonNegative,
    computeEfficiency,
    defaultEvlyticsProfile,
} from "@/lib/evlytics-profile";
import { cn } from "@/lib/utils";

function cloneProfile(p: EvlyticsProfile): EvlyticsProfile {
    return {
        user: { ...p.user },
        vehicle: { ...p.vehicle },
    };
}

function validateProfile(p: EvlyticsProfile): string | null {
    const { batteryCapacity, range, costPerUnit } = p.vehicle;
    if (batteryCapacity < 0 || range < 0 || costPerUnit < 0) {
        return "Numeric values cannot be negative.";
    }
    if (p.vehicle.efficiency < 0) {
        return "Efficiency cannot be negative.";
    }
    return null;
}

export default function ProfilePage() {
    const { profile, updateProfile, hydrated } = useProfile();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<EvlyticsProfile>(() => defaultEvlyticsProfile());

    useEffect(() => {
        if (!editing && hydrated) {
            setDraft(cloneProfile(profile));
        }
    }, [profile, editing, hydrated]);

    const computedEfficiency = useMemo(() => {
        return computeEfficiency(draft.vehicle.range, draft.vehicle.batteryCapacity);
    }, [draft.vehicle.range, draft.vehicle.batteryCapacity]);

    const startEdit = () => {
        setDraft(cloneProfile(profile));
        setEditing(true);
    };

    const cancelEdit = () => {
        setDraft(cloneProfile(profile));
        setEditing(false);
    };

    const save = () => {
        const next: EvlyticsProfile = {
            ...draft,
            user: { ...draft.user },
            vehicle: {
                ...draft.vehicle,
                batteryCapacity: clampNonNegative(draft.vehicle.batteryCapacity),
                range: clampNonNegative(draft.vehicle.range),
                costPerUnit: clampNonNegative(draft.vehicle.costPerUnit),
                efficiency: computeEfficiency(
                    clampNonNegative(draft.vehicle.range),
                    clampNonNegative(draft.vehicle.batteryCapacity)
                ),
            },
        };

        const err = validateProfile(next);
        if (err) {
            toast.error(err);
            return;
        }

        updateProfile({
            user: next.user,
            vehicle: next.vehicle,
        });
        toast.success("Profile updated successfully");
        setEditing(false);
    };

    const disabled = !editing;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your account and EV details. Data is stored locally for this MVP and
                        shared across the dashboard.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {!editing ? (
                        <Button
                            type="button"
                            onClick={startEdit}
                            className="gap-2 bg-gradient-to-r from-[#00C853] to-[#2962FF] hover:opacity-95 text-white border-0"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={cancelEdit}
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={save}
                                className="gap-2 bg-gradient-to-r from-[#00C853] to-[#2962FF] hover:opacity-95 text-white border-0"
                            >
                                <Save className="h-4 w-4" />
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* User */}
            <Card
                className={cn(
                    "border-border/50 bg-card/40 backdrop-blur-xl shadow-xl shadow-black/20",
                    "hover:border-primary/20 transition-colors duration-300"
                )}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">User details</CardTitle>
                            <p className="text-sm text-muted-foreground font-normal mt-0.5">
                                Identity used across EVlytics
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Your name"
                                value={draft.user.name}
                                disabled={disabled}
                                onChange={(e) =>
                                    setDraft((d) => ({
                                        ...d,
                                        user: { ...d.user, name: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={draft.user.email}
                                disabled
                                className="opacity-80"
                                readOnly
                            />
                            <p className="text-xs text-muted-foreground">
                                Email is tied to your signed-in account (readonly).
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            Location{" "}
                            <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="location"
                            placeholder="e.g. Bengaluru, India"
                            value={draft.user.location}
                            disabled={disabled}
                            onChange={(e) =>
                                setDraft((d) => ({
                                    ...d,
                                    user: { ...d.user, location: e.target.value },
                                }))
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Vehicle */}
            <Card
                className={cn(
                    "border-border/50 bg-card/40 backdrop-blur-xl shadow-xl shadow-black/20",
                    "hover:border-primary/20 transition-colors duration-300"
                )}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-[#2962FF]/15 border border-[#2962FF]/30 flex items-center justify-center text-[#5c9cff]">
                            <Car className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Vehicle details</CardTitle>
                            <p className="text-sm text-muted-foreground font-normal mt-0.5">
                                Used for range, cost, and efficiency estimates
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="model">Vehicle model</Label>
                            <Input
                                id="model"
                                placeholder="e.g. Nexon EV, Ola S1 Pro"
                                value={draft.vehicle.model}
                                disabled={disabled}
                                onChange={(e) =>
                                    setDraft((d) => ({
                                        ...d,
                                        vehicle: { ...d.vehicle, model: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="battery" className="flex items-center gap-2">
                                <Battery className="h-3.5 w-3.5 text-primary" />
                                Battery capacity (kWh)
                            </Label>
                            <Input
                                id="battery"
                                type="number"
                                min={0}
                                step={0.1}
                                placeholder="40"
                                value={draft.vehicle.batteryCapacity || ""}
                                disabled={disabled}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setDraft((d) => {
                                        const batteryCapacity = Number.isNaN(v)
                                            ? 0
                                            : clampNonNegative(v);
                                        const range = d.vehicle.range;
                                        return {
                                            ...d,
                                            vehicle: {
                                                ...d.vehicle,
                                                batteryCapacity,
                                                efficiency: computeEfficiency(range, batteryCapacity),
                                            },
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="range" className="flex items-center gap-2">
                                <Gauge className="h-3.5 w-3.5 text-primary" />
                                Full range (km)
                            </Label>
                            <Input
                                id="range"
                                type="number"
                                min={0}
                                step={1}
                                placeholder="300"
                                value={draft.vehicle.range || ""}
                                disabled={disabled}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setDraft((d) => {
                                        const range = Number.isNaN(v) ? 0 : clampNonNegative(v);
                                        const batteryCapacity = d.vehicle.batteryCapacity;
                                        return {
                                            ...d,
                                            vehicle: {
                                                ...d.vehicle,
                                                range,
                                                efficiency: computeEfficiency(
                                                    range,
                                                    batteryCapacity
                                                ),
                                            },
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Zap className="h-3.5 w-3.5 text-[#5c9cff]" />
                                Efficiency (km/kWh)
                            </Label>
                            <Input
                                readOnly
                                disabled
                                value={
                                    computedEfficiency > 0
                                        ? String(computedEfficiency)
                                        : "—"
                                }
                                className="bg-muted/30 border-dashed"
                            />
                            <p className="text-xs text-muted-foreground">
                                Auto-calculated as range ÷ battery capacity
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Charging type</Label>
                            <Select
                                value={draft.vehicle.chargingType}
                                disabled={disabled}
                                onValueChange={(value: "Fast" | "Normal") =>
                                    setDraft((d) => ({
                                        ...d,
                                        vehicle: { ...d.vehicle, chargingType: value },
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fast">Fast</SelectItem>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="cost" className="flex items-center gap-2">
                                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                                Cost per unit electricity (₹/kWh)
                            </Label>
                            <Input
                                id="cost"
                                type="number"
                                min={0}
                                step={0.01}
                                placeholder="8"
                                value={draft.vehicle.costPerUnit || ""}
                                disabled={disabled}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setDraft((d) => ({
                                        ...d,
                                        vehicle: {
                                            ...d.vehicle,
                                            costPerUnit: Number.isNaN(v)
                                                ? 0
                                                : clampNonNegative(v),
                                        },
                                    }));
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
