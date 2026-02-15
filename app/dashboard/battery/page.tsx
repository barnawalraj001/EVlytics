"use client";

import React from "react";
import { Battery, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { degradationProjection } from "@/lib/mock-data";
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
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Battery className="h-6 w-6 text-primary" />
                    Battery Health
                </h2>
                <p className="text-muted-foreground mt-1">
                    Monitor your battery condition and degradation forecast.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Circular Progress */}
                <Card className="lg:col-span-1">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                        <CircularProgress value={92} />

                        <div className="mt-6 space-y-3 w-full">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                <span className="text-sm text-muted-foreground">
                                    Current Capacity
                                </span>
                                <span className="text-sm font-semibold">68.1 kWh</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                                <span className="text-sm text-muted-foreground">
                                    Original Capacity
                                </span>
                                <span className="text-sm font-semibold">74.0 kWh</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10">
                                <span className="text-sm text-muted-foreground">
                                    Est. Replacement
                                </span>
                                <Badge variant="success">2.5 years</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Banner */}
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-400">
                                    Battery in Good Condition
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    Your battery health is at 92%, which is excellent for a vehicle
                                    with 14,500 km driven. At the current rate of degradation, your
                                    battery is estimated to retain 80% capacity for another{" "}
                                    <strong className="text-foreground">2.5 years</strong>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Degradation Info */}
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

            {/* Degradation Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Battery className="h-5 w-5 text-primary" />
                        Battery Degradation Projection (8-Year Forecast)
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
