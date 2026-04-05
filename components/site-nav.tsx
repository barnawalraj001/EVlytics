"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
] as const;

export function SiteNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!open) return;
        const onResize = () => {
            if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [open]);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold gradient-text">EVlytics</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {links.map((item) => {
                                const isAbout = item.href === "/about";
                                const active = isAbout && pathname === "/about";
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "text-sm transition-colors",
                                            active
                                                ? "text-foreground font-medium"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <Link href="/dashboard">
                                <Button size="sm" className="gap-2">
                                    Try Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex md:hidden items-center gap-2">
                            <Link href="/dashboard">
                                <Button size="sm" className="gap-1.5 px-3">
                                    Dashboard
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                                aria-expanded={open}
                                aria-label={open ? "Close menu" : "Open menu"}
                                onClick={() => setOpen((v) => !v)}
                            >
                                {open ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {open ? (
                <div
                    className="fixed inset-0 top-16 z-40 md:hidden glass border-b border-border/40 animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
                        {links.map((item) => {
                            const isAbout = item.href === "/about";
                            const active = isAbout && pathname === "/about";
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "py-3 px-3 rounded-xl text-sm transition-colors",
                                        active
                                            ? "bg-primary/10 text-foreground font-medium"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </>
    );
}
