import { EventBus } from './eventBus';

export interface CodexModel {
  id: string;
  name: string;
  type: 'code' | 'text' | 'edit';
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface CodexCompletionRequest {
  id: string;
  modelId: string;
  prompt: string;
  parameters: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
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

export interface CodexCompletionResponse {
  id: string;
  requestId: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter';
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface CodexEditRequest {
  id: string;
  modelId: string;
  instruction: string;
  code: string;
  parameters: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
  context?: {
    language?: string;
    framework?: string;
    requirements?: string[];
  };
  metadata?: Record<string, any>;
}

export interface CodexEditResponse {
  id: string;
  requestId: string;
  originalCode: string;
  editedCode: string;
  changes: Array<{
    type: 'addition' | 'deletion' | 'modification';
    line?: number;
    content?: string;
    description: string;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: string;
}

export interface CodexAnalysisRequest {
  id: string;
  modelId: string;
  code: string;
  analysisType: 'review' | 'optimization' | 'security' | 'documentation' | 'testing';
  parameters: {
    temperature?: number;
    maxTokens?: number;
    includeExamples?: boolean;
    includeSuggestions?: boolean;
  };
  context?: {
    language?: string;
    framework?: string;
    projectType?: string;
  };
  metadata?: Record<string, any>;
}

export interface CodexAnalysisResponse {
  id: string;
  requestId: string;
  analysisType: string;
  summary: string;
  findings: Array<{
    type: 'info' | 'warning' | 'error' | 'suggestion';
    message: string;
    line?: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion?: string;
  }>;
  recommendations: string[];
  examples?: string[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: string;
}

export interface CodexFunctionRequest {
  id: string;
  modelId: string;
  description: string;
  language: string;
  parameters: {
    temperature?: number;
    maxTokens?: number;
    includeTests?: boolean;
    includeDocumentation?: boolean;
  };
  context?: {
    functionName?: string;
    returnType?: string;
    parameters?: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
    }>;
    framework?: string;
    style?: string;
  };
  metadata?: Record<string, any>;
}

export interface CodexFunctionResponse {
  id: string;
  requestId: string;
  functionName: string;
  code: string;
  documentation?: string;
  tests?: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: string;
}

export class OpenAICodexService {
  private eventBus: EventBus;
  private apiKey?: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private isConnected: boolean = false;
  private availableModels: Map<string, CodexModel> = new Map();
  private completionHistory: Map<string, CodexCompletionResponse> = new Map();
  private editHistory: Map<string, CodexEditResponse> = new Map();
  private analysisHistory: Map<string, CodexAnalysisResponse> = new Map();
  private functionHistory: Map<string, CodexFunctionResponse> = new Map();

  constructor(eventBus: EventBus, apiKey?: string) {
    this.eventBus = eventBus;
    this.apiKey = apiKey;
    this.initializeModels();
  }

  /**
   * Initialize available models
   */
  private initializeModels(): void {
    const models: CodexModel[] = [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        type: 'text',
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        maxTokens: 8192,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        type: 'text',
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        maxTokens: 128000,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        type: 'text',
        capabilities: ['text-generation', 'code-generation'],
        maxTokens: 4096,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      {
        id: 'code-davinci-002',
        name: 'Code Davinci 002',
        type: 'code',
        capabilities: ['code-generation', 'code-completion', 'code-analysis'],
        maxTokens: 8000,
        temperature: 0.3,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      }
    ];

    models.forEach(model => {
      this.availableModels.set(model.id, model);
    });
  }

  /**
   * Set API key for authentication
   */
  setAPIKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.isConnected = !!apiKey;
    
    this.eventBus.emit('openai-codex:api-key-set', {
      timestamp: new Date().toISOString(),
      hasKey: !!apiKey
    });
  }

  /**
   * Test connection to OpenAI API
   */
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      this.isConnected = response.ok;
      
      this.eventBus.emit('openai-codex:connection-tested', {
        timestamp: new Date().toISOString(),
        connected: this.isConnected,
        status: response.status
      });

      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      console.error('Failed to connect to OpenAI API:', error);
      
      this.eventBus.emit('openai-codex:connection-failed', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return false;
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): CodexModel[] {
    return Array.from(this.availableModels.values());
  }

  /**
   * Get specific model
   */
  getModel(modelId: string): CodexModel | null {
    return this.availableModels.get(modelId) || null;
  }

  /**
   * Generate code completion using OpenAI Codex
   */
  async generateCompletion(request: Omit<CodexCompletionRequest, 'id'>): Promise<CodexCompletionResponse> {
    if (!this.isConnected || !this.apiKey) {
      throw new Error('Not connected to OpenAI API');
    }

    const model = this.availableModels.get(request.modelId);
    if (!model) {
      throw new Error(`Model ${request.modelId} not found`);
    }

    const requestId = `completion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRequest: CodexCompletionRequest = {
      ...request,
      id: requestId
    };

    try {
      // Prepare messages for chat completion
      const messages = [];
      
      if (request.context?.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.context.systemPrompt
        });
      }

      if (request.context?.conversationHistory) {
        messages.push(...request.context.conversationHistory);
      }

      if (request.context?.fileContext) {
        messages.push({
          role: 'user',
          content: `File context:\n\`\`\`${request.context.language || 'text'}\n${request.context.fileContext}\n\`\`\`\n\nRequest: ${request.prompt}`
        });
      } else {
        messages.push({
          role: 'user',
          content: request.prompt
        });
      }

      const payload = {
        model: request.modelId,
        messages,
        temperature: request.parameters.temperature ?? model.temperature,
        top_p: request.parameters.topP ?? model.topP,
        max_tokens: request.parameters.maxTokens ?? model.maxTokens,
        frequency_penalty: request.parameters.frequencyPenalty ?? model.frequencyPenalty,
        presence_penalty: request.parameters.presencePenalty ?? model.presencePenalty,
        stop: request.parameters.stop
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const content = data.choices?.[0]?.message?.content || '';
      const usage = data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      };

      const completionResponse: CodexCompletionResponse = {
        id: `completion_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        content,
        usage: {
          promptTokens: usage.prompt_tokens || 0,
          completionTokens: usage.completion_tokens || 0,
          totalTokens: usage.total_tokens || 0
        },
        finishReason: data.choices?.[0]?.finish_reason || 'stop',
        metadata: request.metadata,
        timestamp: new Date().toISOString()
      };

      this.completionHistory.set(completionResponse.id, completionResponse);

      this.eventBus.emit('openai-codex:completion-generated', {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: completionResponse.id,
        modelId: request.modelId,
        contentLength: content.length,
        usage: completionResponse.usage
      });

      return completionResponse;

    } catch (error) {
      this.eventBus.emit('openai-codex:completion-failed', {
        timestamp: new Date().toISOString(),
        requestId,
        modelId: request.modelId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Edit code using OpenAI Codex
   */
  async editCode(request: Omit<CodexEditRequest, 'id'>): Promise<CodexEditResponse> {
    if (!this.isConnected || !this.apiKey) {
      throw new Error('Not connected to OpenAI API');
    }

    const requestId = `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRequest: CodexEditRequest = {
      ...request,
      id: requestId
    };

    try {
      // Prepare edit prompt
      let prompt = `Edit the following code according to this instruction: ${request.instruction}\n\n`;
      prompt += `Language: ${request.context?.language || 'text'}\n`;
      if (request.context?.framework) {
        prompt += `Framework: ${request.context.framework}\n`;
      }
      prompt += `\nOriginal code:\n\`\`\`${request.context?.language || 'text'}\n${request.code}\n\`\`\``;

      const completionResponse = await this.generateCompletion({
        modelId: request.modelId,
        prompt,
        parameters: {
          temperature: request.parameters.temperature ?? 0.3,
          maxTokens: request.parameters.maxTokens ?? 4000
        },
        context: {
          systemPrompt: 'You are a code editor. Provide only the edited code without explanations unless specifically requested.'
        },
        metadata: {
          type: 'code-edit',
          originalCode: request.code,
          ...request.metadata
        }
      });

      // Extract edited code
      const codeMatch = completionResponse.content.match(/```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/);
      const editedCode = codeMatch ? codeMatch[1] : completionResponse.content;

      // Simple diff analysis (in a real implementation, you'd use a proper diff library)
      const changes = this.analyzeCodeChanges(request.code, editedCode);

      const editResponse: CodexEditResponse = {
        id: `edit_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        originalCode: request.code,
        editedCode,
        changes,
        usage: completionResponse.usage,
        timestamp: new Date().toISOString()
      };

      this.editHistory.set(editResponse.id, editResponse);

      this.eventBus.emit('openai-codex:code-edited', {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: editResponse.id,
        modelId: request.modelId,
        changesCount: changes.length,
        usage: editResponse.usage
      });

      return editResponse;

    } catch (error) {
      this.eventBus.emit('openai-codex:edit-failed', {
        timestamp: new Date().toISOString(),
        requestId,
        modelId: request.modelId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Analyze code using OpenAI Codex
   */
  async analyzeCode(request: Omit<CodexAnalysisRequest, 'id'>): Promise<CodexAnalysisResponse> {
    if (!this.isConnected || !this.apiKey) {
      throw new Error('Not connected to OpenAI API');
    }

    const requestId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRequest: CodexAnalysisRequest = {
      ...request,
      id: requestId
    };

    try {
      // Prepare analysis prompt
      let prompt = `Analyze the following code for ${request.analysisType}:\n\n`;
      prompt += `Language: ${request.context?.language || 'text'}\n`;
      if (request.context?.framework) {
        prompt += `Framework: ${request.context.framework}\n`;
      }
      if (request.context?.projectType) {
        prompt += `Project Type: ${request.context.projectType}\n`;
      }
      prompt += `\nCode:\n\`\`\`${request.context?.language || 'text'}\n${request.code}\n\`\`\`\n\n`;
      prompt += `Please provide a comprehensive ${request.analysisType} analysis including:\n`;
      prompt += `- Summary of findings\n`;
      prompt += `- Specific issues and their severity\n`;
      prompt += `- Recommendations for improvement\n`;
      if (request.parameters.includeExamples) {
        prompt += `- Code examples where applicable\n`;
      }

      const completionResponse = await this.generateCompletion({
        modelId: request.modelId,
        prompt,
        parameters: {
          temperature: request.parameters.temperature ?? 0.3,
          maxTokens: request.parameters.maxTokens ?? 4000
        },
        context: {
          systemPrompt: `You are a code analyst specializing in ${request.analysisType}. Provide structured, actionable feedback.`
        },
        metadata: {
          type: 'code-analysis',
          analysisType: request.analysisType,
          ...request.metadata
        }
      });

      // Parse analysis response
      const analysis = this.parseAnalysisResponse(completionResponse.content, request.analysisType);

      const analysisResponse: CodexAnalysisResponse = {
        id: `analysis_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        analysisType: request.analysisType,
        summary: analysis.summary,
        findings: analysis.findings,
        recommendations: analysis.recommendations,
        examples: analysis.examples,
        usage: completionResponse.usage,
        timestamp: new Date().toISOString()
      };

      this.analysisHistory.set(analysisResponse.id, analysisResponse);

      this.eventBus.emit('openai-codex:code-analyzed', {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: analysisResponse.id,
        modelId: request.modelId,
        analysisType: request.analysisType,
        findingsCount: analysis.findings.length,
        usage: analysisResponse.usage
      });

      return analysisResponse;

    } catch (error) {
      this.eventBus.emit('openai-codex:analysis-failed', {
        timestamp: new Date().toISOString(),
        requestId,
        modelId: request.modelId,
        analysisType: request.analysisType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Generate function using OpenAI Codex
   */
  async generateFunction(request: Omit<CodexFunctionRequest, 'id'>): Promise<CodexFunctionResponse> {
    if (!this.isConnected || !this.apiKey) {
      throw new Error('Not connected to OpenAI API');
    }

    const requestId = `function_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRequest: CodexFunctionRequest = {
      ...request,
      id: requestId
    };

    try {
      // Prepare function generation prompt
      let prompt = `Generate a ${request.language} function with the following description: ${request.description}\n\n`;
      
      if (request.context?.functionName) {
        prompt += `Function name: ${request.context.functionName}\n`;
      }
      
      if (request.context?.returnType) {
        prompt += `Return type: ${request.context.returnType}\n`;
      }
      
      if (request.context?.parameters?.length) {
        prompt += `Parameters:\n${request.context.parameters.map(param => 
          `- ${param.name}: ${param.type}${param.required ? ' (required)' : ' (optional)'} - ${param.description}`
        ).join('\n')}\n`;
      }
      
      if (request.context?.framework) {
        prompt += `Framework: ${request.context.framework}\n`;
      }
      
      if (request.context?.style) {
        prompt += `Coding style: ${request.context.style}\n`;
      }

      if (request.parameters.includeTests) {
        prompt += '\nPlease include unit tests for the function.';
      }

      if (request.parameters.includeDocumentation) {
        prompt += '\nPlease include comprehensive documentation.';
      }

      const completionResponse = await this.generateCompletion({
        modelId: request.modelId,
        prompt,
        parameters: {
          temperature: request.parameters.temperature ?? 0.3,
          maxTokens: request.parameters.maxTokens ?? 4000
        },
        context: {
          systemPrompt: 'You are a function generator. Provide clean, well-structured code with proper error handling.'
        },
        metadata: {
          type: 'function-generation',
          language: request.language,
          ...request.metadata
        }
      });

      // Parse function response
      const functionData = this.parseFunctionResponse(completionResponse.content, request.language);

      const functionResponse: CodexFunctionResponse = {
        id: `function_response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestId,
        functionName: functionData.functionName,
        code: functionData.code,
        documentation: functionData.documentation,
        tests: functionData.tests,
        usage: completionResponse.usage,
        timestamp: new Date().toISOString()
      };

      this.functionHistory.set(functionResponse.id, functionResponse);

      this.eventBus.emit('openai-codex:function-generated', {
        timestamp: new Date().toISOString(),
        requestId,
        responseId: functionResponse.id,
        modelId: request.modelId,
        language: request.language,
        functionName: functionData.functionName,
        usage: functionResponse.usage
      });

      return functionResponse;

    } catch (error) {
      this.eventBus.emit('openai-codex:function-generation-failed', {
        timestamp: new Date().toISOString(),
        requestId,
        modelId: request.modelId,
        language: request.language,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Analyze code changes (simple implementation)
   */
  private analyzeCodeChanges(originalCode: string, editedCode: string): Array<{
    type: 'addition' | 'deletion' | 'modification';
    line?: number;
    content?: string;
    description: string;
  }> {
    const changes = [];
    const originalLines = originalCode.split('\n');
    const editedLines = editedCode.split('\n');

    if (originalLines.length !== editedLines.length) {
      changes.push({
        type: 'modification',
        description: `Number of lines changed from ${originalLines.length} to ${editedLines.length}`
      });
    }

    // Simple line-by-line comparison
    const maxLines = Math.max(originalLines.length, editedLines.length);
    for (let i = 0; i < maxLines; i++) {
      if (i >= originalLines.length) {
        changes.push({
          type: 'addition',
          line: i + 1,
          content: editedLines[i],
          description: `Added line ${i + 1}`
        });
      } else if (i >= editedLines.length) {
        changes.push({
          type: 'deletion',
          line: i + 1,
          content: originalLines[i],
          description: `Deleted line ${i + 1}`
        });
      } else if (originalLines[i] !== editedLines[i]) {
        changes.push({
          type: 'modification',
          line: i + 1,
          content: editedLines[i],
          description: `Modified line ${i + 1}`
        });
      }
    }

    return changes;
  }

  /**
   * Parse analysis response
   */
  private parseAnalysisResponse(content: string, analysisType: string): {
    summary: string;
    findings: Array<{
      type: 'info' | 'warning' | 'error' | 'suggestion';
      message: string;
      line?: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      suggestion?: string;
    }>;
    recommendations: string[];
    examples?: string[];
  } {
    // Simple parsing - in a real implementation, you'd use more sophisticated parsing
    const lines = content.split('\n');
    const summary = lines[0] || 'Analysis completed';
    const findings: any[] = [];
    const recommendations: string[] = [];
    const examples: string[] = [];

    // Extract findings, recommendations, and examples from the response
    // This is a simplified parser - you'd want more robust parsing
    lines.forEach(line => {
      if (line.toLowerCase().includes('warning') || line.toLowerCase().includes('error')) {
        findings.push({
          type: line.toLowerCase().includes('error') ? 'error' : 'warning',
          message: line,
          severity: line.toLowerCase().includes('critical') ? 'critical' : 'medium'
        });
      } else if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('suggest')) {
        recommendations.push(line);
      } else if (line.includes('```')) {
        examples.push(line);
      }
    });

    return {
      summary,
      findings,
      recommendations,
      examples: examples.length > 0 ? examples : undefined
    };
  }

  /**
   * Parse function response
   */
  private parseFunctionResponse(content: string, language: string): {
    functionName: string;
    code: string;
    documentation?: string;
    tests?: string;
  } {
    // Extract function name from code
    const functionMatch = content.match(/(?:function|def|const|let|var)\s+(\w+)/);
    const functionName = functionMatch ? functionMatch[1] : 'generatedFunction';

    // Extract code blocks
    const codeMatch = content.match(/```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1] : content;

    // Extract documentation and tests
    const documentationMatch = content.match(/Documentation:([\s\S]*?)(?=```|Tests:|$)/);
    const documentation = documentationMatch ? documentationMatch[1].trim() : undefined;

    const testsMatch = content.match(/Tests?:([\s\S]*?)(?=```|$)/);
    const tests = testsMatch ? testsMatch[1].trim() : undefined;

    return {
      functionName,
      code,
      documentation,
      tests
    };
  }

  /**
   * Get completion history
   */
  getCompletionHistory(limit: number = 50): CodexCompletionResponse[] {
    return Array.from(this.completionHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get edit history
   */
  getEditHistory(limit: number = 20): CodexEditResponse[] {
    return Array.from(this.editHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get analysis history
   */
  getAnalysisHistory(limit: number = 20): CodexAnalysisResponse[] {
    return Array.from(this.analysisHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get function generation history
   */
  getFunctionHistory(limit: number = 20): CodexFunctionResponse[] {
    return Array.from(this.functionHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get service status
   */
  getStatus(): {
    connected: boolean;
    hasApiKey: boolean;
    availableModels: number;
    totalCompletions: number;
    totalEdits: number;
    totalAnalyses: number;
    totalFunctions: number;
  } {
    return {
      connected: this.isConnected,
      hasApiKey: !!this.apiKey,
      availableModels: this.availableModels.size,
      totalCompletions: this.completionHistory.size,
      totalEdits: this.editHistory.size,
      totalAnalyses: this.analysisHistory.size,
      totalFunctions: this.functionHistory.size
    };
  }
} 