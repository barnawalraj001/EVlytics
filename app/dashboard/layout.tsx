"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Gauge,
    Battery,
    Leaf,
    MessageSquare,
    Zap,
    ChevronLeft,
    ChevronRight,
    User,
    Settings,
    LogOut,
    Bell,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
    Gauge: <Gauge className="h-5 w-5" />,
    Battery: <Battery className="h-5 w-5" />,
    Leaf: <Leaf className="h-5 w-5" />,
    MessageSquare: <MessageSquare className="h-5 w-5" />,
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-background">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full bg-card border-r border-border/50 flex flex-col transition-all duration-300 ease-in-out",
                    collapsed ? "w-[72px]" : "w-64",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-border/50">
                    <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold gradient-text whitespace-nowrap">
                            EVlytics
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {sidebarNavItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/15 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                )}
                            >
                                <span className="flex-shrink-0">{iconMap[item.icon]}</span>
                                {!collapsed && (
                                    <span className="whitespace-nowrap">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse button */}
                <div className="hidden lg:flex p-3 border-t border-border/50">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center justify-center w-full py-2 rounded-xl hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 lg:hidden text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>
            </aside>

            {/* Main content area */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    collapsed ? "lg:pl-[72px]" : "lg:pl-64"
                )}
            >
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 h-16 bg-card/80 glass border-b border-border/50 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-semibold">
                                {sidebarNavItems.find(
                                    (item) =>
                                        pathname === item.href ||
                                        (item.href !== "/dashboard" && pathname.startsWith(item.href))
                                )?.label || "Dashboard"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-accent/50 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/60 to-emerald-600/60 flex items-center justify-center text-white text-sm font-semibold">
                                    R
                                </div>
                                {!collapsed && (
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium">Raj Barnawal</p>
                                        <p className="text-xs text-muted-foreground">
                                            raj@evlytics.io
                                        </p>
                                    </div>
                                )}
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 rounded-xl shadow-xl z-50 py-2">
                                        <div className="px-4 py-3 border-b border-border/50">
                                            <p className="text-sm font-medium">Raj Barnawal</p>
                                            <p className="text-xs text-muted-foreground">
                                                raj@evlytics.io
                                            </p>
                                        </div>
                                        <div className="py-1">
                                            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                                                <User className="h-4 w-4" />
                                                Profile
                                            </button>
                                            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </button>
                                        </div>
                                        <div className="border-t border-border/50 py-1">
                                            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
