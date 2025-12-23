import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate crash, though functionality will be disabled in UI
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProfessionalText = async (prompt: string, context: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing.");
  }

  try {
    const fullPrompt = `
      Context: User is creating an invoice.
      Task: Write a professional, polite, and concise ${context} text based on this input: "${prompt}".
      Output Requirement: Return ONLY the raw text to be inserted into the invoice field. No intro, no quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
