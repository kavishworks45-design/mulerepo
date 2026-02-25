import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAI() {
    if (!ai) {
        if (!process.env.GEMINI_API_KEY) return null;
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

export async function POST(req: Request) {
    try {
        const { messages, codeContext, fileName } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Messages array is required" },
                { status: 400 },
            );
        }

        const activeAi = getAI();
        if (!activeAi) {
            return NextResponse.json(
                { error: "Gemini API key is not configured" },
                { status: 500 }
            );
        }

        const lastMessage = messages[messages.length - 1].content;

        let prompt = `You are a Senior MuleSoft Developer and AI Coding Assistant.
You are helping a developer understand and modify their MuleSoft Code.

Context (Currently viewing file: ${fileName || "unknown"}):
\`\`\`
${codeContext}
\`\`\`

User Question:
${lastMessage}

Please provide a precise, helpful technical explanation. If suggesting code, use markdown.`;

        // If there's history, we might want to include it, but for a simple stateless completion,
        // we can just send the combined prompt as the completion.

        const response = await activeAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return NextResponse.json({
            text: response.text
        });

    } catch (error: any) {
        console.error("AI Chat Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate AI response" },
            { status: 500 },
        );
    }
}
