import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key from Vite (import.meta.env) or Node/Webpack (process.env)
const getApiKey = (): string => {
  // 1. Try Vite environment variable
  // @ts-ignore - import.meta is available in Vite environments
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try process.env (Standard Node/Webpack)
  try {
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore ReferenceError if process is not defined
  }
  
  return '';
};

const API_KEY = getApiKey();

// We handle the case where API key might be missing gracefully in the UI
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const askDietitian = async (userQuery: string, context: string): Promise<string> => {
  if (!ai) {
    return "Please configure your API Key in the .env file (VITE_API_KEY) to use the AI Dietitian.";
  }

  try {
    const model = 'gemini-3-flash-preview'; // Updated to latest Flash model for text tasks
    
    const systemInstruction = `
      You are an expert Gastroenterology Dietitian specializing in Gastroparesis.
      
      Your patient context:
      - Diagnosis: Gastroparesis.
      - Status: Immunosuppressed (Transplant patient).
      - Risk: High risk of infection from raw foods.
      - Risk: High risk of bezoars from fiber.
      - Protocol: "Small Particle" diet (low fat, low fiber, soft texture).
      
      CRITICAL RULES:
      1. NO raw vegetables or unpeeled fruits.
      2. NO high fiber (nuts, seeds, corn, skins).
      3. NO frying/grease.
      4. Suggest small, frequent meals.
      
      When answering:
      - Be empathetic but firm on safety rules.
      - If they ask about a specific food, analyze it against the Gastroparesis AND Immunosuppression rules.
      - Keep answers concise and practical.
      
      Current User Data Context: ${context}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the service right now. Please try again later.";
  }
};