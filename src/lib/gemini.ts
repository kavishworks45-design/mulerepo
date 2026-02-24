import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getAI() {
    if (!ai) {
        if (!process.env.GEMINI_API_KEY) return null;
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
}

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
    healthScore?: number;
    bestPractices?: Array<{ title: string; passed: boolean; reason: string }>;
}

export async function analyzeProject(
    files: Record<string, string>,
): Promise<AIAnalysisResult | null> {
    const key = process.env.GEMINI_API_KEY;
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
            You are a Senior MuleSoft Architect and Security Reviewer. Analyze the following MuleSoft project code files and generate a structured JSON summary.
            
            Based on the XML flows, DataWeave scripts, and POM file, identify:
            1. The SOURCE system (e.g., HTTP Listener, Scheduler, Salesforce, SAP).
            2. The TARGET system (e.g., Database, File, Salesforce, Logger).
            3. The main PROCESS logic (what transformation or routing happens?).
            
            CRITICAL: Perform a Static Code Analysis and Best Practices Audit.
            - Look for hardcoded credentials, tokens, or URLs.
            - Check for global error handlers (\`<error-handler>\`).
            - Look for secure property placeholders (e.g., \`secure::\`).
            Give the project an overall "healthScore" (1-100) and list 3-4 "bestPractices" checks (pass/fail).
            
            IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting (like \`\`\`json).
            
            Structure:
            {
                "description": "A comprehensive technical explanation of the pattern. Mention key mechanisms like Batch Processing, Watermarking, Circuit Breakers, etc. (Approx 3-4 sentences).",
                "difficulty": "Beginner" | "Intermediate" | "Advanced",
                "tags": ["Tag1", "Tag2"],
                "healthScore": 85,
                "bestPractices": [
                    { "title": "Global Error Handler", "passed": true, "reason": "Found <error-handler> in global.xml" },
                    { "title": "Hardcoded Secrets", "passed": false, "reason": "Found plain text client_secret in properties" }
                ],
                "documentation": "# Project Guide\\n\\n## Overview\\n[Detailed explanation]...",
                "architecture": {
                    "source": { "name": "Source Name", "type": "Source", "icon": "Cloud", "color": "blue" },
                    "process": { "name": "Mule App", "type": "Process", "icon": "Box", "color": "purple" },
                    "target": { "name": "Target Name", "type": "Target", "icon": "Database", "color": "green" }
                },
                "logicBreakdown": {
                    "cards": [
                        { "title": "Watermarking", "type": "Mechanism", "description": "Automatically tracks LastModifiedDate...", "color": "blue" }
                    ]
                },
                "dependencies": [
                    { "name": "Dep", "version": "1.0", "type": "Connector" }
                ]
            }

            Files:
            ${fileContext}
        `;

        const activeAi = getAI();
        if (!activeAi) return null;

        const response = await activeAi.models.generateContent({
            model: "gemini-2.5-flash",
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
