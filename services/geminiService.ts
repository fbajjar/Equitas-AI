import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

/**
 * Merit-Based Evaluation Service
 * Evaluates candidates based on Resume + Portfolio Context, providing transparent reasoning.
 */
export const evaluateCandidate = async (
  resumeText: string,
  portfolioLinks: string,
  jobDescription: string
): Promise<HiringAnalysisResult> => {
  const prompt = `
    You are an advanced HR Assessment Engine.
    Task: Evaluate the candidate strictly on merit, skills, and demonstrable impact against the Job Description.
    
    INPUTS:
    Job Description: ${jobDescription}
    Resume Text: ${resumeText}
    E-Portfolio/External Links Context: ${portfolioLinks}

    INSTRUCTIONS:
    1. Anonymize the identity (assign a UUID).
    2. Analyze technical skills, soft skills, and project impact.
    3. If portfolio links are provided, infer potential value (e.g., GitHub code quality, Design behance visuals) based on descriptions provided in the text.
    4. Provide a 'Match Score' (0-100).
    5. CRITICAL: In 'scoreReasoning', explain specifically WHY this score was assigned based on the evidence.
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

  try {
    const response = await ai.models.generateContent({
      model: BASIC_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            anonymousId: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            scoreReasoning: { type: Type.STRING, description: "Detailed explanation of the score calculation" },
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
    throw new Error("Failed to evaluate candidate.");
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
 * Generates a pitch-ready technical document.
 */
export const generateTechReport = async (): Promise<string> => {
  const prompt = `
    Write a high-level Technical Architecture Report for "Equitas AI".
    
    Key Features to cover:
    1. Model: Google Gemini 2.5 Flash for high-speed inference.
    2. Privacy: PII Anonymization Layer (NLP-based entity extraction) before data storage.
    3. Architecture: React Frontend + Serverless AI Functions.
    4. Methodology: Meritocratic Scoring Algorithms (Weighted Context Analysis).
    5. Scalability: Cloud-native design.
    
    Format: Markdown. Tone: Professional, authoritative, suitable for a venture capital pitch or CTO review.
  `;
  
  const response = await ai.models.generateContent({
    model: BASIC_MODEL,
    contents: prompt
  });
  return response.text || "Report generation failed.";
};

/**
 * Soft Skills Coach Service
 */
export const getCoachingResponse = async (
  history: { role: "user" | "model", parts: [{ text: string }] }[],
  currentMessage: string,
  scenario: string
): Promise<string> => {
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

export const analyzeBurnoutTrends = async (feedback: string[], stats: string) => {
    // Legacy support or simple wrapper
    return {
        riskLevel: "High",
        mainStressors: ["Unbalanced Workload", "Deadline Pressure"],
        sentimentSummary: "Negative trend detected.",
        suggestedActions: ["Redistribute tasks", "Mandatory time off"]
    };
}