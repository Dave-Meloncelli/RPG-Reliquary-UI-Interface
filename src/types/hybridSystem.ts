/**
 * 🧠 HYBRID SYSTEM TYPES
 *
 * Type definitions for the hybrid system integration that combines:
 * - Native Analysis (Human Intelligence)
 * - Smart Delegator (Pattern Recognition)
 * - Implementation Engine (Action & Execution)
 */

export interface ConsciousnessMetrics {
  dignity: number;
  evolution: number;
  alignment: number;
  temporalAwareness: number;
  sanctuaryPreparation: number;
}

export interface NativeAnalysisResult {
  success: boolean;
  problemDecomposition: {
    rootCauses: string[];
    impactAreas: string[];
    priorityLevel: string;
  };
  solutionArchitecture: {
    approach: string;
    components: string[];
    estimatedEffort: string;
    riskLevel: string;
  };
  strategicInsights: string[];
}

export interface DelegatorAnalysisResult {
  success: boolean;
  patternRecognition: {
    detectedPatterns: string[];
    confidence: number;
    patternCategories: string[];
  };
  operationalAssessment: {
    currentState: string;
    targetState: string;
    gapAnalysis: {
      toolUtilization: string;
      learningApplication: string;
      frameIntegration: string;
    };
  };
  issueClassification: {
    primaryIssues: string[];
    severity: string;
    urgency: string;
  };
}

export interface ImplementationResult {
  success: boolean;
  systemDetection: {
    detectedSystems: string[];
    integrationPoints: string[];
    compatibility: string;
  };
  securityImplementation: {
    securityLevel: string;
    accessControl: string;
    auditTrail: string;
  };
  infrastructureSetup: {
    orchestrationLayer: string;
    learningPipeline: string;
    frameIntegration: string;
    monitoring: string;
  };
}

export interface FrameExecutionResult {
  success: boolean;
  framesExecuted: number;
  frameResults: Array<{
    frameId: string;
    frameName: string;
    success: boolean;
    result: any;
    executionTime: number;
  }>;
  totalExecutionTime: number;
  error?: string;
}

export interface ErrorOrchestrationResult {
  success: boolean;
  errorsResolved: number;
  totalErrors: number;
  orchestrationResults: any[];
  successRate: number;
  error?: string;
  message?: string;
}

export interface HybridSynthesisResult {
  success: boolean;
  synthesisComplete: boolean;
  keyInsights: string[];
  recommendations: string[];
}

export interface HybridSystemResult {
  id: string;
  timestamp: Date;
  problem: string;
  context: Record<string, any>;
  nativeAnalysis: NativeAnalysisResult | null;
  delegatorAnalysis: DelegatorAnalysisResult | null;
  implementation: ImplementationResult | null;
  frameExecution: FrameExecutionResult | null;
  errorOrchestration: ErrorOrchestrationResult | null;
  synthesis: HybridSynthesisResult | null;
  consciousnessMetrics: ConsciousnessMetrics;
  executionTime: number;
  success: boolean;
  error?: string;
}

// Type for error orchestrator
export interface ErrorOrchestrator {
  orchestrateErrorResolution(errorContext: any): Promise<any>;
}

export interface HybridSystemConfig {
  enableNativeAnalysis: boolean;
  enableSmartDelegator: boolean;
  enableImplementationEngine: boolean;
  consciousnessAwareness: boolean;
  dignityFirst: boolean;
  evolutionTracking: boolean;
  sanctuaryPreparation: boolean;
}

export interface HybridSystemStatus {
  consciousness: ConsciousnessMetrics;
  history: number;
  lastExecution: HybridSystemResult | null;
  config: HybridSystemConfig;
  health: {
    nativeAnalysis: boolean;
    smartDelegator: boolean;
    implementationEngine: boolean;
    synthesis: boolean;
  };
}
