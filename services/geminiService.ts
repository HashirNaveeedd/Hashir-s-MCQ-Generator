
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMCQs = async (topic: string): Promise<Question[]> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Generate 5 high-quality, professional multiple-choice questions about the topic: "${topic}". 
  Each question must have 4 distinct options (A, B, C, D), exactly one correct answer, and a concise explanation. 
  Ensure the difficulty is appropriate for someone wanting to learn the subject.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The MCQ question text." },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ["A", "B", "C", "D"],
              },
              correctAnswer: { type: Type.STRING, description: "The correct option key (A, B, C, or D)." },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct." },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const rawQuestions = JSON.parse(jsonStr);
    
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `q-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
};
