"use client";

import React from "react";
import {
    Gauge,
    Battery,
    Leaf,
    Route,
    TrendingUp,
    TrendingDown,
    Zap,
    Car,
    Timer,
    PlugZap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    overviewMetrics,
    batteryHealthTrend,
    emissionsComparison,
} from "@/lib/mock-data";
import { useProfile } from "@/hooks/use-profile";
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
    Route: <Route className="h-5 w-5" />,
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
    const greetName =
        profile.user.name?.trim().split(/\s+/)[0] ||
        profile.user.email?.split("@")[0] ||
        "there";

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
                            <div className="flex items-center gap-1 mt-3">
                                {metric.trendDirection === "up" ? (
                                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-amber-400" />
                                )}
                                <span
                                    className={`text-xs font-medium ${metric.trendDirection === "up"
                                        ? "text-emerald-400"
                                        : "text-amber-400"
                                        }`}
                                >
                                    {metric.trend}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick EV Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <Timer className="h-4 w-4" />, label: "Avg. Charge Time", value: "4.2 hrs", sub: "Level 2 AC" },
                    { icon: <PlugZap className="h-4 w-4" />, label: "Charging Cost/mo", value: "₹1,850", sub: "vs ₹8,400 fuel" },
                    { icon: <Car className="h-4 w-4" />, label: "Efficiency", value: "152 Wh/km", sub: "Last 30 days" },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-accent/30 border-border/30">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                {stat.icon}
                                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                            </div>
                            <p className="text-lg font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
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
