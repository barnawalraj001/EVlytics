import OpenAI from "openai";

// Read from the browser's environment variables in Next.js
export const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true, // Needed since we are calling it from the frontend directly
});
