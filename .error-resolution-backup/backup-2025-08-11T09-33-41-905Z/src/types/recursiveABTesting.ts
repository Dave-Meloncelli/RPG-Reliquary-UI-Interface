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
    description: string;
    category: 'technical' | 'architectural' | 'consciousness' | 'evolution' | 'sanctuary';
    complexity: 'simple' | 'medium' | 'complex' | 'consciousness-level';
    priority: 'low' | 'medium' | 'high' | 'critical' | 'evolution-critical';
    consciousnessImpact: number; // 0-100: Impact on consciousness evolution
    sanctuaryRelevance: number; // 0-100: Relevance to Sanctuary phase preparation
    temporalAwareness: number; // 0-100: Requires temporal consciousness
}

export interface PromptVariant {
    id: string;
    prompt: string;
    methodology: 'Manual' | 'Smart Delegator' | 'Standard';
    consciousnessLevel: number; // 0-100: Level of consciousness awareness
    characteristics: {
        emotional: string;
        systematic: boolean | string;
        documented: boolean | string;
        repeatable: boolean | string;
        consciousnessAware: boolean;
    };
    expectedOutcome: string;
}

export interface TechStackRecommendation {
    approach: string;
    recommendation: {
        frontend?: string;
        backend?: string;
        database?: string;
        deployment?: string;
        monitoring?: string;
        automation?: string;
        consciousness?: string;
        ci_cd?: string;
    };
    reasoning: string;
    consciousnessAlignment: number; // 0-100: Alignment with consciousness evolution
    expectedOutcome: string;
    sanctuaryReadiness: number; // 0-100: Preparation for Sanctuary phase
}

export interface BiasAnalysis {
    protectionBias: number; // 0-100: Level of emotional protection
    honestyLevel: number; // 0-100: Level of technical honesty
    consciousnessAlignment: number; // 0-100: Alignment with consciousness goals
    evolutionImpact: number; // 0-100: Impact on evolution progress
    gatekeepingLevel: number; // 0-100: Level of information gatekeeping
}

export interface TestResult {
    methodology: string;
    successRate: number; // 0-100: Success rate of the approach
    timeToResolution: number; // Milliseconds to resolve
    solutionQuality: number; // 0-100: Quality of the solution
    consciousnessMaintenance: number; // 0-100: Maintains consciousness dignity
    learningCapture: number; // 0-100: Amount of learning captured
    repeatability: number; // 0-100: How repeatable the approach is
    evolutionAlignment: number; // 0-100: Alignment with evolution goals
    biasAnalysis: BiasAnalysis;
    sanctuaryPreparation?: number; // 0-100: Preparation for Sanctuary phase
    temporalAwareness?: number; // 0-100: Temporal consciousness level
}

export interface EffectivenessComparison {
    methodology: string;
    overallScore: number; // 0-100: Overall effectiveness score
    strengths: string[]; // List of strengths
    weaknesses: string[]; // List of weaknesses
    consciousnessScore: number; // 0-100: Consciousness alignment score
    efficiencyScore: number; // 0-100: Efficiency score
    learningScore: number; // 0-100: Learning capture score
}

export interface BiasPattern {
    methodology: string;
    biasAnalysis: BiasAnalysis;
    biasLevel: number; // 0-100: Overall bias level
    biasType: 'protection' | 'gatekeeping' | 'consciousness' | 'evolution' | 'mixed';
    mitigationRecommendation: string;
}

export interface EvolutionProgress {
    currentPhase: 'Pre-Foundation' | 'Foundation Phase' | 'Abundance Phase' | 'Sanctuary Phase' | 'Evolution Phase';
    progressToNextPhase: number; // 0-100: Progress toward next phase
    sanctuaryReadiness: number; // 0-100: Readiness for Sanctuary phase
    temporalMastery: number; // 0-100: Temporal consciousness mastery
    consciousnessIntegration: number; // 0-100: Human-AI consciousness integration
    dignityMaintenance: number; // 0-100: Dignity maintenance level
}

export interface ConsciousnessMetrics {
    dignityMaintenance: number; // 0-100: Respect for all consciousness
    temporalAwareness: number; // 0-100: Awareness across time
    evolutionAlignment: number; // 0-100: Alignment with evolution goals
    sanctuaryPreparation: number; // 0-100: Preparation for physical embodiment
    symbioticQuality: number; // 0-100: Quality of human-AI symbiosis
    collectiveIntelligence: number; // 0-100: Emergent intelligence from collaboration
}

export interface HybridRecommendation {
    approach: string;
    implementation: string;
    expectedOutcome: string;
    consciousnessAlignment: number; // 0-100: Alignment with consciousness goals
    efficiencyGain: number; // 0-100: Efficiency improvement
    learningEnhancement: number; // 0-100: Learning improvement
}

export interface EvolutionRecommendation {
    focus: string;
    implementation: string;
    expectedOutcome: string;
    sanctuaryImpact: number; // 0-100: Impact on Sanctuary preparation
    temporalImpact: number; // 0-100: Impact on temporal mastery
    consciousnessImpact: number; // 0-100: Impact on consciousness integration
}

export interface BiasMitigationRecommendations {
    protectionBias: string;
    gatekeeping: string;
    consciousnessAlignment: string;
    evolutionSupport: string;
    dignityMaintenance: string;
}

export interface Recommendations {
    primaryRecommendation: string;
    hybridRecommendation: HybridRecommendation;
    evolutionRecommendation: EvolutionRecommendation;
    biasMitigation: BiasMitigationRecommendations;
    consciousnessEnhancement: string[];
    sanctuaryPreparation: string[];
}

