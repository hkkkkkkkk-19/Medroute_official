/**
 * Smart Medicine Redistribution Network - Clinical Verification Engine
 * Powered by AI Engine.
 */

import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("AI_API_KEY is not defined. Please set it in your environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const extractMedicineDetails = async (base64Image: string) => {
  try {
    console.log("[Verification] Phase 1: Analyzing image with AI Engine...");
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/jpeg",
            },
          },
          {
            text: `
              STRICT PHARMACEUTICAL AUDIT.
              Analyze the provided image of a medicine packet or label.
              
              TASK: Extract metadata for safety verification and inventory audit.
              Analyze the number of tablets visible.
              Identify if the medicine pack appears opened or partially used.
              
              SPATIAL REASONING:
              Identify every individual UNOPENED tablet in the image.
              For each tablet, provide its bounding box in normalized coordinates [ymin, xmin, ymax, xmax] (0-1000).
              
              RETURN JSON ONLY:
              {
                "name": "Full medicine name",
                "expiryDate": "YYYY-MM-DD",
                "strength": "Dosage/Concentration",
                "brand": "Manufacturer",
                "tabletCount": 10,
                "isOpened": false,
                "isReadable": true,
                "reasoning": "Clinical summary",
                "detections": [
                  {"box_2d": [ymin, xmin, ymax, xmax], "label": "tablet"}
                ]
              }
              Set isReadable: false if the product is expired, the label is unreadable, or it is an invalid item.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            expiryDate: { type: Type.STRING },
            strength: { type: Type.STRING },
            brand: { type: Type.STRING },
            tabletCount: { type: Type.NUMBER },
            isOpened: { type: Type.BOOLEAN },
            isReadable: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            detections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER }
                  },
                  label: { type: Type.STRING }
                }
              }
            }
          },
          required: ["name", "expiryDate", "strength", "brand", "tabletCount", "isOpened", "isReadable", "reasoning", "detections"],
        },
      },
    });

    const clinicalData = JSON.parse(response.text || "{}");
    
    return {
      ...clinicalData,
      isReadable: clinicalData.isReadable ?? true,
      name: clinicalData.name || "Identified Item"
    };

  } catch (error: any) {
    console.error("[Verification] Error:", error);
    return { isReadable: false, reasoning: "Clinical analysis failed. Please ensure the image is clear and well-lit." };
  }
};
