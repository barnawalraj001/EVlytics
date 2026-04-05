"use client";

import React, { useState } from "react";
import {
    Gauge,
    Thermometer,
    Zap,
    Wind,
    Info,
    Loader2,
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
import { Badge } from "@/components/ui/badge";
import { rangeVsSpeed } from "@/lib/mock-data";
import { useRangePredictionStore } from "@/stores/range-prediction-store";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

const RANGE_PREDICTION_API_BASE =
    process.env.NEXT_PUBLIC_RANGE_PREDICTION_API_URL ??
    "https://evlyticsbackend-production.up.railway.app";

const AC_USAGE_MAP = { low: 0, medium: 1, high: 2 } as const;
type AcUsageKey = keyof typeof AC_USAGE_MAP;

async function fetchPredictedRange(body: {
    SOC: number;
    Temperature: number;
    Speed: number;
    AC_Usage: number;
}): Promise<number> {
    const res = await fetch(`${RANGE_PREDICTION_API_BASE.replace(/\/$/, "")}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
        let message = res.statusText;
        if (typeof data === "object" && data !== null && "detail" in data) {
            const d = (data as { detail: unknown }).detail;
            message = Array.isArray(d) ? JSON.stringify(d) : String(d);
        }
        throw new Error(message || `Request failed (${res.status})`);
    }
    if (
        typeof data === "object" &&
        data !== null &&
        "predicted_range_km" in data &&
        typeof (data as { predicted_range_km: unknown }).predicted_range_km === "number"
    ) {
        return (data as { predicted_range_km: number }).predicted_range_km;
    }
    throw new Error("Unexpected response from prediction service");
}

export default function RangePredictionPage() {
    const [soc, setSoc] = useState("85");
    const [temperature, setTemperature] = useState("22");
    const [speed, setSpeed] = useState("90");
    const [acUsage, setAcUsage] = useState<AcUsageKey>("medium");
    const [loading, setLoading] = useState(false);

    const predictedKm = useRangePredictionStore((s) => s.predictedRangeKm);
    const setPrediction = useRangePredictionStore((s) => s.setPrediction);

    const showResult = predictedKm !== null;

    async function handlePredict() {
        const socNum = Number.parseFloat(soc);
        const tempNum = Number.parseFloat(temperature);
        const speedNum = Number.parseFloat(speed);

        if (Number.isNaN(socNum) || socNum < 1 || socNum > 100) {
            toast.error("State of charge must be between 1 and 100%.");
            return;
        }
        if (Number.isNaN(tempNum)) {
            toast.error("Enter a valid outside temperature (°C).");
            return;
        }
        if (Number.isNaN(speedNum) || speedNum < 0) {
            toast.error("Enter a valid average speed (km/h).");
            return;
        }

        setLoading(true);
        try {
            const km = await fetchPredictedRange({
                SOC: Math.round(socNum),
                Temperature: tempNum,
                Speed: speedNum,
                AC_Usage: AC_USAGE_MAP[acUsage],
            });
            setPrediction(km, {
                soc: Math.round(socNum),
                temperature: tempNum,
                speed: speedNum,
                acUsageLabel: acUsage,
                acUsageCode: AC_USAGE_MAP[acUsage],
            });
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Could not get prediction.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    const displayRange =
        predictedKm !== null
            ? predictedKm % 1 === 0
                ? `${Math.round(predictedKm)}`
                : predictedKm.toFixed(1)
            : "";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Gauge className="h-6 w-6 text-primary" />
                    Range Prediction
                </h2>
                <p className="text-muted-foreground mt-1">
                    Estimate your EV range based on current driving conditions.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Driving Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Current State of Charge (SOC)
                            </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="85"
                                    min={1}
                                    max={100}
                                    value={soc}
                                    onChange={(e) => setSoc(e.target.value)}
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    %
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4 text-primary" />
                                Outside Temperature
                            </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="22"
                                    value={temperature}
                                    onChange={(e) => setTemperature(e.target.value)}
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    °C
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Gauge className="h-4 w-4 text-primary" />
                                Average Speed
                            </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="90"
                                    min={0}
                                    value={speed}
                                    onChange={(e) => setSpeed(e.target.value)}
                                    className="pr-12"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    km/h
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Wind className="h-4 w-4 text-primary" />
                                AC Usage
                            </Label>
                            <Select
                                value={acUsage}
                                onValueChange={(v: string) => setAcUsage(v as AcUsageKey)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select AC usage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full mt-4"
                            size="lg"
                            onClick={handlePredict}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            ) : (
                                <Gauge className="h-5 w-5 mr-2" />
                            )}
                            Predict Range
                        </Button>
                    </CardContent>
                </Card>

                {/* Result */}
                <div className="space-y-6">
                    {showResult ? (
                        <Card className="border-primary/30 glow-green">
                            <CardContent className="p-8 text-center">
                                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 mb-6">
                                    <Gauge className="h-10 w-10 text-primary" />
                                </div>
                                <div className="mb-2">
                                    <Badge variant="success" className="mb-4">
                                        AI Prediction
                                    </Badge>
                                </div>
                                <h3 className="text-5xl font-bold gradient-text mb-2">
                                    {displayRange} km
                                </h3>
                                <p className="text-lg text-muted-foreground">
                                    Predicted Range
                                </p>
                                <div className="mt-6 p-4 rounded-xl bg-accent/30 text-sm text-muted-foreground leading-relaxed">
                                    <Info className="h-4 w-4 inline mr-2 text-primary" />
                                    Based on your inputs, the model estimates a range of {displayRange}{" "}
                                    km. Adjust speed, temperature conditions, or AC level and run
                                    predict again to compare scenarios.
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2">
                            <CardContent className="p-12 text-center">
                                <Gauge className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    Fill in the driving conditions and click &quot;Predict Range&quot; to
                                    see your estimated range.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Helpful tips */}
                    <Card>
                        <CardContent className="p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                Range Optimization Tips
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    Maintaining speed at 80-90 km/h offers optimal range efficiency
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    Cold temperatures below 5°C can reduce range by up to 30%
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    Using regenerative braking recovers up to 15% of energy
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    Pre-conditioning while plugged in saves battery for driving
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Range vs Speed Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-primary" />
                        Projected Range vs Speed
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={rangeVsSpeed}>
                                <defs>
                                    <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="hsl(142 72% 50%)"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="hsl(142 70% 45%)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border/50"
                                />
                                <XAxis
                                    dataKey="speed"
                                    tick={{ fill: "hsl(145 10% 58%)" }}
                                    axisLine={{ stroke: "hsl(150 12% 20%)" }}
                                    label={{
                                        value: "Speed (km/h)",
                                        position: "insideBottom",
                                        offset: -5,
                                        fill: "hsl(145 10% 58%)",
                                    }}
                                />
                                <YAxis
                                    tick={{ fill: "hsl(145 10% 58%)" }}
                                    axisLine={{ stroke: "hsl(150 12% 20%)" }}
                                    label={{
                                        value: "Range (km)",
                                        angle: -90,
                                        position: "insideLeft",
                                        fill: "hsl(145 10% 58%)",
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(152 14% 13%)",
                                        border: "1px solid hsl(150 12% 20%)",
                                        borderRadius: "12px",
                                        padding: "12px",
                                    }}
                                    labelStyle={{ color: "hsl(140 20% 92%)" }}
                                    itemStyle={{ color: "hsl(142 70% 45%)" }}
                                    formatter={(value: number) => [`${value} km`, "Range"]}
                                    labelFormatter={(label) => `Speed: ${label} km/h`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="range"
                                    stroke="hsl(142 70% 45%)"
                                    strokeWidth={3}
                                    fill="url(#rangeGradient)"
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
