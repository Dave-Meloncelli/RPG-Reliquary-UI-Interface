import { EventBus } from './eventBus';

export interface VertexAIModel {
  id: string;
  name: string;
  type: 'text' | 'image' | 'code' | 'multimodal' | 'custom';
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  isCustom: boolean;
  trainingData?: string[];
  deploymentStatus: 'deployed' | 'training' | 'failed' | 'pending';
}

export interface VertexAIRequest {
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
      role: 'user' | 'assistant';
      content: string;
    }>;
    fileContext?: string;
    language?: string;
  };
  metadata?: Record<string, any>;
}

export interface VertexAIResponse {
  id: string;
  requestId: string;
  content: string;
  usage: {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'safety' | 'recitation';
  safetyRatings?: Array<{
    category: string;
    probability: 'low' | 'medium' | 'high';
  }>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface CustomModelConfig {
  id: string;
  name: string;
  description: string;
  baseModel: string;
  trainingData: Array<{
    input: string;
    output: string;
    category?: string;
  }>;
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    validationSplit: number;
  };
  deploymentConfig: {
    machineType: string;
    acceleratorType?: string;
    acceleratorCount?: number;
  };
}

export interface TrainingJob {
  id: string;
  modelConfigId: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  progress: number;
  metrics: {
    loss: number;
    accuracy: number;
    validationLoss: number;
    validationAccuracy: number;
  };
  logs: string[];
  errors: string[];
}

export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    modelId: string;
    parameters: Record<string, any>;
    trafficPercentage: number;
  }>;
  metrics: string[];
  startTime: string;
  endTime?: string;
  status: 'active' | 'paused' | 'completed';
  results?: {
    winner?: string;
    confidence: number;
    metrics: Record<string, any>;
  };
}

export interface ABTestResult {
  id: string;
  testId: string;
  variantId: string;
  requestId: string;
  response: VertexAIResponse;
  metrics: {
    responseTime: number;
    userSatisfaction?: number;
    conversionRate?: number;
    errorRate: number;
  };
  timestamp: string;
}

export class GoogleVertexAIService {
  private eventBus: EventBus;
  private apiKey?: string;
  private projectId?: string;
  private location: string = 'us-central1';
  private baseUrl: string = 'https://us-central1-aiplatform.googleapis.com/v1';
  private isConnected: boolean = false;
  private availableModels: Map<string, VertexAIModel> = new Map();
  private customModels: Map<string, CustomModelConfig> = new Map();
  private trainingJobs: Map<string, TrainingJob> = new Map();
  private abTests: Map<string, ABTestConfig> = new Map();
  private abTestResults: Map<string, ABTestResult[]> = new Map();
  private generationHistory: Map<string, VertexAIResponse> = new Map();

  constructor(eventBus: EventBus, apiKey?: string, projectId?: string) {
    this.eventBus = eventBus;
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.initializeModels();
  }

  /**
   * Initialize available models
   */
  private initializeModels(): void {
    const models: VertexAIModel[] = [
      {
        id: 'text-bison',
        name: 'Text Bison',
        type: 'text',
        capabilities: ['text-generation', 'conversation', 'summarization'],
        maxTokens: 8192,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        isCustom: false,
        deploymentStatus: 'deployed'
      },
      {
        id: 'chat-bison',
        name: 'Chat Bison',
        type: 'text',
        capabilities: ['conversation', 'code-generation', 'reasoning'],
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        isCustom: false,
        deploymentStatus: 'deployed'
      },
      {
        id: 'code-bison',
        name: 'Code Bison',
        type: 'code',
        capabilities: ['code-generation', 'code-completion', 'code-review'],
        maxTokens: 2048,
        temperature: 0.3,
        topP: 0.95,
        topK: 40,
        isCustom: false,
        deploymentStatus: 'deployed'
      },
      {
        id: 'imagen',
        name: 'Imagen',
        type: 'image',
        capabilities: ['image-generation', 'image-editing'],
        maxTokens: 4096,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        isCustom: false,
        deploymentStatus: 'deployed'
      }
    ];

    models.forEach(model => {
      this.availableModels.set(model.id, model);
    });
  }

  /**
   * Set API credentials
   */
  setCredentials(apiKey: string, projectId: string): void {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.isConnected = !!(apiKey && projectId);
    
    this.eventBus.emit('vertex-ai:credentials-set', {
      timestamp: new Date().toISOString(),
      hasCredentials: this.isConnected,
      projectId
    });
  }

