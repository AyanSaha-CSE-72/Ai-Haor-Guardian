import { GoogleGenAI, Type } from "@google/genai";
import { PredictionData, Language, MapData, GroundingSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper: Exponential Backoff Retry
const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3, 
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  let delay = initialDelay;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check for transient errors suitable for retry
      const isNetworkError = error.message && (
        error.message.toLowerCase().includes('fetch') || 
        error.message.toLowerCase().includes('network') ||
        error.message.toLowerCase().includes('failed to fetch')
      );
      const isServerOverload = error.status === 503 || error.status === 429;
      
      // If it's not a transient error, throw immediately (don't retry)
      if (!isNetworkError && !isServerOverload) {
        throw error;
      }

      console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`, error);
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  throw lastError;
};

// Helper: Enhance Error Object
const enhanceError = (error: any, defaultMsg: string) => {
  let message = defaultMsg;
  let code = "UNKNOWN";

  if (error.message) {
    if (error.message.includes("API Key")) {
      message = "System Configuration Error: API Key missing.";
      code = "AUTH_MISSING_KEY";
    } else if (error.message.toLowerCase().includes("network") || error.message.toLowerCase().includes("fetch")) {
      message = "Network connection failed. Please check your internet connection.";
      code = "NET_ERR";
    } else if (error.status === 503) {
      message = "AI Service is temporarily busy (503). Please try again.";
      code = "SRV_BUSY";
    } else if (error.status === 429) {
      message = "Too many requests. Please wait a moment.";
      code = "rate_limit";
    } else if (error.message.includes("JSON") || error.message.includes("valid JSON")) {
      message = "Received invalid data format from AI. Retrying might fix this.";
      code = "DATA_PARSE_ERR";
    } else if (error.message.includes("candidate")) {
      message = "The AI could not generate a valid response for this prompt.";
      code = "AI_NO_CANDIDATE";
    } else {
      message = error.message;
    }
  }

  const enhanced = new Error(message);
  (enhanced as any).code = code;
  return enhanced;
};

// Helper to validate PredictionData structure
const validatePredictionData = (data: any): data is PredictionData => {
  if (!data || typeof data !== 'object') return false;

  const validRiskLevels = ['Low', 'Medium', 'High'];
  const validMovements = ['High', 'Medium', 'Low'];

  const hasWaterLevel = data.waterLevel && 
    validRiskLevels.includes(data.waterLevel.riskLevel) &&
    typeof data.waterLevel.description === 'string' &&
    typeof data.waterLevel.riseProbability === 'string';

  const hasStorm = data.storm &&
    typeof data.storm.likelihood === 'string' &&
    typeof data.storm.windDirection === 'string' &&
    typeof data.storm.advice === 'string';

  const hasFish = data.fish &&
    validMovements.includes(data.fish.movement) &&
    typeof data.fish.bestTime === 'string' &&
    typeof data.fish.zone === 'string';

  const hasRoute = data.route &&
    typeof data.route.safetyScore === 'number' &&
    Array.isArray(data.route.warningPoints) &&
    typeof data.route.safePath === 'string';

  return hasWaterLevel && hasStorm && hasFish && hasRoute;
};

export const getHaorPrediction = async (haorName: string, lang: Language): Promise<PredictionData> => {
  if (!apiKey) throw new Error("API Key is missing. Please configure your API key.");

  const model = "gemini-2.5-flash";
  const languagePrompt = lang === 'bn' 
    ? "Provide the text content (descriptions, advice, reasons) in Bengali (Bangla). However, strictly keep the 'riskLevel' values as ['Low', 'Medium', 'High'] and 'movement' values as ['High', 'Medium', 'Low'] in English." 
    : "Provide the response in English.";

  const prompt = `Analyze the current hypothetical conditions for ${haorName} in Bangladesh. 
  ${languagePrompt}
  Provide a safety report for fishermen covering:
  1. Water Level Risk (Low/Medium/High) and rise probability.
  2. Storm & Wind Risk (likelihood, wind direction, advice).
  3. Fish Movement (High/Medium/Low, best time to fish, best zone).
  4. Route Safety (Score 0-100, warning points, safe path suggestion).
  
  Return strictly valid JSON matching the schema.`;

  const apiCall = async () => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            waterLevel: {
              type: Type.OBJECT,
              properties: {
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                description: { type: Type.STRING },
                riseProbability: { type: Type.STRING }
              }
            },
            storm: {
              type: Type.OBJECT,
              properties: {
                likelihood: { type: Type.STRING },
                windDirection: { type: Type.STRING },
                advice: { type: Type.STRING }
              }
            },
            fish: {
              type: Type.OBJECT,
              properties: {
                movement: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                bestTime: { type: Type.STRING },
                zone: { type: Type.STRING }
              }
            },
            route: {
              type: Type.OBJECT,
              properties: {
                safetyScore: { type: Type.NUMBER },
                warningPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                safePath: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned empty response.");
    }

    let parsedData: any;
    try {
      const cleanedText = text.replace(/```json\n?|```/g, '').trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parsing Error:", text);
      throw new Error("Failed to parse AI response as valid JSON.");
    }

    if (!validatePredictionData(parsedData)) {
      console.error("Data Validation Error:", parsedData);
      throw new Error("AI returned incomplete or invalid data structure.");
    }

    return parsedData;
  };

  try {
    return await retryOperation(apiCall);
  } catch (error: any) {
    console.error("getHaorPrediction Final Error:", error);
    throw enhanceError(error, "Failed to generate prediction. Please try again.");
  }
};

export const generateFishermanAlert = async (
  name: string,
  haor: string,
  boatType: string,
  lang: Language
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing.");

  const model = "gemini-2.5-flash";
  const languageInstruction = lang === 'bn' ? "Write the alert in Bengali (Bangla)." : "Write the alert in English.";
  
  const prompt = `Generate a personalized safety alert for a fisherman named ${name} who is going to ${haor} using a ${boatType}. 
  ${languageInstruction}
  Include a weather warning, water level advisory, and specific safety instructions for their boat type. Keep it concise (under 150 words).`;

  const apiCall = async () => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    if (!response.text) {
        throw new Error("AI returned empty content.");
    }
    return response.text;
  };

  try {
    return await retryOperation(apiCall);
  } catch (error: any) {
    console.error("generateFishermanAlert Final Error:", error);
    throw enhanceError(error, "Failed to generate alert.");
  }
};

export const getChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string, lang: Language) => {
  if (!apiKey) throw new Error("API Key is missing.");
  
  const systemInstruction = lang === 'bn' 
    ? "You are 'Haor Guardian AI', a helpful assistant for Bangladeshi fishermen. Answer primarily in Bengali (Bangla). Be polite, concise, and safety-focused."
    : "You are 'Haor Guardian AI', a helpful assistant for Bangladeshi fishermen. Answer in English. Be polite, concise, and safety-focused.";

  const apiCall = async () => {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction
      },
      history: history
    });

    const result = await chat.sendMessage({ message: newMessage });
    if (!result.text) throw new Error("Empty response from chat model.");
    return result.text;
  };

  try {
    // We can allow fewer retries for chat to keep it responsive, or just 1 retry
    return await retryOperation(apiCall, 1);
  } catch (error: any) {
    console.error("getChatResponse Final Error:", error);
    throw enhanceError(error, "Failed to send message.");
  }
};

export const getHaorMapDetails = async (haorName: string, lang: Language): Promise<MapData> => {
  if (!apiKey) throw new Error("API Key is missing.");
  const model = "gemini-2.5-flash";
  const languageInstruction = lang === 'bn' ? "in Bengali (Bangla)" : "in English";
  const prompt = `Using Google Maps, locate ${haorName} in Bangladesh. Provide a concise summary of its geography and key points of interest for fishermen ${languageInstruction}.`;
  
  const apiCall = async () => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const text = response.text || "No info available.";
    const sources: GroundingSource[] = [];

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.maps) {
        sources.push({
          title: chunk.maps.title || "Google Maps Location",
          uri: chunk.maps.uri || "#",
          type: 'map'
        });
      } else if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri || "#",
          type: 'web'
        });
      }
    });

    return { summary: text, sources };
  };

  try {
    return await retryOperation(apiCall);
  } catch (error: any) {
    console.error("getHaorMapDetails Final Error:", error);
    throw enhanceError(error, "Could not fetch map details.");
  }
}