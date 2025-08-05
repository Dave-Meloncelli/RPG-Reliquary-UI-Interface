
import type { OrchestratorConfig } from "../types/types";

export const orchestratorConfig: OrchestratorConfig = {
  // Provider priority order - determines fallback sequence
  priority: ["ollama", "chutes", "openai", "google"],
  
  providers: {
    ollama: {
      name: "Ollama",
      enabled: true,
      baseUrl: "http://localhost:11434",
      model: "llama3",
      maxRetries: 2,
      // FIX: Increased timeout to resolve regression from unified client refactor (c4d5e6f).
      // The previous value of 30000ms was too aggressive for localhost connections under load.
      timeout: 90000,
      capabilities: ["general", "fast", "private"],
      apiKey: "N/A"
    },
    chutes: {
      name: "Chutes.ai",
      enabled: true,
      baseUrl: "https://api.chutes.ai/v1/completions", 
      apiKey: "**********", // Masked
      model: "llama2-70b",
      maxRetries: 3,
      timeout: 60000,
      capabilities: ["complex", "cost-effective"]
    },
    openai: {
      name: "OpenAI",
      enabled: true,
      baseUrl: "https://api.openai.com/v1",
      apiKey: "**********", // Masked
      model: "gpt-4-turbo-preview",
      maxRetries: 3,
      timeout: 90000,
      capabilities: ["premium", "analysis", "creative"]
    },
    google: {
      name: "Google Gemini",
      enabled: true,
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: "**********", // Masked
      model: "gemini-pro",
      maxRetries: 3,
      timeout: 60000,
      capabilities: ["multimodal", "vision", "search"]
    }
  },
  
  // Specialized routing for agent types
  agentPreferences: {
    "agent-az86": { preferred: ["google", "ollama"] },
    "agent-az81": { preferred: ["ollama", "chutes"] },
    "agent-az82": { preferred: ["openai", "chutes"] },
    "agent-kairos": { preferred: ["openai", "google"] },
    "agent-sophia": { preferred: ["openai", "google"] },
    "agent-jordan": { preferred: ["openai", "ollama"] }
  },
  
  fallbackStrategy: {
    enableFallback: true,
    fallbackOnError: true,
    fallbackOnTimeout: true,
    fallbackOnLowConfidence: true,
    confidenceThreshold: 0.7
  },
  
  costOptimization: {
    trackCosts: true,
    monthlyBudget: 100,  // USD
    preferLocalModels: true,
    cacheResponses: true,
    cacheTTL: 3600  // 1 hour
  }
};
