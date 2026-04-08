"use client";

import React, { useMemo } from "react";
import { Gauge, Battery, Leaf, Car, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    overviewMetricsSecondary,
    batteryHealthTrend,
    emissionsComparison,
    type MetricCard,
} from "@/lib/mock-data";
import { useProfile } from "@/hooks/use-profile";
import { useRangePredictionStore } from "@/stores/range-prediction-store";
import { useCo2SavingsStore } from "@/stores/co2-savings-store";
import { rangeAt100Soc, formatKmOneDecimal } from "@/lib/range-normalization";
import { computeBatteryHealthPercent } from "@/lib/battery-health";
import {
    computeMonthlyFuelComparison,
    formatRupeesInr,
    DEFAULT_PETROL_MILEAGE_KM_PER_L,
    DEFAULT_PETROL_PRICE_PER_L,
} from "@/lib/monthly-fuel-savings";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const iconMap: Record<string, React.ReactNode> = {
    Gauge: <Gauge className="h-5 w-5" />,
    Battery: <Battery className="h-5 w-5" />,
    Leaf: <Leaf className="h-5 w-5" />,
};

const chartColors = {
    tick: "hsl(145 10% 58%)",
    axis: "hsl(150 12% 20%)",
    tooltip: {
        bg: "hsl(152 14% 13%)",
        border: "1px solid hsl(150 12% 20%)",
        borderRadius: "12px",
        padding: "12px",
    },
    label: "hsl(140 20% 92%)",
    green: "hsl(142 72% 50%)",
    red: "hsl(0 84% 60%)",
};

// Mock charging data
// const chargingHistory = [
//     { day: "Mon", kwh: 22, cost: 3.3 },
//     { day: "Tue", kwh: 0, cost: 0 },
//     { day: "Wed", kwh: 35, cost: 5.25 },
//     { day: "Thu", kwh: 15, cost: 2.25 },
//     { day: "Fri", kwh: 28, cost: 4.2 },
//     { day: "Sat", kwh: 42, cost: 6.3 },
//     { day: "Sun", kwh: 10, cost: 1.5 },
// ];

