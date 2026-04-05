import Link from "next/link";
import { Github, Linkedin, Twitter, Zap } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-lg font-bold gradient-text">EVlytics</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            AI-powered intelligence platform for electric vehicle owners. Smarter
                            decisions for a sustainable future.
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
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-foreground transition-colors"
                                >
                                    About
                                </Link>
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
                    {/* <div className="flex items-center gap-4">
                        <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                        <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                        <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
