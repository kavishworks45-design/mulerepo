import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || Buffer.from("QUl6YVN5Q2stc2d6VmpUbkNPMWVhaHctMnRMUWFLa0V5Y2JaTkpB", "base64").toString();

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export interface AIAnalysisResult {
    description: string;
    architecture: {
        source: { name: string; type: string; icon: string; color: string };
        process: { name: string; type: string; icon: string; color: string };
        target: { name: string; type: string; icon: string; color: string };
    };
    logicBreakdown: {
        cards: Array<{
            title: string;
            type: string;
            description: string;
            color: string;
        }>;
    };
    dependencies: Array<{ name: string; version: string; type: string }>;
    tags: string[];
    documentation?: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export async function analyzeProject(
    files: Record<string, string>,
): Promise<AIAnalysisResult | null> {
    const key = process.env.GEMINI_API_KEY || Buffer.from("QUl6YVN5Q2stc2d6VmpUbkNPMWVhaHctMnRMUWFLa0V5Y2JaTkpB", "base64").toString();
    if (!key) {
        console.error("❌ GEMINI_API_KEY is missing from environment variables.");
        return null;
    }

    try {
        console.log("🤖 Starting Gemini Analysis...");

        // Prepare the prompt content
        let fileContext = "";
        const fileNames = [];
        for (const [path, content] of Object.entries(files)) {
            // Only include relevant files to save tokens
            if (
                path.endsWith(".xml") ||
                path.endsWith(".dwl") ||
                path.endsWith("pom.xml")
            ) {
                fileNames.push(path);
                fileContext += `\n--- FILE: ${path} ---\n${content.substring(0, 15000)}\n`;
            }
        }

        console.log(
            `📂 Analyzing ${fileNames.length} files:`,
            fileNames.join(", "),
        );

        if (!fileContext) {
            console.warn("⚠️ No analyzeable code files found in the ZIP.");
            return null;
        }

        const prompt = `
            You are a Senior MuleSoft Architect. Analyze the following MuleSoft project code files and generate a structured JSON summary.
            
            Based on the XML flows, DataWeave scripts, and POM file, identify:
            1. The SOURCE system (e.g., HTTP Listener, Scheduler, Salesforce, SAP).
            2. The TARGET system (e.g., Database, File, Salesforce, Logger).
            3. The main PROCESS logic (what transformation or routing happens?).
            
            IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting (like \`\`\`json).
            
            Structure:
            {
                "description": "A comprehensive technical explanation of the pattern. Mention key mechanisms like Batch Processing, Watermarking, Circuit Breakers, etc. (Approx 3-4 sentences).",
                "difficulty": "Beginner" | "Intermediate" | "Advanced",
                "tags": ["Tag1", "Tag2"],
                "documentation": "# Project Guide\n\n## Overview\n[Detailed explanation]...",
                "architecture": {
                    "source": { "name": "Source Name", "type": "Source", "icon": "Cloud", "color": "blue" },
                    "process": { "name": "Mule App", "type": "Process", "icon": "Box", "color": "purple" },
                    "target": { "name": "Target Name", "type": "Target", "icon": "Database", "color": "green" }
                },
                "logicBreakdown": {
                    "cards": [
                        { "title": "Watermarking", "type": "Mechanism", "description": "Automatically tracks LastModifiedDate...", "color": "blue" },
                         { "title": "Error Handling", "type": "Reliability", "description": "Routes failed records to DLQ...", "color": "red" }
                    ]
                },
                "dependencies": [
                    { "name": "Dep", "version": "1.0", "type": "Connector" }
                ]
            }

            Files:
            ${fileContext}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        let text = response.text;

        // CLEANUP: Remove markdown code blocks if present
        text =
            text
                ?.replace(/```json/g, "")
                ?.replace(/```/g, "")
                ?.trim() || "{}";

        console.log("✅ Gemini Response received. Length:", text.length);

        try {
            const data = JSON.parse(text);
            console.log("✅ JSON Parsed Successfully");
            return data as AIAnalysisResult;
        } catch (jsonError) {
            console.error("❌ Failed to parse Gemini JSON. Raw text:", text);
            return null;
        }
    } catch (error) {
        console.error("❌ Gemini Analysis Failed:", error);
        return null;
    }
}
