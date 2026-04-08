// ── Types ──────────────────────────────────────────────────────
export interface MetricCard {
    title: string;
    value: string;
    unit: string;
    icon: string;
    /** Optional small line under the value (e.g. SOC, profile context). */
    subtitle?: string;
}

export interface BatteryHealthPoint {
    month: string;
    health: number;
}

export interface EmissionsComparison {
    category: string;
    ICE: number;
    EV: number;
}

export interface RangeVsSpeed {
    speed: number;
    range: number;
}

export interface DegradationPoint {
    year: string;
    capacity: number;
}

export interface ChatMessage {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
}

// ── Overview: secondary cards (demo) + LLM snapshot ────────────
/** Live CO₂ card is built on the dashboard from persisted CO₂ Savings results. */
export const overviewMetricsSecondary: MetricCard[] = [];

/** Passed to the assistant API as a small static slice (live values are in storesContext). */
export const overviewMetrics: MetricCard[] = overviewMetricsSecondary;

// ── Battery Health Over Time ───────────────────────────────────
export const batteryHealthTrend: BatteryHealthPoint[] = [
    { month: "Jan", health: 98 },
    { month: "Feb", health: 97.5 },
    { month: "Mar", health: 97 },
    { month: "Apr", health: 96.5 },
    { month: "May", health: 96 },
    { month: "Jun", health: 95.5 },
    { month: "Jul", health: 95 },
    { month: "Aug", health: 94.5 },
    { month: "Sep", health: 94 },
    { month: "Oct", health: 93.5 },
    { month: "Nov", health: 93 },
    { month: "Dec", health: 92 },
];

// ── ICE vs EV Emissions ────────────────────────────────────────
export const emissionsComparison: EmissionsComparison[] = [
    { category: "Manufacturing", ICE: 6, EV: 10 },
    { category: "Fuel / Energy", ICE: 40, EV: 12 },
    { category: "Maintenance", ICE: 8, EV: 3 },
    { category: "Lifetime Total", ICE: 54, EV: 25 },
];

// ── Range vs Speed ─────────────────────────────────────────────
export const rangeVsSpeed: RangeVsSpeed[] = [
    { speed: 30, range: 420 },
    { speed: 50, range: 380 },
    { speed: 70, range: 340 },
    { speed: 90, range: 295 },
    { speed: 110, range: 250 },
    { speed: 130, range: 200 },
    { speed: 150, range: 165 },
];

// ── Battery Degradation Projection ────────────────────────────
export const degradationProjection: DegradationPoint[] = [
    { year: "Year 0", capacity: 100 },
    { year: "Year 1", capacity: 95 },
    { year: "Year 2", capacity: 90 },
    { year: "Year 3", capacity: 85 },
    { year: "Year 4", capacity: 80 },
    { year: "Year 5", capacity: 75 },
];

// ── CO₂ Monthly Data ──────────────────────────────────────────
export const co2MonthlyComparison: EmissionsComparison[] = [
    { category: "Nov", ICE: 215, EV: 50 },
    { category: "Dec", ICE: 230, EV: 52 },
    { category: "Jan", ICE: 180, EV: 45 },
    { category: "Feb", ICE: 165, EV: 42 },
    { category: "Mar", ICE: 190, EV: 48 },

];

// ── Sidebar Navigation ────────────────────────────────────────
export interface NavItem {
    label: string;
    href: string;
    icon: string;
}

export const sidebarNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Profile", href: "/dashboard/profile", icon: "User" },
    { label: "Range Prediction", href: "/dashboard/range", icon: "Gauge" },
    { label: "Battery Health", href: "/dashboard/battery", icon: "Battery" },
    { label: "CO₂ Savings", href: "/dashboard/savings", icon: "Leaf" },
    { label: "EV Assistant", href: "/dashboard/assistant", icon: "MessageSquare" },
];

// ── Features for Landing ──────────────────────────────────────
export interface Feature {
    title: string;
    description: string;
    icon: string;
}

export const landingFeatures: Feature[] = [
    {
        title: "Range Prediction",
        description:
            "AI-powered range estimation based on real-time driving conditions, temperature, speed, and accessory usage for accurate trip planning.",
        icon: "Gauge",
    },
    {
        title: "Battery Health Forecast",
        description:
            "Monitor your battery degradation trends with predictive analytics. Know exactly when to plan for maintenance or replacement.",
        icon: "Battery",
    },
    {
        title: "CO₂ Savings Calculator",
        description:
            "Track your environmental impact with detailed carbon savings reports. See how much CO₂ you've saved compared to traditional vehicles.",
        icon: "Leaf",
    },
];

export interface HowItWorksStep {
    step: number;
    title: string;
    description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
    {
        step: 1,
        title: "Connect Your Vehicle",
        description:
            "Link your EV through our secure platform to start receiving real-time data and analytics about your vehicle's performance.",
    },
    {
        step: 2,
        title: "AI Analyzes Your Data",
        description:
            "Our machine learning models process your driving patterns, charging habits, and environmental factors to generate personalized insights.",
    },
    {
        step: 3,
        title: "Get Actionable Insights",
        description:
            "Receive predictions, recommendations, and optimizations tailored to your driving style to maximize range and battery life.",
    },
];