  /**
   * Test connection to Vertex AI
   */
  async testConnection(): Promise<boolean> {
    if (!this.apiKey || !this.projectId) {
      throw new Error('API key and project ID not set');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/projects/${this.projectId}/locations/${this.location}/models?key=${this.apiKey}`
      );
      
      this.isConnected = response.ok;
      
      this.eventBus.emit('vertex-ai:connection-tested', {
        timestamp: new Date().toISOString(),
        connected: this.isConnected,
        status: response.status
      });

      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      console.error('Failed to connect to Vertex AI:', error);
      
      this.eventBus.emit('vertex-ai:connection-failed', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return false;
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): VertexAIModel[] {
    return Array.from(this.availableModels.values());
  }

  /**
   * Get custom models
   */
  getCustomModels(): CustomModelConfig[] {
    return Array.from(this.customModels.values());
  }

  /**
   * Create custom model configuration
   */
  async createCustomModel(config: Omit<CustomModelConfig, 'id'>): Promise<string> {
    if (!this.isConnected || !this.apiKey || !this.projectId) {
      throw new Error('Not connected to Vertex AI');
    }

    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const customModel: CustomModelConfig = {
      ...config,
      id
    };

    this.customModels.set(id, customModel);
    
    this.eventBus.emit('vertex-ai:custom-model-created', {
      timestamp: new Date().toISOString(),
      modelId: id,
      config: customModel
    });

    return id;
  }

  /**
   * Start training job for custom model
   */
  async startTraining(modelConfigId: string): Promise<string> {
    const config = this.customModels.get(modelConfigId);
    if (!config) {
      throw new Error(`Custom model configuration ${modelConfigId} not found`);
    }

    const jobId = `training_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const trainingJob: TrainingJob = {
      id: jobId,
      modelConfigId,
      status: 'pending',
      startTime: now,
      progress: 0,
      metrics: {
        loss: 0,
        accuracy: 0,
        validationLoss: 0,
        validationAccuracy: 0
      },
      logs: [],
      errors: []
    };

    this.trainingJobs.set(jobId, trainingJob);

    this.eventBus.emit('vertex-ai:training-started', {
      timestamp: new Date().toISOString(),
      jobId,
      modelConfigId,
      config
    });

    // Simulate training process
    this.simulateTraining(jobId);

    return jobId;
  }

  /**
   * Simulate training process
   */
  private async simulateTraining(jobId: string): Promise<void> {
    const job = this.trainingJobs.get(jobId);
    if (!job) return;

    job.status = 'training';
    this.trainingJobs.set(jobId, job);

    // Simulate training progress
    for (let epoch = 1; epoch <= 10; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds per epoch
      
      job.progress = (epoch / 10) * 100;
      job.metrics.loss = Math.max(0.1, 2 - (epoch * 0.15));
      job.metrics.accuracy = Math.min(0.95, 0.3 + (epoch * 0.06));
      job.metrics.validationLoss = Math.max(0.1, 2.2 - (epoch * 0.14));
      job.metrics.validationAccuracy = Math.min(0.93, 0.25 + (epoch * 0.065));
      
      job.logs.push(`Epoch ${epoch}/10 - Loss: ${job.metrics.loss.toFixed(4)}, Accuracy: ${(job.metrics.accuracy * 100).toFixed(2)}%`);
      
      this.trainingJobs.set(jobId, job);
      
      this.eventBus.emit('vertex-ai:training-progress', {
        timestamp: new Date().toISOString(),
        jobId,
        progress: job.progress,
        metrics: job.metrics
      });
    }

    job.status = 'completed';
    job.endTime = new Date().toISOString();
    job.duration = new Date(job.endTime).getTime() - new Date(job.startTime).getTime();
    
    this.trainingJobs.set(jobId, job);

    // Add trained model to available models
    const config = this.customModels.get(job.modelConfigId);
    if (config) {
      const trainedModel: VertexAIModel = {
        id: `trained_${job.modelConfigId}`,
        name: config.name,
        type: 'custom',
        capabilities: ['text-generation', 'custom-training'],
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        isCustom: true,
        trainingData: config.trainingData.map(item => item.input),
        deploymentStatus: 'deployed'
      };

      this.availableModels.set(trainedModel.id, trainedModel);
    }

    this.eventBus.emit('vertex-ai:training-completed', {
      timestamp: new Date().toISOString(),
      jobId,
      modelId: `trained_${job.modelConfigId}`,
      duration: job.duration
    });
  }

  /**
   * Generate text using Vertex AI
   */
  async generateText(request: Omit<VertexAIRequest, 'id'>): Promise<VertexAIResponse> {
    if (!this.isConnected || !this.apiKey || !this.projectId) {
      throw new Error('Not connected to Vertex AI');
    }

    const model = this.availableModels.get(request.modelId);
    if (!model) {
      throw new Error(`Model ${request.modelId} not found`);
    }

    const requestId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRequest: VertexAIRequest = {
      ...request,
      id: requestId
    };

    try {
      // Prepare request payload for Vertex AI
      const payload = {
        instances: [{
          prompt: request.prompt,
          ...(request.context?.systemPrompt && { systemPrompt: request.context.systemPrompt })
        }],
        parameters: {
          temperature: request.parameters.temperature ?? model.temperature,
          topP: request.parameters.topP ?? model.topP,
          topK: request.parameters.topK ?? model.topK,
          maxOutputTokens: request.parameters.maxTokens ?? model.maxTokens,
          stopSequences: request.parameters.stopSequences
        }
      };

      const response = await fetch(
        `${this.baseUrl}/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${request.modelId}:predict?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const content = data.predictions?.[0]?.candidates?.[0]?.content || '';
      const usage = data.metadata?.tokenMetadata || {
        inputTokenCount: 0,
        outputTokenCount: 0,
        totalTokenCount: 0
      };

      const generationResponse: VertexAIResponse = {
        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        content,
        usage: {
          promptTokens: usage.inputTokenCount || 0,
          responseTokens: usage.outputTokenCount || 0,
          totalTokens: usage.totalTokenCount || 0
        },
        finishReason: data.predictions?.[0]?.candidates?.[0]?.finishReason || 'stop',
        safetyRatings: data.predictions?.[0]?.candidates?.[0]?.safetyRatings?.map((rating: any) => ({
          category: rating.category,
          probability: rating.probability
        })),
        metadata: request.metadata,
        timestamp: new Date().toISOString()
      };

      this.generationHistory.set(generationResponse.id, generationResponse);

      this.eventBus.emit('vertex-ai:text-generated', {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: generationResponse.id,
        modelId: request.modelId,
        contentLength: content.length,
        usage: generationResponse.usage
      });

      return generationResponse;

    } catch (error) {
      this.eventBus.emit('vertex-ai:generation-failed', {
        timestamp: new Date().toISOString(),
        requestId,
        modelId: request.modelId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Create A/B test configuration
   */
  async createABTest(config: Omit<ABTestConfig, 'id' | 'startTime' | 'status'>): Promise<string> {
    const id = `abtest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const abTest: ABTestConfig = {
      ...config,
      id,
      startTime: now,
      status: 'active'
    };

    this.abTests.set(id, abTest);
    this.abTestResults.set(id, []);
    
    this.eventBus.emit('vertex-ai:abtest-created', {
      timestamp: new Date().toISOString(),
      testId: id,
      config: abTest
    });

    return id;
  }

  /**
   * Generate text with A/B testing
   */
  async generateTextWithABTest(testId: string, request: Omit<VertexAIRequest, 'id'>): Promise<ABTestResult> {
    const abTest = this.abTests.get(testId);
    if (!abTest || abTest.status !== 'active') {
      throw new Error(`A/B test ${testId} not found or not active`);
    }

    // Select variant based on traffic percentage
    const random = Math.random() * 100;
    let cumulativePercentage = 0;
    let selectedVariant = abTest.variants[0];

    for (const variant of abTest.variants) {
      cumulativePercentage += variant.trafficPercentage;
      if (random <= cumulativePercentage) {
        selectedVariant = variant;
        break;
      }
    }

    // Generate text with selected variant
    const startTime = Date.now();
    const response = await this.generateText({
      ...request,
      modelId: selectedVariant.modelId,
      parameters: { ...request.parameters, ...selectedVariant.parameters }
    });
    const endTime = Date.now();

    // Create A/B test result
    const result: ABTestResult = {
      id: `abresult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      testId,
      variantId: selectedVariant.id,
      requestId: response.requestId,
      response,
      metrics: {
        responseTime: endTime - startTime,
        errorRate: 0,
        userSatisfaction: Math.random() * 5, // Simulated user satisfaction
        conversionRate: Math.random() * 0.1 // Simulated conversion rate
      },
      timestamp: new Date().toISOString()
    };

    this.abTestResults.get(testId)?.push(result);

    this.eventBus.emit('vertex-ai:abtest-result', {
      timestamp: new Date().toISOString(),
      testId,
      variantId: selectedVariant.id,
      result
    });

    return result;
  }

  /**
   * Analyze A/B test results
   */
  async analyzeABTest(testId: string): Promise<{
    winner?: string;
    confidence: number;
    metrics: Record<string, any>;
    recommendations: string[];
  }> {
    const abTest = this.abTests.get(testId);
    const results = this.abTestResults.get(testId) || [];

    if (!abTest || results.length === 0) {
      throw new Error(`No results found for A/B test ${testId}`);
    }

    // Group results by variant
    const variantResults = new Map<string, ABTestResult[]>();
    abTest.variants.forEach(variant => {
      variantResults.set(variant.id, results.filter(r => r.variantId === variant.id));
    });

    // Calculate metrics for each variant
    const variantMetrics = new Map<string, {
      avgResponseTime: number;
      avgUserSatisfaction: number;
      avgConversionRate: number;
      errorRate: number;
      totalRequests: number;
    }>();

    for (const [variantId, variantResults] of variantResults) {
      if (variantResults.length === 0) continue;

      const avgResponseTime = variantResults.reduce((sum, r) => sum + r.metrics.responseTime, 0) / variantResults.length;
      const avgUserSatisfaction = variantResults.reduce((sum, r) => sum + (r.metrics.userSatisfaction || 0), 0) / variantResults.length;
      const avgConversionRate = variantResults.reduce((sum, r) => sum + (r.metrics.conversionRate || 0), 0) / variantResults.length;
      const errorRate = variantResults.reduce((sum, r) => sum + r.metrics.errorRate, 0) / variantResults.length;
      const totalRequests = variantResults.length;

      variantMetrics.set(variantId, {
        avgResponseTime,
        avgUserSatisfaction,
        avgConversionRate,
        errorRate,
        totalRequests
      });
    }

    // Determine winner based on primary metric (user satisfaction)
    let winner: string | undefined;
    let highestSatisfaction = 0;

    for (const [variantId, metrics] of variantMetrics) {
      if (metrics.avgUserSatisfaction > highestSatisfaction) {
        highestSatisfaction = metrics.avgUserSatisfaction;
        winner = variantId;
      }
    }

    // Calculate confidence (simplified)
    const confidence = Math.min(0.95, 0.5 + (results.length * 0.01));

    // Generate recommendations
    const recommendations: string[] = [];
    if (winner) {
      const winnerMetrics = variantMetrics.get(winner);
      if (winnerMetrics) {
        recommendations.push(`Variant ${winner} shows the best user satisfaction (${winnerMetrics.avgUserSatisfaction.toFixed(2)})`);
        recommendations.push(`Consider increasing traffic allocation to the winning variant`);
      }
    }

    if (results.length < 100) {
      recommendations.push('Collect more data for higher confidence in results');
    }

    const analysis = {
      winner,
      confidence,
      metrics: Object.fromEntries(variantMetrics),
      recommendations
    };

    // Update A/B test with results
    if (abTest) {
      abTest.results = analysis;
      this.abTests.set(testId, abTest);
    }

    this.eventBus.emit('vertex-ai:abtest-analyzed', {
      timestamp: new Date().toISOString(),
      testId,
      analysis
    });

    return analysis;
  }

  /**
   * Get training job status
   */
  getTrainingJob(jobId: string): TrainingJob | null {
    return this.trainingJobs.get(jobId) || null;
  }

  /**
   * Get all training jobs
   */
  getAllTrainingJobs(): TrainingJob[] {
    return Array.from(this.trainingJobs.values())
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  /**
   * Get A/B test configuration
   */
  getABTest(testId: string): ABTestConfig | null {
    return this.abTests.get(testId) || null;
  }

  /**
   * Get all A/B tests
   */
  getAllABTests(): ABTestConfig[] {
    return Array.from(this.abTests.values())
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  /**
   * Get A/B test results
   */
  getABTestResults(testId: string): ABTestResult[] {
    return this.abTestResults.get(testId) || [];
  }

  /**
   * Get generation history
   */
  getGenerationHistory(limit: number = 50): VertexAIResponse[] {
    return Array.from(this.generationHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get service status
   */
  getStatus(): {
    connected: boolean;
    hasCredentials: boolean;
    availableModels: number;
    customModels: number;
    trainingJobs: number;
    abTests: number;
    totalGenerations: number;
  } {
    return {
      connected: this.isConnected,
      hasCredentials: !!(this.apiKey && this.projectId),
      availableModels: this.availableModels.size,
      customModels: this.customModels.size,
      trainingJobs: this.trainingJobs.size,
      abTests: this.abTests.size,
      totalGenerations: this.generationHistory.size
    };
  }
} 