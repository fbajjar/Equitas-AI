import { GoogleGenAI, Type } from "@google/genai";

const BASIC_MODEL = 'gemini-2.5-flash';

export interface HiringAnalysisResult {
  anonymousId: string;
  matchScore: number;
  scoreReasoning: string; // Detailed transparency on why this score was given
  keyStrengths: string[];
  portfolioInsights: string; // Analysis of linked content
  summary: string;
  recommendation: "Top Candidate" | "Strong Contender" | "Potential Fit" | "Not Aligned";
  interviewQuestions: string[];
}

export interface BurnoutReport {
  employeeId: string;
  riskSeverity: "Critical" | "High" | "Moderate";
  burnoutIndicators: string[];
  workloadAnalysis: string;
  recommendationForSpecialist: string;
}

export interface TechReportData {
  title: string;
  generatedDate: string;
  systemVersion: string;
  executiveSummary: string;
  coreComponents: {
    name: string;
    techStack: string;
    functionality: string;
    status: "Active" | "Beta" | "Planned";
  }[];
  aiImplementation: {
    model: string;
    role: string;
    reasoning: string;
  }[];
  dataPrivacyFramework: string[];
  fairnessMechanisms: string[];
}

/**
 * Merit-Based Evaluation Service
 * Evaluates candidates based on Resume + Portfolio Context, providing transparent reasoning.
 * Supports PDF (via Base64) or Plain Text.
 */
export const evaluateCandidate = async (
  resumeInput: { text?: string; data?: string; mimeType?: string },
  portfolioLinks: string,
  jobDesc: string
): Promise<HiringAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    You are an advanced HR Assessment Engine.
    Task: Evaluate the candidate strictly on merit, skills, and demonstrable impact against the Job Description.
    
    INSTRUCTIONS:
    1. Anonymize the identity (assign a UUID).
    2. Analyze technical skills, soft skills, and project impact from the provided resume document.
    3. Use the 'E-Portfolio/External Links Context' to infer potential value (e.g., if a GitHub link is mentioned, look for context about code quality in the resume).
    4. Provide a 'Match Score' (0-100).
    5. CRITICAL: In 'scoreReasoning', explain specifically WHY this score was assigned based on the evidence in the file.
    6. DO NOT mention "bias reduction" or "demographics removed". Keep the tone strictly professional and analytical.

    OUTPUT JSON SCHEMA:
    {
      anonymousId: string,
      matchScore: number,
      scoreReasoning: string,
      keyStrengths: string[],
      portfolioInsights: string,
      summary: string,
      recommendation: enum["Top Candidate", "Strong Contender", "Potential Fit", "Not Aligned"],
      interviewQuestions: string[]
    }
  `;

  // Construct the parts for the model
  const parts: any[] = [
    { text: systemPrompt },
    { text: `\n\nJOB DESCRIPTION:\n${jobDesc}` },
    { text: `\n\nE-PORTFOLIO / LINKS CONTEXT:\n${portfolioLinks}` }
  ];

  if (resumeInput.text) {
    parts.push({ text: `\n\nRESUME TEXT CONTENT:\n${resumeInput.text}` });
  } else if (resumeInput.data && resumeInput.mimeType) {
    parts.push({
      inlineData: {
        mimeType: resumeInput.mimeType,
        data: resumeInput.data
      }
    });
    parts.push({ text: "\n\n(Analyze the attached resume document above)" });
  }

  try {
    const response = await ai.models.generateContent({
      model: BASIC_MODEL,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            anonymousId: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            scoreReasoning: { type: Type.STRING, description: "Detailed explanation of the score calculation based on the actual resume content" },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            portfolioInsights: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING, enum: ["Top Candidate", "Strong Contender", "Potential Fit", "Not Aligned"] },
            interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["anonymousId", "matchScore", "scoreReasoning", "portfolioInsights"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as HiringAnalysisResult;
  } catch (error) {
    console.error("Evaluation Failed:", error);
    throw new Error("Failed to evaluate candidate. Please try again or check file format.");
  }
};

/**
 * Specialist Burnout Report Generator
 * Generates a deep-dive report for a specific flagged employee ID.
 */
export const generateSpecialistReport = async (
  employeeId: string,
  metrics: any
): Promise<BurnoutReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Generate a confidential HR Specialist Report for Employee ID: ${employeeId}.
    
    Detected Metrics:
    - Overtime Hours: ${metrics.overtime}
    - Task Completion Decay: ${metrics.decay}%
    - Sentiment Flag: "Exhaustion detected in communication channels"
    
    Task:
    Provide a clinical, professional analysis of burnout risk. Suggest specific intervention strategies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: BASIC_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            employeeId: { type: Type.STRING },
            riskSeverity: { type: Type.STRING, enum: ["Critical", "High", "Moderate"] },
            burnoutIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
            workloadAnalysis: { type: Type.STRING },
            recommendationForSpecialist: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}") as BurnoutReport;
  } catch (error) {
    console.error("Report Generation Failed", error);
    throw new Error("Failed to generate report");
  }
};

/**
 * Technical Architecture Report Generator
 * Generates a structured JSON report accurately reflecting the codebase.
 */
export const generateTechReport = async (): Promise<TechReportData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are the Chief Technology Officer writing a transparency report for Equitas AI.
    
    SYSTEM FACTS (Use these strictly):
    1. Frontend Framework: React 19 with Tailwind CSS (Client-Side Rendering).
    2. AI Engine: Google Gemini 2.5 Flash via @google/genai SDK.
    3. Hring Module: Uses Multimodal capabilities (PDF/Text) to analyze CVs against Job Descriptions.
    4. Performance Module: Uses a DETERMINISTIC (Math-based) algorithm for scoring events/attendance, NOT an AI model, to ensure fairness and prevent hallucination in scores.
    5. Privacy: Data is processed in-memory. No external database stores Candidate PII.
    
    Task: Generate a JSON technical report explaining this architecture to HR executives.
  `;

  try {
    const response = await ai.models.generateContent({
      model: BASIC_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            generatedDate: { type: Type.STRING },
            systemVersion: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            coreComponents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  techStack: { type: Type.STRING },
                  functionality: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["Active", "Beta", "Planned"] }
                }
              }
            },
            aiImplementation: {
               type: Type.ARRAY,
               items: {
                  type: Type.OBJECT,
                  properties: {
                      model: { type: Type.STRING },
                      role: { type: Type.STRING },
                      reasoning: { type: Type.STRING }
                  }
               }
            },
            dataPrivacyFramework: { type: Type.ARRAY, items: { type: Type.STRING } },
            fairnessMechanisms: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}") as TechReportData;
  } catch (error) {
    console.error("Tech Report Failed:", error);
    throw new Error("Failed to generate tech report");
  }
};

/**
 * Soft Skills Coach Service
 */
export const getCoachingResponse = async (
  history: { role: "user" | "model", parts: [{ text: string }] }[],
  currentMessage: string,
  scenario: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const chat = ai.chats.create({
      model: BASIC_MODEL,
      history: history,
      config: {
        systemInstruction: `You are an executive soft-skills coach. 
        The user is an employee practicing a difficult conversation for the scenario: "${scenario}".
        Your goal is to roleplay the other party (manager, peer, or client) realistically but also provide brief "Coach's Notes" in parentheses if they make a mistake or do something well.
        Keep responses concise (under 100 words).`
      }
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Coaching Chat Failed:", error);
    return "I'm having trouble connecting to the coaching server right now.";
  }
};
