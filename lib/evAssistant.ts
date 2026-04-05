import { openai } from "./openai";
import { systemPrompt } from "./systemPrompt";
import { 
    overviewMetrics, 
    batteryHealthTrend, 
    rangeVsSpeed, 
    degradationProjection 
} from "./mock-data";

export async function askEVAssistant(chatHistory: { role: "user" | "assistant" | "system", content: string }[]) {
    const datasetContext = `User Name: Raj barnawal
User's EV Data Context:
- Overview Metrics: ${JSON.stringify(overviewMetrics)}
- Battery Health Trend: ${JSON.stringify(batteryHealthTrend)}
- Range Vs Speed: ${JSON.stringify(rangeVsSpeed)}
- Degradation Projection: ${JSON.stringify(degradationProjection)}
`;

    // Ensure system prompts are at the top, then append the rest of the chat history
    const messages: any[] = [
        { role: "system", content: systemPrompt },
        { role: "system", content: datasetContext },
        ...chatHistory.map(m => ({ role: m.role, content: m.content }))
    ];
    
    // Using parameter: gpt-5-mini
    const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: messages
    });
    
    return response.choices[0].message.content || "I couldn't process that request.";
}
