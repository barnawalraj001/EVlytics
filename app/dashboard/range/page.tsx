"use client";

import React, { useState } from "react";
import {
    Gauge,
    Thermometer,
    Zap,
    Wind,
    Info,
} from "lucide-react";
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

export default function RangePredictionPage() {
    const [showResult, setShowResult] = useState(false);

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
                                    defaultValue="85"
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
                                    defaultValue="22"
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
                                    defaultValue="90"
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
                            <Select defaultValue="medium">
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
                            onClick={() => setShowResult(true)}
                        >
                            <Gauge className="h-5 w-5 mr-2" />
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
                                    295 km
                                </h3>
                                <p className="text-lg text-muted-foreground">
                                    Predicted Range
                                </p>
                                <div className="mt-6 p-4 rounded-xl bg-accent/30 text-sm text-muted-foreground leading-relaxed">
                                    <Info className="h-4 w-4 inline mr-2 text-primary" />
                                    Based on your inputs, the AI model estimates a range of 295 km.
                                    Reducing speed by 20 km/h could increase range by approximately
                                    45 km. Lowering AC usage to &quot;Low&quot; could add another 15 km.
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
