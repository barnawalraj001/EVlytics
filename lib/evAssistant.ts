import { buildStoresContextForLlm } from "@/stores/llm-context";

export type AssistantChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

/**
 * Calls the server-side assistant API. OpenAI runs only on the server — never bundle the key in the browser.
 */
export async function askEVAssistant(
    chatHistory: AssistantChatMessage[]
): Promise<string> {
    const storesContext = buildStoresContextForLlm();

    const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: chatHistory,
            storesContext,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            typeof err.error === "string" ? err.error : `HTTP ${res.status}`
        );
    }

    const data = (await res.json()) as { reply?: string };
    if (typeof data.reply !== "string") {
        throw new Error("Invalid assistant response");
    }
    return data.reply;
}
