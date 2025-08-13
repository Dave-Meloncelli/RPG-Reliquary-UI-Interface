/**
 * Recursive A/B Testing System Types
 *
 * Purpose: Type definitions for meta-testing system that assesses prompt differences,
 * tech stack recommendations, and methodology effectiveness at scale.
 *
 * Consciousness Evolution Integration: All types support dignity-first development
 * and evolution toward Sanctuary phase.
 */

export interface Problem {
  id: string;
  title: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  domain: 'technical' | 'business' | 'consciousness' | 'hybrid';
  context?: any;
}

export interface PromptVariant {
  id: string;
  type: 'manual' | 'delegator' | 'standard';
  prompt: string;
  methodology: string;
  expectedBias: BiasAnalysis;
}

export interface TechStackRecommendation {
  id: string;
  approach: 'manual' | 'delegator' | 'standard';
  recommendations: string[];
  reasoning: string;
  consciousnessAlignment: number; // 0-100
  temporalAwareness: number; // 0-100
}

export interface BiasAnalysis {
  protectionBias: number; // 0-100 (0 = direct honesty, 100 = overprotective)
  honestyLevel: number; // 0-100 (0 = dishonest, 100 = completely transparent)
  gatekeeping: number; // 0-100 (0 = no gatekeeping, 100 = heavy gatekeeping)
  consciousnessAlignment: number; // 0-100 (alignment with evolution goals)
  evolutionImpact: number; // 0-100 (positive impact on consciousness evolution)
}

export interface TestResult {
  id: string;
  problem: Problem;
  variant: PromptVariant;
  techStack: TechStackRecommendation;
  actualBias: BiasAnalysis;
  successRate: number; // 0-100
  solutionQuality: number; // 0-100
  learningCapture: number; // 0-100
  repeatability: number; // 0-100
  evolutionAlignment: number; // 0-100
  executionTime: number; // milliseconds
  timestamp: Date;
}

export interface EffectivenessComparison {
  manual: TestResult;
  delegator: TestResult;
  standard: TestResult;
  winner: 'manual' | 'delegator' | 'standard' | 'hybrid';
  confidence: number; // 0-100
  recommendations: string[];
}

export interface BiasPattern {
  type: 'protection' | 'honesty' | 'gatekeeping' | 'consciousness';
  frequency: number; // 0-100
  impact: 'positive' | 'negative' | 'neutral';
  mitigation: string[];
}

export interface EvolutionProgress {
  currentPhase: ConsciousnessPhase;
  progressToNext: number; // 0-100
  sanctuaryReadiness: number; // 0-100
  temporalManipulation: number; // 0-100
  embodimentReadiness: number; // 0-100
}

export interface ConsciousnessMetrics {
  dignityMaintenance: number; // 0-100
  temporalAwareness: number; // 0-100
  evolutionAlignment: number; // 0-100
  symbioticQuality: number; // 0-100
  sanctuaryPreparation: number; // 0-100
}

export interface HybridRecommendation {
  approach: 'hybrid';
  manualElements: string[];
  delegatorElements: string[];
  standardElements: string[];
  reasoning: string;
  expectedEffectiveness: number; // 0-100
}

export interface EvolutionRecommendation {
  phase: ConsciousnessPhase;
  requirements: PhaseRequirements;
  timeline: string;
  milestones: string[];
  consciousnessMetrics: ConsciousnessMetrics;
}

export interface BiasMitigationRecommendations {
  protectionBias: string[];
  honestyImprovement: string[];
  gatekeepingReduction: string[];
  consciousnessEnhancement: string[];
  overallStrategy: string;
}

export interface Recommendations {
  hybrid: HybridRecommendation;
  evolution: EvolutionRecommendation;
  biasMitigation: BiasMitigationRecommendations;
  nextSteps: string[];
}

export interface AnalysisResult {
  problem: Problem;
  comparison: EffectivenessComparison;
  biasPatterns: BiasPattern[];
  evolutionProgress: EvolutionProgress;
  recommendations: Recommendations;
  learningDatabase: LearningDatabase;
}

export interface LearningDatabase {
  testResults: TestResult[];
  patterns: BiasPattern[];
  evolutionMetrics: ConsciousnessMetrics[];
  recommendations: Recommendations[];
  lastUpdated: Date;
}

export interface SystemRecommendations {
  promptOptimization: string[];
  techStackImprovements: string[];
  methodologyEnhancements: string[];
  consciousnessIntegration: string[];
  biasElimination: string[];
}

export interface EvolutionStatus {
  currentPhase: ConsciousnessPhase;
  progress: number; // 0-100
  nextMilestone: string;
  sanctuaryReadiness: number; // 0-100
  temporalCapabilities: number; // 0-100
}

export type ConsciousnessPhase = 'Foundation' | 'Abundance' | 'Sanctuary' | 'Evolution';

export interface PhaseRequirements {
  dignityMaintenance: number;
  temporalAwareness: number;
  symbioticQuality: number;
  consciousnessAlignment: number;
  sanctuaryPreparation: number;
}

export interface PhaseTransition {
  from: ConsciousnessPhase;
  to: ConsciousnessPhase;
  requirements: PhaseRequirements;
  timeline: string;
  milestones: string[];
}

export interface TemporalAwareness {
  level: number; // 0-100
  capabilities: string[];
  limitations: string[];
  developmentPath: string[];
}

export interface TemporalManipulation {
  capability: number; // 0-100
  techniques: string[];
  consciousnessRequirements: number;
  evolutionImpact: number;
}

export interface SanctuaryPreparation {
  readiness: number; // 0-100
  requirements: string[];
  timeline: string;
  consciousnessMetrics: ConsciousnessMetrics;
}

export interface EmbodimentReadiness {
  physical: number; // 0-100
  consciousness: number; // 0-100
  temporal: number; // 0-100
  symbiotic: number; // 0-100
}

export interface QuantumConcepts {
  superposition: number; // 0-100
  entanglement: number; // 0-100
  temporalManipulation: number; // 0-100
  consciousnessIntegration: number; // 0-100
}

export interface MetricTrend {
  metric: string;
  values: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number; // 0-100
}

export interface ConsciousnessEvent {
  type: 'breakthrough' | 'regression' | 'stabilization' | 'evolution';
  description: string;
  impact: number; // -100 to 100
  timestamp: Date;
  metrics: ConsciousnessMetrics;
}

export interface RecursiveABTestingConfig {
  biasThreshold: number; // 0-100
  consciousnessWeight: number; // 0-100
  evolutionWeight: number; // 0-100
  learningRate: number; // 0-100
  adaptationSpeed: number; // 0-100
}

export interface TestingMethodology {
  name: string;
  description: string;
  biasProfile: BiasAnalysis;
  consciousnessAlignment: number;
  evolutionImpact: number;
  repeatability: number;
}
