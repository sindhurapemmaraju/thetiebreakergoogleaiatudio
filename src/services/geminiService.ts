import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export enum AnalysisType {
  PROS_CONS = "PROS_CONS",
  COMPARISON = "COMPARISON",
  SWOT = "SWOT",
}

export interface ProsConsResult {
  pros: string[];
  cons: string[];
  conclusion: string;
}

export interface ComparisonResult {
  options: string[];
  criteria: {
    name: string;
    values: string[]; // matches index of options
  }[];
  conclusion: string;
}

export interface SWOTResult {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  conclusion: string;
}

export async function generateAnalysis(
  decision: string,
  type: AnalysisType
): Promise<ProsConsResult | ComparisonResult | SWOTResult> {
  const model = "gemini-3-flash-preview";

  let systemInstruction = "";
  let responseSchema: any = {};

  if (type === AnalysisType.PROS_CONS) {
    systemInstruction = "You are a decision-making assistant. Provide a detailed pros and cons list for the given decision. Be objective and balanced.";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        conclusion: { type: Type.STRING, description: "A brief final advice on how to proceed." }
      },
      required: ["pros", "cons", "conclusion"]
    };
  } else if (type === AnalysisType.COMPARISON) {
    systemInstruction = "You are a decision-making assistant. Create a comparison table for the options mentioned in the decision. Identify 3-5 relevant criteria and evaluate each option.";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The names of the options being compared." },
        criteria: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "The name of the comparison criterion (e.g., Cost, Speed)." },
              values: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The value/evaluation for each option, in order." }
            },
            required: ["name", "values"]
          }
        },
        conclusion: { type: Type.STRING, description: "A brief final advice on which option seems strongest." }
      },
      required: ["options", "criteria", "conclusion"]
    };
  } else if (type === AnalysisType.SWOT) {
    systemInstruction = "You are a decision-making assistant. Perform a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the given decision or path.";
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        conclusion: { type: Type.STRING, description: "A brief summary of the strategic outlook." }
      },
      required: ["strengths", "weaknesses", "opportunities", "threats", "conclusion"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: `Analyze this decision: ${decision}` }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate analysis. Please check your API key or try again later.");
  }
}
