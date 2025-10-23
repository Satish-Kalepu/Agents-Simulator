
import { GoogleGenAI } from "@google/genai";

// Assume API_KEY is set in the environment.
// In a real browser app, this would be handled securely by a backend proxy.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const invokeAgent = async (
    systemPrompt: string,
    userQuery: string,
    model: string = 'gemini-2.5-flash'
) => {
    if (!API_KEY) {
        return {
            response: "Error: API_KEY is not configured.",
            log: "API_KEY is not available. Please configure it in your environment."
        };
    }
    
    try {
        // FIX: The `contents` property should be a simple string for single-turn text generation.
        const result = await ai.models.generateContent({
            model: model,
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
            },
        });
        
        const responseText = result.text;
        
        return {
            response: responseText,
            log: JSON.stringify(result, null, 2),
        };
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return {
            response: `Error: Failed to get response from the model.`,
            log: error instanceof Error ? error.message : JSON.stringify(error),
        };
    }
};
