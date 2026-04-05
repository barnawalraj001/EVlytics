"use client";

import React, { useState } from "react";
import {
    Leaf,
    TreePine,
    Factory,
    Info,
    Fuel,
    Route,
    BarChart3,
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
import { co2MonthlyComparison } from "@/lib/mock-data";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const PETROL_G_PER_KM = 120;
const DIESEL_G_PER_KM = 130;
const EV_G_PER_KM = 20;
const TREE_KG_CO2_PER_YEAR = 21.7;

type IceType = "petrol" | "diesel";

function getIceEmissionGPerKm(type: IceType): number {
    return type === "petrol" ? PETROL_G_PER_KM : DIESEL_G_PER_KM;
}

function calculateSavings(distanceKm: number, iceType: IceType) {
    const ice = getIceEmissionGPerKm(iceType);
    const monthlySavedKg = ((ice - EV_G_PER_KM) * distanceKm) / 1000;
    const yearlySavedTons = (monthlySavedKg * 12) / 1000;
    const trees = (monthlySavedKg * 12) / TREE_KG_CO2_PER_YEAR;

    return {
        monthlyKg: Math.round(monthlySavedKg),
        yearlyTons: Math.round(yearlySavedTons * 10) / 10,
        trees: Math.round(trees),
    };
}

export default function CO2SavingsPage() {
    const [distanceInput, setDistanceInput] = useState("1200");
    const [iceType, setIceType] = useState<IceType>("petrol");
    const [results, setResults] = useState<ReturnType<
        typeof calculateSavings
    > | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        const distance = parseFloat(distanceInput);
        if (Number.isNaN(distance) || distance <= 0) {
            setError("Enter a valid distance greater than 0 km.");
            setResults(null);
            return;
        }
        setResults(calculateSavings(distance, iceType));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    CO₂ Savings
                </h2>
                <p className="text-muted-foreground mt-1">
                    Calculate and track your environmental impact compared to traditional
                    vehicles.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg shadow-black/20">
                    <CardHeader>
                        <CardTitle>Calculate Your Savings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Route className="h-4 w-4 text-primary" />
                                Distance Driven Per Month
                            </Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="1200"
                                    value={distanceInput}
                                    onChange={(e) => setDistanceInput(e.target.value)}
                                    className="pr-12"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    km
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Fuel className="h-4 w-4 text-primary" />
                                Comparison ICE Vehicle Type
                            </Label>
                            <Select
                                value={iceType}
                                onValueChange={(v) => setIceType(v as IceType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vehicle type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="petrol">Petrol</SelectItem>
                                    <SelectItem value="diesel">Diesel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error ? (
                            <p className="text-sm text-red-400">{error}</p>
                        ) : null}

                        <Button
                            className="w-full mt-2 gap-2 bg-gradient-to-r from-[#00C853] to-emerald-600 hover:opacity-95 text-white border-0 shadow-lg shadow-primary/20"
                            size="lg"
                            type="button"
                            onClick={handleCalculate}
                        >
                            <Leaf className="h-5 w-5" />
                            Calculate Savings
                        </Button>

                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                            Based on average emission factors. Actual values may vary.
                        </p>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {results ? (
                        <>
                            <Card className="border-primary/30 bg-card/40 backdrop-blur-sm glow-green shadow-xl shadow-black/20">
                                <CardContent className="p-8">
                                    <div className="text-center mb-6">
                                        <Badge variant="success" className="mb-4">
                                            Environmental Impact
                                        </Badge>
                                        <h3 className="text-2xl font-bold">
                                            Your CO₂ Savings Summary
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-accent/30 border border-border/40">
                                            <Leaf className="h-6 w-6 text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold gradient-text">
                                                {results.monthlyKg} kg
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Monthly CO₂ Saved
                                            </p>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-accent/30 border border-border/40">
                                            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold gradient-text">
                                                {results.yearlyTons} tons
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Yearly CO₂ Saved
                                            </p>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <TreePine className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-emerald-400">
                                                {results.trees}{" "}
                                                <span className="text-lg" aria-hidden>
                                                    🌳
                                                </span>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Equivalent Trees Planted
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card/30">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold mb-2">
                                                How we calculate savings
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                CO₂ savings are calculated by comparing the emissions of
                                                a comparable ICE vehicle (avg. {PETROL_G_PER_KM}g CO₂/km
                                                for petrol, {DIESEL_G_PER_KM}g CO₂/km for diesel)
                                                against your EV&apos;s grid-charged emissions (avg.{" "}
                                                {EV_G_PER_KM}g CO₂/km). Tree equivalents are based on the
                                                average absorption rate of {TREE_KG_CO2_PER_YEAR} kg CO₂
                                                per tree per year.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="border-dashed border-2 border-border/60 bg-card/20">
                            <CardContent className="p-12 text-center">
                                <Leaf className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    Enter your driving details and click &quot;Calculate Savings&quot; to
                                    see your environmental impact.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Factory className="h-5 w-5 text-primary" />
                        Monthly Emissions Comparison: ICE vs EV (kg CO₂)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={co2MonthlyComparison}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border/50"
                                />
                                <XAxis
                                    dataKey="category"
                                    tick={{ fill: "hsl(145 10% 58%)" }}
                                    axisLine={{ stroke: "hsl(150 12% 20%)" }}
                                />
                                <YAxis
                                    tick={{ fill: "hsl(145 10% 58%)" }}
                                    axisLine={{ stroke: "hsl(216 34% 17%)" }}
                                    label={{
                                        value: "kg CO₂",
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
                                />
                                <Legend />
                                <Bar
                                    dataKey="ICE"
                                    fill="hsl(0 84% 60%)"
                                    radius={[8, 8, 0, 0]}
                                    name="ICE Vehicle"
                                />
                                <Bar
                                    dataKey="EV"
                                    fill="hsl(142 72% 50%)"
                                    radius={[8, 8, 0, 0]}
                                    name="Electric Vehicle"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
