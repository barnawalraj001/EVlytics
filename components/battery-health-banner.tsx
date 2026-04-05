"use client";

import { CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BatteryHealthTier } from "@/lib/battery-health";
import { getTierCopy } from "@/lib/battery-health";

function TierBody({ tier, health }: { tier: BatteryHealthTier; health: number }) {
    const h = (
        <strong className="text-foreground">{health}%</strong>
    );

    switch (tier) {
        case "excellent":
            return (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your battery health is at {h}, which indicates excellent performance and minimal
                    degradation. The battery is operating close to its original capacity. At this
                    rate, it is expected to remain above 80% health for the next{" "}
                    <strong className="text-foreground">3-4 years</strong>.
                </p>
            );
        case "good":
            return (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your battery health is at {h}, which is considered healthy for regular usage.
                    Some natural degradation has occurred, but performance remains reliable. With
                    proper charging habits, the battery can maintain efficient performance for{" "}
                    <strong className="text-foreground">2-3 years</strong>.
                </p>
            );
        case "moderate":
            return (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your battery health is at {h}. Noticeable degradation has started, which may
                    slightly affect range and efficiency. Consider optimizing charging patterns and
                    avoiding deep discharge. The battery may drop below optimal performance in about{" "}
                    <strong className="text-foreground">1-2 years</strong>.
                </p>
            );
        case "aging":
            return (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your battery health is at {h}. Performance degradation is now significant and may
                    impact daily usability. Reduced range and longer charging times can be expected.
                    It is advisable to start planning for maintenance or replacement within{" "}
                    <strong className="text-foreground">6-12 months</strong>.
                </p>
            );
        case "poor":
            return (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your battery health is at {h}. The battery has degraded considerably, leading to
                    noticeable drops in range and efficiency. Frequent charging may be required.
                    Replacement or servicing should be considered soon to maintain reliability.
                </p>
            );
        case "critical":
        default:
            return (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Your battery health is at {h}. The battery is in critical condition and may not
                    deliver reliable performance. Severe range loss and efficiency issues are
                    expected. Immediate battery replacement is strongly recommended.
                </p>
            );
    }
}

export function BatteryHealthBanner({
    healthPercent,
    tier,
}: {
    healthPercent: number;
    tier: BatteryHealthTier;
}) {
    const meta = getTierCopy(tier);
    const useWarning =
        tier === "moderate" || tier === "aging" || tier === "poor" || tier === "critical";

    return (
        <div
            className={cn(
                "rounded-xl border p-6 flex items-start gap-4",
                meta.cardClassName
            )}
        >
            <div
                className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    meta.iconWrapClassName
                )}
            >
                {useWarning ? (
                    <AlertTriangle
                        className={cn("h-5 w-5", meta.titleClassName)}
                    />
                ) : (
                    <CheckCircle className={cn("h-5 w-5", meta.titleClassName)} />
                )}
            </div>
            <div>
                <h3 className={cn("font-semibold", meta.titleClassName)}>{meta.title}</h3>
                <TierBody tier={tier} health={Math.round(healthPercent)} />
            </div>
        </div>
    );
}
