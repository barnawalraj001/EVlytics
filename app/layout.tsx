import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "EVlytics AI Powered EV Intelligence Platform",
    description:
        "Smart insights for your electric vehicle. Range prediction, battery health forecasting, and CO₂ savings tracking powered by AI.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body className="min-h-screen bg-background antialiased">
                {children}
            </body>
        </html>
    );
}
