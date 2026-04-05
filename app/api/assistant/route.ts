import { NextResponse } from "next/server";
import OpenAI from "openai";
import { systemPrompt } from "@/lib/systemPrompt";
import {
    overviewMetrics,
    batteryHealthTrend,
    rangeVsSpeed,
    degradationProjection,
} from "@/lib/mock-data";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant" | "system";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages = body.messages as { role: ChatRole; content: string }[] | undefined;
        const storesContext =
            typeof body.storesContext === "string" ? body.storesContext : "";

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Invalid request: messages required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server missing OPENAI_API_KEY" },
                { status: 503 }
            );
        }

        const openai = new OpenAI({ apiKey });

        const datasetContext = `${storesContext || "No client store snapshot."}

User's EV Data Context (demo / chart data):
- Overview Metrics: ${JSON.stringify(overviewMetrics)}
- Battery Health Trend: ${JSON.stringify(batteryHealthTrend)}
- Range Vs Speed: ${JSON.stringify(rangeVsSpeed)}
- Degradation Projection: ${JSON.stringify(degradationProjection)}
`;

        const payload: { role: string; content: string }[] = [
            { role: "system", content: systemPrompt },
            { role: "system", content: datasetContext },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: payload as never,
        });

        const reply =
            response.choices[0]?.message?.content ||
            "I couldn't process that request.";

        return NextResponse.json({ reply });
    } catch (e) {
        console.error("api/assistant", e);
        return NextResponse.json(
            { error: "Assistant request failed" },
            { status: 500 }
        );
    }
}
