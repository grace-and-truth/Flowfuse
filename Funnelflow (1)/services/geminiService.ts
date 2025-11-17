import { GoogleGenAI, Type } from "@google/genai";

// Assume API_KEY is set in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateEmailCopy = async (prompt: string): Promise<{ subject: string; body: string; }> => {
  if (!API_KEY) {
    return { subject: "Error: API Key Not Configured", body: "<p>The Gemini API key is missing. Please ensure it is correctly set up in your environment variables to use AI features.</p>" };
  }

  try {
    const fullPrompt = `Generate a compelling and professional marketing email based on the following user prompt. The tone should be engaging and clear. The output should be a single block of HTML content suitable for an email body. Use tags like <h1>, <h2>, <p>, <strong>, <em>, and <ul>. Do not include <html>, <head>, or <body> tags.

    Prompt: "${prompt}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { 
              type: Type.STRING,
              description: 'A short, catchy, and professional email subject line.'
            },
            body: {
              type: Type.STRING,
              description: 'The full email body as a single block of semantic HTML. Use tags like <h1>, <h2>, <p>, <strong>, <em>, <a>, and <ul>. Do not include <html>, <head>, or <body> tags.'
            },
          },
          required: ['subject', 'body'],
        },
      },
    });

    // Fix: Add defensive code to strip markdown from JSON response before parsing.
    let text = response.text.trim();
    if (text.startsWith('```json')) {
      text = text.slice(7, -3).trim();
    }
    const parsed = JSON.parse(text);
    
    return {
        subject: parsed.subject || "AI Generated Subject",
        body: parsed.body || "<p>AI Generated Body Content.</p>"
    };

  } catch (error) {
    console.error("Error generating email copy:", error);
    return { subject: "Generation Failed", body: "<p>An error occurred while generating AI content. The model may have returned an unexpected response. Please check the console for details and try again.</p>" };
  }
};
