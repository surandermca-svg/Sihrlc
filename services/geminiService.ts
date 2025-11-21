import { GoogleGenAI, Type } from "@google/genai";
import { EventColor } from "../types";

// Initialize Gemini
// Note: In a real production app, handle missing keys gracefully.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const parseEventWithGemini = async (text: string): Promise<any> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract event details from this text: "${text}". 
      If the year is not specified, assume the current year or the next occurrence.
      If it's a single day event, startDate and endDate should be the same.
      If no duration is specified, assume 1 hour.
      Suggest a color based on the context (e.g., red for urgent/important, green for money/work, blue for general).
      Return a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            startDate: { type: Type.STRING, description: "ISO 8601 date string (YYYY-MM-DD)" },
            endDate: { type: Type.STRING, description: "ISO 8601 date string (YYYY-MM-DD)" },
            startTime: { type: Type.STRING, description: "24-hour format HH:mm" },
            endTime: { type: Type.STRING, description: "24-hour format HH:mm" },
            color: { 
              type: Type.STRING, 
              enum: Object.values(EventColor)
            }
          },
          required: ["title", "startDate", "endDate", "color"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) return null;
    
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Error parsing event with Gemini:", error);
    throw error;
  }
};
