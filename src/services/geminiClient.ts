import { GoogleGenerativeAI } from "@google/generative-ai";

import type { RpgBookAnalysis } from "../types/types";

// Initialize AI client only if API key is available
const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
let ai: GoogleGenerativeAI | null = null;

const MAX_CONCURRENT_REQUESTS = 3;
let activeRequests = 0;

if (apiKey) {
  ai = new GoogleGenerativeAI(apiKey);
} else {
  console.warn(
    "API_KEY or GEMINI_API_KEY environment variable not set. Some features may not work.",
  );
}

// --- Request Queue Implementation ---
interface QueuedRequest<T> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

const pendingQueue: QueuedRequest<any>[] = [];

async function dequeueAndRun() {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || pendingQueue.length === 0)
    return;
  const { fn, resolve, reject } = pendingQueue.shift()!;
  activeRequests++;
  try {
    resolve(await fn());
  } catch (err) {
    reject(err);
  } finally {
    activeRequests--;
    setTimeout(dequeueAndRun, 0);
  }
}

function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    pendingQueue.push({ fn, resolve, reject });
    dequeueAndRun();
  });
}

// --- Standardized Text Generation ---
export const generateText = async (
  contents: string | any,
  config?: any,
): Promise<string> => {
  const doRequest = async () => {
    if (!ai) {
      return "Error: Gemini API key not configured. Please set GEMINI_API_KEY environment variable.";
    }

    try {
      const model = ai.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        typeof contents === "string" ? contents : JSON.stringify(contents),
      );
      const response = await result.response;
      const text = response.text();

      return text || "";
    } catch (error) {
      console.error("Gemini API error in generateText:", error);
      return `Error: AI processing failed. Please check API key and network.`;
    }
  };
  return await enqueueRequest(doRequest);
};

// --- Image Generation Stub ---
export const generateImageFromPrompt = async (
  prompt: string,
): Promise<string> => {
  console.warn("generateImageFromPrompt is stubbed - implement when needed");
  return `Error: Image generation not yet implemented for prompt: ${prompt}`;
};

// --- Vision Analysis Stub ---
export const analyzeRpgBookCoverWithVision = async (
  imageUrl: string,
): Promise<RpgBookAnalysis> => {
  console.warn(
    "analyzeRpgBookCoverWithVision is stubbed - implement when needed",
  );

  // Return mock data for now
  return {
    title: "Mock RPG Book",
    publisher: "Mock Publisher",
    condition: "good",
    estimatedValue: 25.0,
    marketDemand: "medium",
    rarity: "common",
    keywords: ["mock", "rpg", "book"],
    description: "Mock analysis for image: " + imageUrl,
    recommendations: ["This is a mock analysis"],
  };
};