export default function DashboardOverview() {
    const { profile } = useProfile();
    const predictedRangeKm = useRangePredictionStore((s) => s.predictedRangeKm);
    const lastInputs = useRangePredictionStore((s) => s.lastInputs);
    const rangeHydrated = useRangePredictionStore((s) => s.hydrated);
    const co2Hydrated = useCo2SavingsStore((s) => s.hydrated);
    const co2Last = useCo2SavingsStore((s) => s.lastResult);

    const greetName =
        profile.user.name?.trim().split(/\s+/)[0] ||
        profile.user.email?.split("@")[0] ||
        "there";

    const overviewMetrics = useMemo((): MetricCard[] => {
        const fullRangeKm = profile.vehicle.range;

        const rangeAt100 =
            rangeHydrated &&
            predictedRangeKm !== null &&
            lastInputs != null
                ? rangeAt100Soc(predictedRangeKm, lastInputs.soc)
                : null;

        const healthPct =
            rangeAt100 != null && fullRangeKm > 0
                ? computeBatteryHealthPercent(fullRangeKm, rangeAt100)
                : null;

        const rangeSubtitleParts: string[] = [];
        if (lastInputs != null) {
            rangeSubtitleParts.push(`${lastInputs.soc}% SOC`);
        }
        if (fullRangeKm > 0) {
            rangeSubtitleParts.push(`Full range (Profile): ${Math.round(fullRangeKm)} km`);
        }

        const predictedRange: MetricCard = {
            title: "Last predicted range",
            value:
                predictedRangeKm != null
                    ? formatKmOneDecimal(predictedRangeKm)
                    : "—",
            unit: "km",
            icon: "Gauge",
            subtitle:
                rangeSubtitleParts.length > 0
                    ? `Remaining at current charge · ${rangeSubtitleParts.join(" · ")}`
                    : fullRangeKm > 0
                      ? `Rated full range: ${Math.round(fullRangeKm)} km`
                      : "Run Range Prediction & set full range in Profile",
        };

        const batteryHealth: MetricCard = {
            title: "Battery health (est.)",
            value:
                healthPct != null ? `${Math.round(healthPct)}` : "—",
            unit: "%",
            icon: "Battery",
            subtitle:
                healthPct != null
                    ? "vs Profile full range (normalized to 100% SOC)"
                    : "Needs prediction + Profile full range",
        };

        const formatYearlyTons = (t: number) =>
            Number.isInteger(t) ? String(t) : t.toFixed(1);

        const co2Saved: MetricCard = {
            title: "CO₂ Saved This Year",
            value:
                co2Hydrated && co2Last
                    ? formatYearlyTons(co2Last.yearlyTons)
                    : "—",
            unit: "tons",
            icon: "Leaf",
            subtitle:
                co2Hydrated && co2Last
                    ? `vs ${co2Last.iceType} ICE · ${Math.round(co2Last.monthlyDistanceKm)} km/mo`
                    : "Run CO₂ Savings to estimate",
        };

        return [predictedRange, batteryHealth, co2Saved, ...overviewMetricsSecondary];
    }, [
        profile.vehicle.range,
        rangeHydrated,
        predictedRangeKm,
        lastInputs,
        co2Hydrated,
        co2Last,
    ]);

    const monthlyComparison = useMemo(
        () =>
            computeMonthlyFuelComparison({
                monthlyKm: profile.vehicle.averageMonthlyKm,
                batteryKwh: profile.vehicle.batteryCapacity,
                fullRangeKm: profile.vehicle.range,
                costPerKwh: profile.vehicle.costPerUnit,
            }),
        [
            profile.vehicle.averageMonthlyKm,
            profile.vehicle.batteryCapacity,
            profile.vehicle.range,
            profile.vehicle.costPerUnit,
        ]
    );

    return (
        <div className="space-y-8">
            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Welcome back, {greetName} 👋</h2>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s an overview of your EV performance analytics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                        <Car className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                            {profile.vehicle.model?.trim()
                                ? profile.vehicle.model
                                : "Set vehicle in Profile"}
                        </span>
                    </div>
                    {/* <Badge variant="success" className="gap-1">
                        <PlugZap className="h-3 w-3" />
                        Connected
                    </Badge> */}
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {overviewMetrics.map((metric) => (
                    <Card
                        key={metric.title}
                        className="relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-primary/10 transition-colors" />
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-muted-foreground text-sm font-medium">
                                    {metric.title}
                                </span>
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    {iconMap[metric.icon]}
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{metric.value}</span>
                                <span className="text-lg text-muted-foreground font-medium">
                                    {metric.unit}
                                </span>
                            </div>
                            {metric.subtitle ? (
                                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                                    {metric.subtitle}
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>
                ))}
                <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-primary/10 transition-colors" />
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground text-sm font-medium">
                                Monthly comparison
                            </span>
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <IndianRupee className="h-5 w-5" />
                            </div>
                        </div>
                        {monthlyComparison ? (
                            <div className="space-y-3">
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm text-muted-foreground">EV cost</span>
                                    <span className="text-xl font-bold tabular-nums">
                                        {formatRupeesInr(monthlyComparison.evMonthly)}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-sm text-muted-foreground">Petrol cost</span>
                                    <span className="text-xl font-bold tabular-nums">
                                        {formatRupeesInr(monthlyComparison.petrolMonthly)}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 border-t border-border/60 pt-3">
                                    <span className="text-sm font-medium text-primary">Savings</span>
                                    <span className="text-2xl font-bold tabular-nums text-primary">
                                        {formatRupeesInr(monthlyComparison.savings)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Set full range, battery (kWh), monthly km, and ₹/kWh in Profile to
                                estimate EV vs petrol for your driving.
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                            Petrol baseline: {DEFAULT_PETROL_MILEAGE_KM_PER_L} km/l ·{" "}
                            {formatRupeesInr(DEFAULT_PETROL_PRICE_PER_L)}/l
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Battery Health Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Battery className="h-5 w-5 text-primary" />
                            Battery Health Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={batteryHealthTrend}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(150 12% 20% / 0.5)"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs"
                                        tick={{ fill: chartColors.tick }}
                                        axisLine={{ stroke: chartColors.axis }}
                                    />
                                    <YAxis
                                        domain={[88, 100]}
                                        className="text-xs"
                                        tick={{ fill: chartColors.tick }}
                                        axisLine={{ stroke: chartColors.axis }}
                                    />
                                    <Tooltip
                                        contentStyle={chartColors.tooltip}
                                        labelStyle={{ color: chartColors.label }}
                                        itemStyle={{ color: chartColors.green }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="health"
                                        stroke={chartColors.green}
                                        strokeWidth={3}
                                        dot={{ fill: chartColors.green, r: 4 }}
                                        activeDot={{ r: 6, fill: chartColors.green }}
                                        name="Battery Health (%)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* ICE vs EV Emissions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-primary" />
                            ICE vs EV Emissions (tons CO₂)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={emissionsComparison}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(150 12% 20% / 0.5)"
                                    />
                                    <XAxis
                                        dataKey="category"
                                        className="text-xs"
                                        tick={{ fill: chartColors.tick }}
                                        axisLine={{ stroke: chartColors.axis }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: chartColors.tick }}
                                        axisLine={{ stroke: chartColors.axis }}
                                    />
                                    <Tooltip
                                        contentStyle={chartColors.tooltip}
                                        labelStyle={{ color: chartColors.label }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="ICE"
                                        fill={chartColors.red}
                                        radius={[8, 8, 0, 0]}
                                        name="ICE Vehicle"
                                    />
                                    <Bar
                                        dataKey="EV"
                                        fill={chartColors.green}
                                        radius={[8, 8, 0, 0]}
                                        name="Electric Vehicle"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            
        </div>
    );
}
