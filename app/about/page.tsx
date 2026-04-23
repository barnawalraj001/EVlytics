import type { Metadata } from "next";
import Link from "next/link";
import {
    Activity,
    ArrowRight,
    Battery,
    ChevronRight,
    Lightbulb,
    Linkedin,
    Route,
    Sparkles,
    User,
    Users,
    Wallet,
    Zap,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { LandingFooter } from "@/components/landing-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "About  EVlytics",
    description:
        "The story behind EVlytics: AI-powered insights for electric mobility. Meet our team and vision.",
};

const jumpLinks = [
    { href: "#story", label: "Our Story" },
    { href: "#problem", label: "The Problem" },
    { href: "#solution", label: "Our Solution" },
    { href: "#team", label: "Team" },
    { href: "#vision", label: "Vision" },
] as const;

const problems = [
    {
        title: "Lack of real-time range prediction",
        description:
            "Drivers need live, accurate estimatesnot static figures that ignore conditions and habits.",
        icon: Route,
    },
    {
        title: "No personalized driving insights",
        description:
            "Generic dashboards miss tailored recommendations that improve efficiency trip after trip.",
        icon: Activity,
    },
    {
        title: "Limited battery health awareness",
        description:
            "Degradation and long-term performance often stay opaque until problems show up.",
        icon: Battery,
    },
    {
        title: "No clear understanding of cost and CO₂ savings",
        description:
            "It’s hard to see real financial and environmental impact compared to a gas vehicle.",
        icon: Wallet,
    },
] as const;

const team = [
    {
        name: "Raj Barnawal",
        role: "AI & Full Stack Developer",
        linkedin: "https://www.linkedin.com/in/barnawalraj001/",
    },
    {
        name: "Ali Azhar Arman",
        role: "ML & Backend Engineer",
        linkedin: "https://www.linkedin.com/in/ali-azhar-arman-114494254/",
    },
    // {  
    //     name: "Kanchan Kiran",
    //     role: "Frontend Developer",
    //     linkedin: "https://www.linkedin.com/in/kanchankiran/",
    // },
    {
        name: "Lawmzuala Ralte",
        role: "UI Designer & Data Analyst",
        linkedin: "https://www.linkedin.com/feed",
    },
] as const;

function SectionShell({
    id,
    children,
    className,
    delayClass,
}: {
    id?: string;
    children: React.ReactNode;
    className?: string;
    delayClass?: string;
}) {
    return (
        <section
            id={id}
            className={cn(
                "scroll-mt-24 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 animate-fade-in-up",
                delayClass,
                className
            )}
        >
            {children}
        </section>
    );
}

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <SiteNav />

            {/* Hero */}
            <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(ellipse at center, hsl(142 72% 50% / 0.08) 0%, transparent 65%)",
                        }}
                    />
                </div>

                <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Sparkles className="h-4 w-4" />
                        Our mission
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                        About{" "}
                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            EVlytics
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
                        Building intelligent insights for the future of electric mobility
                    </p>
                    <p className="text-base text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
                        EVlytics is an AI-powered platform designed to help EV users make smarter
                        decisions through real-time insights, predictive analytics, and
                        sustainability tracking.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                        {jumpLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                            >
                                {link.label}
                                <ChevronRight className="h-3 w-3 opacity-60" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <SectionShell id="story" delayClass="delay-100">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Lightbulb className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold">
                            Our <span className="gradient-text">Story</span>
                        </h2>
                    </div>
                    <Card className="bg-card/50 border-border/50 shadow-xl shadow-black/20 hover:border-primary/25 transition-colors duration-300">
                        <CardContent className="p-6 sm:p-8 space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                With the rapid growth of electric vehicles, we noticed a key problem
                                 EV users lack real-time, personalized insights about their
                                vehicles. Most existing solutions provide static data, not
                                intelligent recommendations.
                            </p>
                            <p>
                                We built EVlytics to bridge this gap  combining AI and data
                                analytics to empower EV users with smarter, more informed decisions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </SectionShell>

            {/* Problem */}
            <SectionShell
                id="problem"
                className="relative"
                delayClass="delay-150"
            >
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent" />
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-10 text-center sm:text-left flex-col sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold">
                                Problem We&apos;re <span className="gradient-text">Solving</span>
                            </h2>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
                        {problems.map((item) => (
                            <Card
                                key={item.title}
                                className="group bg-card/40 border-border/50 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-black/10"
                            >
                                <CardContent className="p-6 flex gap-4">
                                    <div className="shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1.5">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </SectionShell>

            {/* Solution */}
            <SectionShell id="solution" delayClass="delay-200">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold">
                            Our <span className="gradient-text">Solution</span>
                        </h2>
                    </div>
                    <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-cyan-500/10 p-8 sm:p-10 shadow-xl shadow-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl" />
                        <p className="relative text-muted-foreground leading-relaxed text-base sm:text-lg">
                            EVlytics leverages AI models to analyze EV data and provide real-time
                            predictions, efficiency insights, and sustainability tracking.
                        </p>
                    </div>
                </div>
            </SectionShell>

            {/* Team */}
            <SectionShell id="team" className="relative" delayClass="delay-200">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-10">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
                            Meet the <span className="gradient-text">Team</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
                        {team.map((member) => (
                            <Card
                                key={member.name}
                                className="group text-center bg-card/40 border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/10"
                            >
                                <CardContent className="p-8 flex flex-col items-center">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/15 border-2 border-primary/25 flex items-center justify-center mb-5 shadow-inner group-hover:shadow-[0_0_24px_hsl(142_72%_50%/0.15)] transition-shadow duration-300">
                                        <User
                                            className="h-11 w-11 text-primary/80"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {member.role}
                                    </p>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </SectionShell>

            {/* Vision */}
            <SectionShell id="vision" delayClass="delay-200">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-3xl border border-border/50 bg-card/50 p-8 sm:p-12 text-center shadow-xl shadow-black/15 hover:border-primary/25 transition-colors duration-300">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-6">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            Our <span className="gradient-text">Vision</span>
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
                            We envision a future where every electric vehicle is powered by
                            intelligent insights  reducing range anxiety, improving efficiency, and
                            accelerating the transition to sustainable mobility.
                        </p>
                        <div className="mt-10">
                            <Link href="/dashboard">
                                <Button size="lg" className="gap-2">
                                    Try the dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </SectionShell>

            <LandingFooter />
        </div>
    );
}