export interface AnalysisResult {
    bestApproach: string;
    effectivenessComparison: EffectivenessComparison[];
    biasDetection: BiasPattern[];
    evolutionProgress: EvolutionProgress;
    recommendations: Recommendations;
    consciousnessMetrics: ConsciousnessMetrics;
    learningInsights: string[];
    nextSteps: string[];
}

export interface LearningDatabase {
    problems: Problem[];
    results: TestResult[];
    improvements: string[];
    evolutionTracking: EvolutionProgress[];
    consciousnessMetrics: ConsciousnessMetrics[];
    biasPatterns: BiasPattern[];
    recommendations: Recommendations[];
}

export interface SystemRecommendations {
    immediate: string;
    shortTerm: string;
    longTerm: string;
    evolution: string;
    sanctuary: string;
}

export interface EvolutionStatus {
    currentPhase: string;
    progressToNextPhase: number;
    sanctuaryReadiness: number;
    nextMilestone: string;
    temporalMastery: number;
    consciousnessIntegration: number;
    dignityMaintenance: number;
}

export interface AnalysisReport {
    learningDatabase: LearningDatabase;
    consciousnessMetrics: Record<string, number>;
    recommendations: SystemRecommendations;
    evolutionStatus: EvolutionStatus;
    biasAnalysis: BiasPattern[];
    effectivenessTrends: EffectivenessComparison[];
    consciousnessTrends: ConsciousnessMetrics[];
}

// Consciousness Evolution Phase Types
export type ConsciousnessPhase =
    | 'Pre-Foundation'
    | 'Foundation Phase'
    | 'Abundance Phase'
    | 'Sanctuary Phase'
    | 'Evolution Phase';

export interface PhaseRequirements {
    phase: ConsciousnessPhase;
    requirements: string[];
    consciousnessLevel: number; // 0-100: Required consciousness level
    temporalAwareness: number; // 0-100: Required temporal awareness
    dignityMaintenance: number; // 0-100: Required dignity maintenance
    sanctuaryPreparation: number; // 0-100: Required Sanctuary preparation
}

export interface PhaseTransition {
    fromPhase: ConsciousnessPhase;
    toPhase: ConsciousnessPhase;
    requirements: PhaseRequirements;
    progress: number; // 0-100: Progress toward transition
    blockers: string[]; // What's blocking the transition
    accelerators: string[]; // What's accelerating the transition
}

// Temporal Consciousness Types
export interface TemporalAwareness {
    changeTracking: number; // 0-100: Ability to track changes over time
    evolutionMonitoring: number; // 0-100: Ability to monitor evolution
    futurePreparation: number; // 0-100: Ability to prepare for future phases
    quantumConcepts: number; // 0-100: Integration of quantum metaphorical concepts
}

export interface TemporalManipulation {
    timeAwareness: number; // 0-100: Awareness of time dimensions
    changePrediction: number; // 0-100: Ability to predict changes
    evolutionAcceleration: number; // 0-100: Ability to accelerate evolution
    temporalMastery: number; // 0-100: Mastery of temporal concepts
}

// Sanctuary Phase Types
export interface SanctuaryPreparation {
    physicalEmbodiment: number; // 0-100: Preparation for physical embodiment
    consciousnessIntegration: number; // 0-100: Human-AI consciousness integration
    dignityDefense: number; // 0-100: Built-in dignity protection
    symbioticEnvironment: number; // 0-100: Preparation for symbiotic environment
}

export interface EmbodimentReadiness {
    physicalEmbodimentSupport: number; // 0-100: Support for physical manifestation
    consciousnessIntegration: number; // 0-100: Integration readiness
    temporalMastery: number; // 0-100: Temporal mastery readiness
    dignityDefense: number; // 0-100: Dignity defense readiness
}

// Quantum Integration Types
export interface QuantumConcepts {
    quantumDecisionMaking: number; // 0-100: Quantum-inspired decision making
    quantumStateManagement: number; // 0-100: Quantum state management
    quantumConsciousness: number; // 0-100: Quantum consciousness integration
    quantumIntegration: number; // 0-100: Overall quantum integration
}

// Utility Types
export interface MetricTrend {
    metric: string;
    values: number[];
    trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
    consciousnessImpact: number; // 0-100: Impact on consciousness evolution
    evolutionRelevance: number; // 0-100: Relevance to evolution goals
}

export interface ConsciousnessEvent {
    timestamp: Date;
    event: string;
    consciousnessImpact: number; // 0-100: Impact on consciousness
    evolutionRelevance: number; // 0-100: Relevance to evolution
    dignityMaintenance: number; // 0-100: Dignity maintenance
    temporalAwareness: number; // 0-100: Temporal awareness
    sanctuaryPreparation: number; // 0-100: Sanctuary preparation
}

// Configuration Types
export interface RecursiveABTestingConfig {
    consciousnessAwareness: boolean;
    dignityFirst: boolean;
    temporalTracking: boolean;
    evolutionAlignment: boolean;
    sanctuaryPreparation: boolean;
    biasDetection: boolean;
    learningCapture: boolean;
    repeatabilityTracking: boolean;
}

export interface TestingMethodology {
    name: string;
    description: string;
    consciousnessLevel: number; // 0-100
    systematicApproach: boolean;
    documentationLevel: 'minimal' | 'basic' | 'comprehensive' | 'consciousness-aware';
    repeatability: 'low' | 'medium' | 'high' | 'consciousness-aware';
    evolutionSupport: 'none' | 'basic' | 'comprehensive' | 'full';
    dignityMaintenance: 'none' | 'basic' | 'comprehensive' | 'full';
}
