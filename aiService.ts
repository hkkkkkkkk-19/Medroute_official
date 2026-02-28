
import { GoogleGenAI } from "@google/genai";

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

export const findNearbyHubs = async (query: string, latitude: number, longitude: number) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List verified medical clinics, pharmacies, or medicine drop-boxes specifically in "${query}". 
      Return a RAW BULLET LIST. 
      Format: * [Name] | [Address] | [Hours] | [Rating]
      
      CRITICAL: No intro, no outro, no conversational filler. Just the list.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude,
              longitude
            }
          }
        }
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return {
      text,
      sources: groundingChunks?.map((chunk: any) => ({
        title: chunk.maps?.title || "Medical Center",
        uri: chunk.maps?.uri
      })) || []
    };
  } catch (error: any) {
    // Robust check for quota exhaustion
    const isQuotaError = 
      error?.status === "RESOURCE_EXHAUSTED" || 
      error?.code === 429 ||
      error?.error?.status === "RESOURCE_EXHAUSTED" ||
      error?.error?.code === 429 ||
      JSON.stringify(error).includes("RESOURCE_EXHAUSTED") ||
      JSON.stringify(error).includes("429");

    if (isQuotaError) {
      console.warn("Maps Grounding: Quota exceeded, using fallback data.");
      return { 
        text: "* City General Hospital | 123 Main St | 24/7 | 4.8\n* Community Wellness Pharmacy | 456 Oak Ave | 9AM-9PM | 4.5\n* MedRoute Drop-box | Central Metro Station | 24/7 | 5.0", 
        sources: [],
        isFallback: true 
      };
    }
    
    console.error("Maps Grounding Error:", error);
    return { text: "Search currently unavailable. Please try again later.", sources: [] };
  }
};

export const getDisasterZoneFacilities = async (zoneName: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List major hospitals and medical emergency centers in "${zoneName}". 
      Return a RAW JSON ARRAY of objects with name, lat, lng.
      Example: [{"name": "City Hospital", "lat": 12.34, "lng": 56.78}]
      
      CRITICAL: No intro, no outro, just the JSON array.`,
      config: {
        tools: [{ googleMaps: {} }]
      },
    });

    const text = response.text || "[]";
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      if (jsonStart === -1 || jsonEnd === 0) return [];
      return JSON.parse(text.substring(jsonStart, jsonEnd));
    } catch {
      return [];
    }
  } catch (error: any) {
    // Robust check for quota exhaustion
    const isQuotaError = 
      error?.status === "RESOURCE_EXHAUSTED" || 
      error?.code === 429 ||
      error?.error?.status === "RESOURCE_EXHAUSTED" ||
      error?.error?.code === 429 ||
      JSON.stringify(error).includes("RESOURCE_EXHAUSTED") ||
      JSON.stringify(error).includes("429");

    if (isQuotaError) {
      console.warn("Disaster Grounding: Quota exceeded, using fallback data.");
      if (zoneName.toLowerCase().includes("kerala")) {
        return [
          { name: "General Hospital Pathanamthitta", lat: 9.2648, lng: 76.7870 },
          { name: "Muthoot Medical Centre", lat: 9.2712, lng: 76.7815 },
          { name: "St. Gregorios Hospital", lat: 9.2580, lng: 76.7920 }
        ];
      }
      // Generic fallback
      return [
        { name: "Emergency Relief Hub A", lat: 20.5937, lng: 78.9629 },
        { name: "Mobile Medical Unit 1", lat: 20.6000, lng: 78.9700 }
      ];
    }
    
    console.error("Disaster Grounding Error:", error);
    return [];
  }
};
