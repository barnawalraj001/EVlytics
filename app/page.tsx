import Link from "next/link";
import {
    Gauge,
    Battery,
    Leaf,
    ArrowRight,
    Zap,
    ChevronRight,
    Github,
    Twitter,
    Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingFeatures, howItWorksSteps } from "@/lib/mock-data";

const iconMap: Record<string, React.ReactNode> = {
    Gauge: <Gauge className="h-8 w-8" />,
    Battery: <Battery className="h-8 w-8" />,
    Leaf: <Leaf className="h-8 w-8" />,
};

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold gradient-text">EVlytics</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a
                                href="#features"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                How It Works
                            </a>
                            <Link href="/dashboard">
                                <Button size="sm" className="gap-2">
                                    Try Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                        <Zap className="h-4 w-4" />
                        AI-Powered EV Intelligence
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                        Smart Insights for Your{" "}
                        <span className="gradient-text">Electric Vehicle</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Harness the power of AI to predict your EV range, monitor battery
                        health, and track your CO₂ savings. Make smarter decisions for a
                        sustainable future.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="gap-2 text-base px-8">
                                Try Dashboard
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                                Learn More
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
                        {[
                            { value: "10K+", label: "Active Users" },
                            { value: "2.5M", label: "km Tracked" },
                            { value: "450T", label: "CO₂ Saved" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Powerful Features for{" "}
                            <span className="gradient-text">EV Owners</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to optimize your electric vehicle experience,
                            powered by cutting-edge AI and machine learning.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {landingFeatures.map((feature) => (
                            <div
                                key={feature.title}
                                className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
                                    {iconMap[feature.icon]}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-24 px-4 sm:px-6 lg:px-8 relative"
            >
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Get started in three simple steps and unlock the full potential of
                            your EV analytics.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorksSteps.map((step) => (
                            <div key={step.step} className="relative text-center p-8">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border-2 border-primary/20 text-primary text-2xl font-bold mb-6">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-emerald-500/5 border border-primary/20 p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Ready to Optimize Your EV?
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                                Join thousands of EV owners who are already using EVlytics to
                                maximize their driving experience.
                            </p>
                            <Link href="/dashboard">
                                <Button size="lg" className="gap-2 text-base px-8">
                                    Get Started Free
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-lg font-bold gradient-text">
                                    EVlytics
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                AI-powered intelligence platform for electric vehicle owners.
                                Smarter decisions for a sustainable future.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Dashboard
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Range Prediction
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Battery Health
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    CO₂ Savings
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    About
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Blog
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Careers
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Contact
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Privacy Policy
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Terms of Service
                                </li>
                                <li className="hover:text-foreground transition-colors cursor-pointer">
                                    Cookie Policy
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2026 EVlytics. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                            <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
