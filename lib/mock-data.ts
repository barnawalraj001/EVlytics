// ── Types ──────────────────────────────────────────────────────
export interface MetricCard {
    title: string;
    value: string;
    unit: string;
    icon: string;
    trend: string;
    trendDirection: "up" | "down";
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

// ── Overview Metrics ───────────────────────────────────────────
export const overviewMetrics: MetricCard[] = [
    {
        title: "Current Estimated Range",
        value: "320",
        unit: "km",
        icon: "Gauge",
        trend: "+5% from last week",
        trendDirection: "up",
    },
    {
        title: "Battery Health",
        value: "92",
        unit: "%",
        icon: "Battery",
        trend: "-0.3% this month",
        trendDirection: "down",
    },
    {
        title: "CO₂ Saved This Year",
        value: "1.2",
        unit: "tons",
        icon: "Leaf",
        trend: "+18% vs last year",
        trendDirection: "up",
    },
    {
        title: "Total Distance Driven",
        value: "14,500",
        unit: "km",
        icon: "Route",
        trend: "+1,200 km this month",
        trendDirection: "up",
    },
];

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
    { year: "Year 1", capacity: 97 },
    { year: "Year 2", capacity: 94 },
    { year: "Year 3", capacity: 92 },
    { year: "Year 4", capacity: 89 },
    { year: "Year 5", capacity: 86 },
    { year: "Year 6", capacity: 83 },
    { year: "Year 7", capacity: 80 },
    { year: "Year 8", capacity: 78 },
];

// ── CO₂ Monthly Data ──────────────────────────────────────────
export const co2MonthlyComparison: EmissionsComparison[] = [
    { category: "Jan", ICE: 180, EV: 45 },
    { category: "Feb", ICE: 165, EV: 42 },
    { category: "Mar", ICE: 190, EV: 48 },
    { category: "Apr", ICE: 175, EV: 44 },
    { category: "May", ICE: 200, EV: 50 },
    { category: "Jun", ICE: 185, EV: 46 },
];

// ── Chat Messages ─────────────────────────────────────────────
export const chatMessages: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        content:
            "Hello! I'm your EV Assistant powered by AI. I can help you with range optimization, battery care tips, charging strategies, and sustainability insights. How can I help you today?",
        timestamp: "10:00 AM",
    },
    {
        id: 2,
        role: "user",
        content: "How can I improve my EV range?",
        timestamp: "10:01 AM",
    },
    {
        id: 3,
        role: "assistant",
        content:
            "Great question! Here are some proven strategies to maximize your EV range:\n\n1. **Reduce Speed** – Driving at 90 km/h instead of 120 km/h can increase range by up to 20%.\n2. **Minimize AC Usage** – Using climate control sparingly can save 10-15% of battery.\n3. **Use Regenerative Braking** – Maximize energy recovery during deceleration.\n4. **Check Tire Pressure** – Properly inflated tires reduce rolling resistance.\n5. **Plan Routes** – Use elevation-aware navigation to avoid unnecessary climbs.\n\nReducing speed and minimizing AC usage alone can increase range by up to 12%.",
        timestamp: "10:01 AM",
    },
    {
        id: 4,
        role: "user",
        content: "What about battery health? How do I keep it in good condition?",
        timestamp: "10:03 AM",
    },
    {
        id: 5,
        role: "assistant",
        content:
            "Battery longevity depends on a few key habits:\n\n• **Avoid 100% charge regularly** – Keep daily charging between 20-80%.\n• **Minimize fast charging** – DC fast charging generates heat, which accelerates degradation.\n• **Avoid extreme temperatures** – Park in shade during summer and use preconditioning in winter.\n• **Drive smoothly** – Aggressive acceleration draws more current and creates heat.\n\nYour current battery health is at **92%**, which is excellent for your vehicle's age. Based on your usage patterns, I estimate your battery will retain 80% capacity for another **2.5 years**.",
        timestamp: "10:03 AM",
    },
];

// ── Sidebar Navigation ────────────────────────────────────────
export interface NavItem {
    label: string;
    href: string;
    icon: string;
}

export const sidebarNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
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
