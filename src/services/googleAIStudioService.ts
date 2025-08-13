import { eventBus } from "./eventBus";

export interface GoogleAIModel {
  id: string;
  name: string;
  type: "text" | "image" | "code" | "multimodal";
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
}

export interface GenerationRequest {
  id: string;
  modelId: string;
  prompt: string;
  parameters: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxTokens?: number;
    stopSequences?: string[];
  };
  context?: {
    systemPrompt?: string;
    conversationHistory?: Array<{
      role: "user" | "assistant";
      content: string;
    }>;
  };
  metadata?: Record<string, any>;
}

export interface GenerationResponse {
  id: string;
  requestId: string;
  content: string;
  usage: {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
  finishReason: "stop" | "length" | "safety" | "recitation";
  safetyRatings?: Array<{
    category: string;
    probability: "low" | "medium" | "high";
  }>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ImageGenerationRequest {
  id: string;
  prompt: string;
  parameters: {
    width: number;
    height: number;
    quality?: "low" | "medium" | "high";
    style?: string;
    seed?: number;
  };
  metadata?: Record<string, any>;
}

export interface ImageGenerationResponse {
  id: string;
  requestId: string;
  images: Array<{
    url: string;
    base64?: string;
    metadata?: Record<string, any>;
  }>;
  usage: {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
  timestamp: string;
}

export interface CodeGenerationRequest {
  id: string;
  prompt: string;
  language: string;
  parameters: {
    temperature?: number;
    maxTokens?: number;
    includeComments?: boolean;
    includeTests?: boolean;
  };
  context?: {
    existingCode?: string;
    requirements?: string[];
    framework?: string;
  };
  metadata?: Record<string, any>;
}

export interface CodeGenerationResponse {
  id: string;
  requestId: string;
  code: string;
  explanation?: string;
  tests?: string;
  usage: {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
  timestamp: string;
}

export class GoogleAIStudioService {
  private eventBus: any;
  private apiKey?: string;
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";
  private isConnected: boolean = false;
  private availableModels: Map<string, GoogleAIModel> = new Map();
  private generationHistory: Map<string, GenerationResponse> = new Map();
  private imageGenerationHistory: Map<string, ImageGenerationResponse> =
    new Map();
  private codeGenerationHistory: Map<string, CodeGenerationResponse> =
    new Map();

  constructor(eventBus: any, apiKey?: string) {
    const tests = null; // TODO: Define tests
    const code = null; // TODO: Define code
    const requestId = null; // TODO: Define requestId
    const data = null; // TODO: Define data
    const requestId = null; // TODO: Define requestId
    const content = null; // TODO: Define content
    const data = null; // TODO: Define data
    const data = null; // TODO: Define data
    const data = null; // TODO: Define data
    const model = null; // TODO: Define model
    const model = null; // TODO: Define model
    const model = null; // TODO: Define model
    const model = null; // TODO: Define model
    const requestId = null; // TODO: Define requestId
    const model = null; // TODO: Define model
    const data = null; // TODO: Define data
    const response = null; // TODO: Define response
    this.eventBus = eventBus;
    this.apiKey = apiKey;
    this.initializeModels();
  }

  /**
   * Initialize available models
   */
  private initializeModels(): void {
    const models: GoogleAIModel[] = [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        type: "text",
        capabilities: ["text-generation", "conversation", "reasoning"],
        maxTokens: 32768,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
      {
        id: "gemini-pro-vision",
        name: "Gemini Pro Vision",
        type: "multimodal",
        capabilities: ["text-generation", "image-analysis", "conversation"],
        maxTokens: 32768,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
      {
        id: "code-gecko",
        name: "Code Gecko",
        type: "code",
        capabilities: [
          "code-generation",
          "code-completion",
          "code-explanation",
        ],
        maxTokens: 16384,
        temperature: 0.3,
        topP: 0.95,
        topK: 40,
      },
      {
        id: "imagen-2",
        name: "Imagen 2",
        type: "image",
        capabilities: ["image-generation", "image-editing"],
        maxTokens: 4096,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    ];

    models.forEach((model) => {
      this.availableModels.set(model.id, model);
    });
  }

  /**
   * Set API key for authentication
   */
  setAPIKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.isConnected = !!apiKey;

    this.eventBus.emit("google-ai:api-key-set", {
      timestamp: new Date().toISOString(),
      hasKey: !!apiKey,
    });
  }

  /**
   * Test connection to Google AI Studio
   */
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      throw new Error("API key not set");
    }

    try {
      this.isConnected = response.ok;

      this.eventBus.emit("google-ai:connection-tested", {
        timestamp: new Date().toISOString(),
        connected: this.isConnected,
        models: data.models?.length || 0,
      });

      return this.isConnected;
    } catch (error) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      this.isConnected = false;
      console.error("Failed to connect to Google AI Studio:", error);

      this.eventBus.emit("google-ai:connection-failed", {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return false;
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): GoogleAIModel[] {
    return Array.from(this.availableModels.values());
  }

  /**
   * Get specific model
   */
  getModel(modelId: string): GoogleAIModel | null {
    return this.availableModels.get(modelId) || null;
  }

  /**
   * Generate text using Google AI Studio
   */
  async generateText(
    request: Omit<GenerationRequest, "id">,
  ): Promise<GenerationResponse> {
    if (!this.isConnected || !this.apiKey) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      throw new Error("Not connected to Google AI Studio");
    }

    if (!model) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      throw new Error(`Model ${request.modelId} not found`);
    }

    const fullRequest: GenerationRequest = {
      ...request,
      id: requestId,
    };

    try {
      // Prepare request payload
      const payload = {
        contents: [
          ...(request.context?.systemPrompt
            ? [
                {
                  role: "user",
                  parts: [{ text: request.context.systemPrompt }],
                },
              ]
            : []),
          ...(request.context?.conversationHistory?.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })) || []),
          {
            role: "user",
            parts: [{ text: request.prompt }],
          },
        ],
        generationConfig: {
          temperature: request.parameters.temperature ?? model.temperature,
          topP: request.parameters.topP ?? model.topP,
          topK: request.parameters.topK ?? model.topK,
          maxOutputTokens: request.parameters.maxTokens ?? model.maxTokens,
          stopSequences: request.parameters.stopSequences,
        },
      };

      const response = await fetch(
        `${this.baseUrl}/models/${request.modelId}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      // Extract response content
      const usage = data.usageMetadata || {
        promptTokenCount: 0,
        candidatesTokenCount: 0,
        totalTokenCount: 0,
      };

      const generationResponse: GenerationResponse = {
        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        content,
        usage: {
          promptTokens: usage.promptTokenCount || 0,
          responseTokens: usage.candidatesTokenCount || 0,
          totalTokens: usage.totalTokenCount || 0,
        },
        finishReason: data.candidates?.[0]?.finishReason || "stop",
        safetyRatings: data.candidates?.[0]?.safetyRatings?.map(
          (rating: any) => ({
            category: rating.category,
            probability: rating.probability,
          }),
        ),
        metadata: request.metadata,
        timestamp: new Date().toISOString(),
      };

      this.generationHistory.set(generationResponse.id, generationResponse);

      this.eventBus.emit("google-ai:text-generated", {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: generationResponse.id,
        modelId: request.modelId,
        contentLength: content.length,
        usage: generationResponse.usage,
      });

      return generationResponse;
    } catch (error) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      this.eventBus.emit("google-ai:generation-failed", {
        timestamp: new Date().toISOString(),
        requestId,
        modelId: request.modelId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  /**
   * Generate image using Google AI Studio
   */
  async generateImage(
    request: Omit<ImageGenerationRequest, "id">,
  ): Promise<ImageGenerationResponse> {
    if (!this.isConnected || !this.apiKey) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      throw new Error("Not connected to Google AI Studio");
    }

    const fullRequest: ImageGenerationRequest = {
      ...request,
      id: requestId,
    };

    try {
      // Prepare request payload for image generation
      const payload = {
        prompt: request.prompt,
        width: request.parameters.width,
        height: request.parameters.height,
        quality: request.parameters.quality || "medium",
        style: request.parameters.style,
        seed: request.parameters.seed,
      };

      const response = await fetch(
        `${this.baseUrl}/models/imagen-2:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        throw new Error(
          `Image generation failed: ${response.status} ${response.statusText}`,
        );
      }

      // Extract image data
      const images =
        data.candidates?.[0]?.content?.parts?.map((part: any) => ({
          url: part.inlineData?.data || "",
          base64: part.inlineData?.data || "",
          metadata: {
            mimeType: part.inlineData?.mimeType,
            width: request.parameters.width,
            height: request.parameters.height,
          },
        })) || [];

      const imageResponse: ImageGenerationResponse = {
        id: `img_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        images,
        usage: {
          promptTokens: 0, // Image generation doesn't return token usage
          responseTokens: 0,
          totalTokens: 0,
        },
        timestamp: new Date().toISOString(),
      };

      this.imageGenerationHistory.set(imageResponse.id, imageResponse);

      this.eventBus.emit("google-ai:image-generated", {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: imageResponse.id,
        imageCount: images.length,
        dimensions: `${request.parameters.width}x${request.parameters.height}`,
      });

      return imageResponse;
    } catch (error) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      this.eventBus.emit("google-ai:image-generation-failed", {
        timestamp: new Date().toISOString(),
        requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  /**
   * Generate code using Google AI Studio
   */
  async generateCode(
    request: Omit<CodeGenerationRequest, "id">,
  ): Promise<CodeGenerationResponse> {
    if (!this.isConnected || !this.apiKey) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      throw new Error("Not connected to Google AI Studio");
    }

    const fullRequest: CodeGenerationRequest = {
      ...request,
      id: requestId,
    };

    try {
      // Prepare code generation prompt

      if (request.context?.framework) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        prompt += `\n\nFramework: ${request.context.framework}`;
      }

      if (request.context?.requirements?.length) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        prompt += `\n\nRequirements:\n${request.context.requirements.map((req) => `- ${req}`).join("\n")}`;
      }

      if (request.context?.existingCode) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        prompt += `\n\nExisting code:\n\`\`\`${request.language}\n${request.context.existingCode}\n\`\`\``;
      }

      if (request.parameters.includeComments) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        prompt += "\n\nPlease include detailed comments explaining the code.";
      }

      if (request.parameters.includeTests) {
        const tests = null; // TODO: Define tests
        const code = null; // TODO: Define code
        const requestId = null; // TODO: Define requestId
        const data = null; // TODO: Define data
        const requestId = null; // TODO: Define requestId
        const content = null; // TODO: Define content
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const data = null; // TODO: Define data
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const model = null; // TODO: Define model
        const requestId = null; // TODO: Define requestId
        const model = null; // TODO: Define model
        const data = null; // TODO: Define data
        const response = null; // TODO: Define response
        prompt += "\n\nPlease include unit tests for the generated code.";
      }

      // Use text generation with code-specific parameters
      const textResponse = await this.generateText({
        modelId: "code-gecko",
        prompt,
        parameters: {
          temperature: request.parameters.temperature ?? 0.3,
          maxTokens: request.parameters.maxTokens ?? 16384,
        },
        metadata: {
          type: "code-generation",
          language: request.language,
          ...request.metadata,
        },
      });

      // Parse code from response

      // Extract explanation if present

      // Extract tests if present

      const codeResponse: CodeGenerationResponse = {
        id: `code_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        code,
        explanation,
        tests,
        usage: textResponse.usage,
        timestamp: new Date().toISOString(),
      };

      this.codeGenerationHistory.set(codeResponse.id, codeResponse);

      this.eventBus.emit("google-ai:code-generated", {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: codeResponse.id,
        language: request.language,
        codeLength: code.length,
        hasTests: !!tests,
        usage: codeResponse.usage,
      });

      return codeResponse;
    } catch (error) {
      const tests = null; // TODO: Define tests
      const code = null; // TODO: Define code
      const requestId = null; // TODO: Define requestId
      const data = null; // TODO: Define data
      const requestId = null; // TODO: Define requestId
      const content = null; // TODO: Define content
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const data = null; // TODO: Define data
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const model = null; // TODO: Define model
      const requestId = null; // TODO: Define requestId
      const model = null; // TODO: Define model
      const data = null; // TODO: Define data
      const response = null; // TODO: Define response
      this.eventBus.emit("google-ai:code-generation-failed", {
        timestamp: new Date().toISOString(),
        requestId,
        language: request.language,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  }

  /**
   * Get generation history
   */
  getGenerationHistory(limit: number = 50): GenerationResponse[] {
    return Array.from(this.generationHistory.values())
      .sort(
        (a, b) =>
          new Date(b.timestamp || Date.now()).getTime() -
          new Date(a.timestamp || Date.now()).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Get image generation history
   */
  getImageGenerationHistory(limit: number = 20): ImageGenerationResponse[] {
    return Array.from(this.imageGenerationHistory.values())
      .sort(
        (a, b) =>
          new Date(b.timestamp || Date.now()).getTime() -
          new Date(a.timestamp || Date.now()).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Get code generation history
   */
  getCodeGenerationHistory(limit: number = 20): CodeGenerationResponse[] {
    return Array.from(this.codeGenerationHistory.values())
      .sort(
        (a, b) =>
          new Date(b.timestamp || Date.now()).getTime() -
          new Date(a.timestamp || Date.now()).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Get service status
   */
  getStatus(): {
    connected: boolean;
    hasApiKey: boolean;
    availableModels: number;
    totalGenerations: number;
    totalImages: number;
    totalCode: number;
  } {
    return {
      connected: this.isConnected,
      hasApiKey: !!this.apiKey,
      availableModels: this.availableModels.size,
      totalGenerations: this.generationHistory.size,
      totalImages: this.imageGenerationHistory.size,
      totalCode: this.codeGenerationHistory.size,
    };
  }
}
