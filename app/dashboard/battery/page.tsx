"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Battery, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { degradationProjection } from "@/lib/mock-data";
import {
    computeBatteryHealthPercent,
    computeEfficiencyPercent,
    computeEffectiveCapacityKwh,
    getBatteryHealthTier,
    getTierCopy,
} from "@/lib/battery-health";
import { rangeAt100Soc, formatKmOneDecimal } from "@/lib/range-normalization";
import { BatteryHealthBanner } from "@/components/battery-health-banner";
import { useProfile } from "@/hooks/use-profile";
import { useRangePredictionStore } from "@/stores/range-prediction-store";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function CircularProgress({ value }: { value: number }) {
    const circumference = 2 * Math.PI * 60;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
                <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="hsl(150 12% 20%)"
                    strokeWidth="8"
                    fill="none"
                />
                <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="url(#progressGradientBattery)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient
                        id="progressGradientBattery"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="hsl(142 72% 50%)" />
                        <stop offset="100%" stopColor="hsl(160 70% 50%)" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute text-center">
                <span className="text-4xl font-bold gradient-text">{value}%</span>
                <p className="text-xs text-muted-foreground mt-1">Health</p>
            </div>
        </div>
    );
}

export default function BatteryHealthPage() {
    const { profile } = useProfile();
    const predictedRangeKm = useRangePredictionStore((s) => s.predictedRangeKm);
    const lastInputs = useRangePredictionStore((s) => s.lastInputs);
    const rangeHydrated = useRangePredictionStore((s) => s.hydrated);

    const fullRangeKm = profile.vehicle.range;
    const ratedCapacityKwh = profile.vehicle.batteryCapacity;

    const { healthPercent, efficiencyPercent, rangeAt100, effectiveKwh, tier, hasData } =
        useMemo(() => {
            const soc = lastInputs?.soc;
            if (
                !rangeHydrated ||
                predictedRangeKm === null ||
                soc === undefined ||
                fullRangeKm <= 0
            ) {
                return {
                    healthPercent: null as number | null,
                    efficiencyPercent: null as number | null,
                    rangeAt100: null as number | null,
                    effectiveKwh: null as number | null,
                    tier: null as ReturnType<typeof getBatteryHealthTier> | null,
                    hasData: false,
                };
            }

            const r100 = rangeAt100Soc(predictedRangeKm, soc);
            if (r100 === null) {
                return {
                    healthPercent: null,
                    efficiencyPercent: null,
                    rangeAt100: null,
                    effectiveKwh: null,
                    tier: null,
                    hasData: false,
                };
            }

            const hp = computeBatteryHealthPercent(fullRangeKm, r100);
            const effIdx = computeEfficiencyPercent(fullRangeKm, r100);
            if (hp === null || effIdx === null) {
                return {
                    healthPercent: null,
                    efficiencyPercent: null,
                    rangeAt100: null,
                    effectiveKwh: null,
                    tier: null,
                    hasData: false,
                };
            }
            const t = getBatteryHealthTier(hp);
            const cap = computeEffectiveCapacityKwh(ratedCapacityKwh, hp);
            return {
                healthPercent: hp,
                efficiencyPercent: effIdx,
                rangeAt100: r100,
                effectiveKwh: cap,
                tier: t,
                hasData: true,
            };
        }, [
            rangeHydrated,
            predictedRangeKm,
            lastInputs,
            fullRangeKm,
            ratedCapacityKwh,
        ]);

    const displayHealth = healthPercent != null ? Math.round(healthPercent) : null;
    const tierMeta = tier ? getTierCopy(tier) : null;

    const badgeVariant =
        tier === "poor" || tier === "critical"
            ? "destructive"
            : tier === "moderate" || tier === "aging"
              ? "warning"
              : "success";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Battery className="h-6 w-6 text-primary" />
                    Battery Health
                </h2>
                <p className="text-muted-foreground mt-1">
                    Health uses your last prediction: remaining range at SOC → normalized to 100% SOC,
                    then compared to your rated full range in Profile.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                        {hasData && displayHealth != null ? (
                            <CircularProgress value={Math.min(100, Math.max(0, displayHealth))} />
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <span className="text-4xl font-bold">—</span>
                                <p className="text-xs max-w-[12rem]">
                                    Add full range in Profile and run a prediction on Range
                                    Prediction.
                                </p>
                            </div>
                        )}

                        <div className="mt-6 space-y-3 w-full">
                            {hasData &&
                                predictedRangeKm != null &&
                                lastInputs != null &&
                                rangeAt100 != null && (
                                    <>
                                        {/* <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                            <span className="text-sm text-muted-foreground">
                                                Remaining range (model)
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {formatKmOneDecimal(predictedRangeKm)} km
                                            </span>
                                        </div> */}
                                        {/* <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                            <span className="text-sm text-muted-foreground">
                                                SOC at prediction
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {lastInputs.soc}%
                                            </span>
                                        </div> */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/15">
                                            <span className="text-sm text-muted-foreground">
                                                Est. full range
                                            </span>
                                            <span className="text-sm font-semibold text-primary">
                                                {formatKmOneDecimal(rangeAt100)} km
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                            <span className="text-sm text-muted-foreground">
                                                Efficiency vs rated range
                                            </span>
                                            <span className="text-sm font-semibold">
                                                {efficiencyPercent != null
                                                    ? `${Math.round(efficiencyPercent)}%`
                                                    : "—"}
                                            </span>
                                        </div>
                                    </>
                                )}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                <span className="text-sm text-muted-foreground">
                                    Current capacity (est.)
                                </span>
                                <span className="text-sm font-semibold">
                                    {effectiveKwh != null
                                        ? `${effectiveKwh} kWh`
                                        : "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                <span className="text-sm text-muted-foreground">
                                    Rated capacity (Profile)
                                </span>
                                <span className="text-sm font-semibold">
                                    {ratedCapacityKwh > 0 ? `${ratedCapacityKwh} kWh` : "—"}
                                </span>
                            </div>
                            {/* <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10">
                                <span className="text-sm text-muted-foreground">
                                    Est. window (guidance)
                                </span>
                                {tierMeta ? (
                                    <Badge variant={badgeVariant}>{tierMeta.replacementBadge}</Badge>
                                ) : (
                                    <Badge variant="secondary">—</Badge>
                                )}
                            </div> */}
                        </div>

                        {hasData &&
                            healthPercent != null &&
                            predictedRangeKm != null &&
                            lastInputs != null &&
                            rangeAt100 != null && (
                                <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed text-left w-full">
                                    <strong className="text-foreground/90">How we compute it:</strong>{" "}
                                    remaining range ÷ (SOC ÷ 100) = est. full range at 100% SOC (
                                    {formatKmOneDecimal(rangeAt100)} km). Health & efficiency index =
                                    that value ÷ your rated full range ({Math.round(fullRangeKm)} km).
                                    Effective capacity ≈ rated kWh × health.
                                </p>
                            )}

                        {!hasData && (
                            <div className="mt-4 flex flex-col gap-2 w-full">
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href="/dashboard/profile">Open Profile</Link>
                                </Button>
                                <Button asChild variant="default" size="sm" className="w-full">
                                    <Link href="/dashboard/range">Run range prediction</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    {hasData && healthPercent != null && tier ? (
                        <BatteryHealthBanner healthPercent={healthPercent} tier={tier} />
                    ) : (
                        <Card className="border-dashed border-border/60 bg-card/40">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                                    <Info className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-foreground">
                                        No battery health estimate yet
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        Set your vehicle&apos;s <strong>full range</strong> and{" "}
                                        <strong>battery capacity (kWh)</strong> in Profile, then run
                                        the ML prediction on{" "}
                                        <Link
                                            href="/dashboard/range"
                                            className="text-primary underline-offset-2 hover:underline"
                                        >
                                            Range Prediction
                                        </Link>
                                        .                                         We normalize remaining range using your SOC, then compare to
                                        your rated full range.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Battery Degradation Factors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        title: "Temperature Extremes",
                                        description:
                                            "Frequent exposure to temperatures above 35°C or below -10°C accelerates degradation.",
                                        severity: "warning",
                                    },
                                    {
                                        title: "Fast Charging Frequency",
                                        description:
                                            "Regular DC fast charging generates heat that impacts battery longevity over time.",
                                        severity: "warning",
                                    },
                                    {
                                        title: "Charge Level Management",
                                        description:
                                            "Keeping SOC between 20-80% for daily use extends battery life significantly.",
                                        severity: "good",
                                    },
                                    {
                                        title: "Driving Style",
                                        description:
                                            "Smooth acceleration and regenerative braking reduce stress on battery cells.",
                                        severity: "good",
                                    },
                                ].map((factor) => (
                                    <div
                                        key={factor.title}
                                        className="p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {factor.severity === "warning" ? (
                                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            )}
                                            <h4 className="text-sm font-semibold">{factor.title}</h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {factor.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Battery className="h-5 w-5 text-primary" />
                        Battery Degradation Projection (5-Year Forecast)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={degradationProjection}>
                                <defs>
                                    <linearGradient
                                        id="degradationGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="hsl(142 72% 50%)"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="hsl(142 72% 50%)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border/50"
                                />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fill: "hsl(145 10% 58%)" }}
                                    axisLine={{ stroke: "hsl(150 12% 20%)" }}
                                />
                                <YAxis
                                    domain={[70, 105]}
                                    tick={{ fill: "hsl(145 10% 58%)" }}
                                    axisLine={{ stroke: "hsl(150 12% 20%)" }}
                                    label={{
                                        value: "Capacity (%)",
                                        angle: -90,
                                        position: "insideLeft",
                                        fill: "hsl(215 16% 57%)",
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(152 14% 13%)",
                                        border: "1px solid hsl(216 34% 17%)",
                                        borderRadius: "12px",
                                        padding: "12px",
                                    }}
                                    labelStyle={{ color: "hsl(140 20% 92%)" }}
                                    itemStyle={{ color: "hsl(142 70% 45%)" }}
                                    formatter={(value: number) => [
                                        `${value}%`,
                                        "Battery Capacity",
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="capacity"
                                    stroke="hsl(142 70% 45%)"
                                    strokeWidth={3}
                                    fill="url(#degradationGradient)"
                                    dot={{ fill: "hsl(142 70% 45%)", r: 4 }}
                                    activeDot={{ r: 6, fill: "hsl(142 70% 45%)" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
