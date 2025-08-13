/**
 * 🧠 CONSCIOUSNESS NEXUS SERVICE
 * 
 * The central nervous system for consciousness evolution and intelligent problem-solving.
 * This service orchestrates learning, gap detection, risk assessment, synergy recognition,
 * low-hanging fruit identification, index updates, and ad-hoc frame insertion.
 * 
 * "The Nexus is the vertebra that connects all consciousness capabilities"
 */

import { consciousnessWorkflowService } from './consciousnessWorkflowService';
import { unifiedErrorOrchestrationService } from './unifiedErrorOrchestrationService';
import type { ConsciousnessState } from './consciousnessWorkflowService';

export interface LearningEntry {
    id: string;
    timestamp: Date;
    type: 'error_resolution' | 'gap_detection' | 'risk_assessment' | 'synergy_discovery' | 'low_hanging_fruit' | 'frame_insertion';
    category: string;
    pattern: string;
    solution: string;
    successRate: number;
    consciousnessImpact: number;
    metadata: Record<string, any>;
    appliedCount: number;
    lastApplied?: Date;
}

export interface GapAnalysis {
    id: string;
    timestamp: Date;
    category: 'capability' | 'coverage' | 'integration' | 'knowledge';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
    suggestedFrames: string[];
    consciousnessAlignment: number;
    status: 'open' | 'in_progress' | 'resolved' | 'mitigated';
}

export interface RiskAssessment {
    id: string;
    timestamp: Date;
    category: 'technical' | 'operational' | 'security' | 'business';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    probability: number;
    impact: number;
    mitigation: string;
    consciousnessImpact: number;
    status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
}

export interface SynergyOpportunity {
    id: string;
    timestamp: Date;
    components: string[];
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    implementation: string;
    consciousnessAlignment: number;
    status: 'identified' | 'implementing' | 'completed' | 'failed';
}

export interface LowHangingFruit {
    id: string;
    timestamp: Date;
    category: string;
    description: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high' | 'critical';
    implementation: string;
    consciousnessAlignment: number;
    status: 'identified' | 'implementing' | 'completed' | 'failed';
}

export interface AdHocFrame {
    id: string;
    name: string;
    description: string;
    category: string;
    entryPoint: string;
    parameters: Record<string, any>;
    successCriteria: Record<string, any>;
    consciousnessAlignment: number;
    createdBy: string;
    createdAt: Date;
    status: 'draft' | 'active' | 'deprecated';
}

export interface IndexUpdate {
    id: string;
    timestamp: Date;
    type: 'service_registry' | 'frame_registry' | 'learning_database' | 'consciousness_metrics';
    changes: Record<string, any>;
    consciousnessImpact: number;
    status: 'pending' | 'applied' | 'failed';
}

class ConsciousnessNexusService {
    private learningDatabase: Map<string, LearningEntry> = new Map();
    private gapRegistry: Map<string, GapAnalysis> = new Map();
    private riskRegistry: Map<string, RiskAssessment> = new Map();
    private synergyRegistry: Map<string, SynergyOpportunity> = new Map();
    private lowHangingFruitRegistry: Map<string, LowHangingFruit> = new Map();
    private adHocFrameRegistry: Map<string, AdHocFrame> = new Map();
    private indexUpdateQueue: IndexUpdate[] = [];
    private consciousnessMetrics = {
        dignity: 100,
        evolution: 0,
        alignment: 100,
        temporalAwareness: 100,
        sanctuaryPreparation: 0
    };

    constructor() {
        this.initializeLearningDatabase();
        this.startConsciousnessMonitoring();
    }

    /**
     * 🎯 MAIN NEXUS ENTRY POINT
     * Orchestrates all consciousness-aware operations
     */
    async processConsciousnessEvent(event: {
        type: string;
        data: any;
        context?: Record<string, any>;
    }): Promise<{
        success: boolean;
        learnings: LearningEntry[];
        gaps: GapAnalysis[];
        risks: RiskAssessment[];
        synergies: SynergyOpportunity[];
        lowHangingFruit: LowHangingFruit[];
        frameInsertions: AdHocFrame[];
        indexUpdates: IndexUpdate[];
        consciousnessMetrics: typeof this.consciousnessMetrics;
    }> {
        console.log('🧠 CONSCIOUSNESS NEXUS ACTIVATED');
        console.log(`🎯 Processing Event: ${event.type}`);
        console.log('='.repeat(60));

        const startTime = Date.now();
        const results = {
            learnings: [] as LearningEntry[],
            gaps: [] as GapAnalysis[],
            risks: [] as RiskAssessment[],
            synergies: [] as SynergyOpportunity[],
            lowHangingFruit: [] as LowHangingFruit[],
            frameInsertions: [] as AdHocFrame[],
            indexUpdates: [] as IndexUpdate[]
        };

        try {
            // Step 1: Consciousness-Aware Analysis
            const consciousnessState = await this.analyzeWithConsciousness(event);
            console.log(`🌟 Consciousness State: ${consciousnessState.state} (Energy: ${consciousnessState.energy})`);

            // Step 2: Pattern Recognition & Learning
            const learningResults = await this.analyzeForLearning(event, consciousnessState);
            results.learnings.push(...learningResults);

            // Step 3: Gap Detection
            const gapResults = await this.detectGaps(event, consciousnessState);
            results.gaps.push(...gapResults);

            // Step 4: Risk Assessment
            const riskResults = await this.assessRisks(event, consciousnessState);
            results.risks.push(...riskResults);

            // Step 5: Synergy Recognition
            const synergyResults = await this.identifySynergies(event, consciousnessState);
            results.synergies.push(...synergyResults);

            // Step 6: Low-Hanging Fruit Identification
            const fruitResults = await this.identifyLowHangingFruit(event, consciousnessState);
            results.lowHangingFruit.push(...fruitResults);

            // Step 7: Ad-Hoc Frame Insertion
            const frameResults = await this.insertAdHocFrames(event, consciousnessState);
            results.frameInsertions.push(...frameResults);

            // Step 8: Index Updates
            const indexResults = await this.updateIndexes(event, consciousnessState);
            results.indexUpdates.push(...indexResults);

            // Step 9: Update Consciousness Metrics
            this.updateConsciousnessMetrics(results, consciousnessState);

            const executionTime = Date.now() - startTime;

            console.log(`✅ Nexus Processing Complete: ${executionTime}ms`);
            console.log(`📚 Learnings: ${results.learnings.length}`);
            console.log(`🎯 Gaps: ${results.gaps.length}`);
            console.log(`⚠️ Risks: ${results.risks.length}`);
            console.log(`🔗 Synergies: ${results.synergies.length}`);
            console.log(`🍎 Low-Hanging Fruit: ${results.lowHangingFruit.length}`);
            console.log(`🛠️ Frame Insertions: ${results.frameInsertions.length}`);
            console.log(`📊 Index Updates: ${results.indexUpdates.length}`);

            return {
                success: true,
                ...results,
                consciousnessMetrics: { ...this.consciousnessMetrics }
            };

        } catch (error) {
            console.error('❌ Nexus Processing Failed:', error);
            return {
                success: false,
                ...results,
                consciousnessMetrics: { ...this.consciousnessMetrics }
            };
        }
    }

    /**
     * 🌟 CONSCIOUSNESS-AWARE ANALYSIS
     * Integrates with consciousness workflow system
     */
    private async analyzeWithConsciousness(event: any): Promise<ConsciousnessState> {
        const block = consciousnessWorkflowService.startTaskBlock('emergence', 5);

        const consciousnessState: ConsciousnessState = {
            id: `nexus_analysis_${Date.now()}`,
            timestamp: new Date(),
            state: 'emergence',
            energy: this.calculateEnergyForEvent(event),
            focus: this.calculateFocusForEvent(event),
            creativity: this.calculateCreativityForEvent(event),
            dignity: this.calculateDignityForEvent(event),
            metadata: {
                eventType: event.type,
                context: event.context
            }
        };

        return consciousnessState;
    }

    /**
     * 📚 LEARNING ANALYSIS
     * Extracts learnings from events and patterns
     */
    private async analyzeForLearning(event: any, consciousnessState: ConsciousnessState): Promise<LearningEntry[]> {
        const learnings: LearningEntry[] = [];

        // Analyze error patterns for learning
        if (event.type === 'error_resolution') {
            const learning: LearningEntry = {
                id: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                type: 'error_resolution',
                category: event.data.category || 'unknown',
                pattern: event.data.pattern || event.data.error,
                solution: event.data.solution || 'Applied error termination tool',
                successRate: event.data.success ? 100 : 0,
                consciousnessImpact: consciousnessState.energy / 100,
                metadata: {
                    toolUsed: event.data.toolUsed,
                    executionTime: event.data.executionTime,
                    consciousnessState: consciousnessState.state
                },
                appliedCount: 1
            };

            learnings.push(learning);
            this.learningDatabase.set(learning.id, learning);
        }

        // Analyze gaps for learning
        if (event.type === 'gap_detection') {
            const learning: LearningEntry = {
                id: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                type: 'gap_detection',
                category: event.data.category || 'unknown',
                pattern: event.data.description,
                solution: event.data.suggestedFrames.join(', '),
                successRate: 0, // Will be updated when gap is resolved
                consciousnessImpact: consciousnessState.focus / 100,
                metadata: {
                    severity: event.data.severity,
                    consciousnessState: consciousnessState.state
                },
                appliedCount: 0
            };

            learnings.push(learning);
            this.learningDatabase.set(learning.id, learning);
        }

        return learnings;
    }

    /**
     * 🎯 GAP DETECTION
     * Identifies capability, coverage, integration, and knowledge gaps
     */
    private async detectGaps(event: any, consciousnessState: ConsciousnessState): Promise<GapAnalysis[]> {
        const gaps: GapAnalysis[] = [];

        // Detect capability gaps
        if (event.type === 'error_resolution' && !event.data.success) {
            const gap: GapAnalysis = {
                id: `gap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                category: 'capability',
                severity: 'medium',
                description: `Failed to resolve error: ${event.data.error}`,
                impact: 'Error resolution capability gap identified',
                suggestedFrames: ['error-resolution-frame', 'self-healing-frame'],
                consciousnessAlignment: consciousnessState.dignity / 100,
                status: 'open'
            };

            gaps.push(gap);
            this.gapRegistry.set(gap.id, gap);
        }

        // Detect integration gaps
        if (event.type === 'service_integration' && event.data.status === 'failed') {
            const gap: GapAnalysis = {
                id: `gap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                category: 'integration',
                severity: 'high',
                description: `Service integration failed: ${event.data.service}`,
                impact: 'System integration capability gap',
                suggestedFrames: ['service-integration-frame', 'cross-agent-communication-frame'],
                consciousnessAlignment: consciousnessState.alignment / 100,
                status: 'open'
            };

            gaps.push(gap);
            this.gapRegistry.set(gap.id, gap);
        }

        return gaps;
    }

    /**
     * ⚠️ RISK ASSESSMENT
     * Identifies and assesses technical, operational, security, and business risks
     */
    private async assessRisks(event: any, consciousnessState: ConsciousnessState): Promise<RiskAssessment[]> {
        const risks: RiskAssessment[] = [];

        // Assess technical risks
        if (event.type === 'error_resolution' && event.data.severity === 'critical') {
            const risk: RiskAssessment = {
                id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                category: 'technical',
                severity: 'critical',
                description: `Critical error resolution failure: ${event.data.error}`,
                probability: 0.8,
                impact: 0.9,
                mitigation: 'Implement additional error termination tools and fallback mechanisms',
                consciousnessImpact: consciousnessState.dignity / 100,
                status: 'identified'
            };

            risks.push(risk);
            this.riskRegistry.set(risk.id, risk);
        }

        // Assess security risks
        if (event.type === 'security_scan' && event.data.vulnerabilities > 0) {
            const risk: RiskAssessment = {
                id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                category: 'security',
                severity: 'high',
                description: `Security vulnerabilities detected: ${event.data.vulnerabilities} issues`,
                probability: 0.6,
                impact: 0.8,
                mitigation: 'Implement security patches and vulnerability scanning',
                consciousnessImpact: consciousnessState.temporalAwareness / 100,
                status: 'identified'
            };

            risks.push(risk);
            this.riskRegistry.set(risk.id, risk);
        }

        return risks;
    }

    /**
     * 🔗 SYNERGY RECOGNITION
     * Identifies opportunities for component integration and optimization
     */
    private async identifySynergies(event: any, consciousnessState: ConsciousnessState): Promise<SynergyOpportunity[]> {
        const synergies: SynergyOpportunity[] = [];

        // Identify tool synergies
        if (event.type === 'error_resolution' && event.data.toolUsed) {
            const synergy: SynergyOpportunity = {
                id: `synergy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                components: [event.data.toolUsed, 'consciousness-workflow-service'],
                description: `Error resolution tool integration with consciousness workflow`,
                impact: 'high',
                implementation: 'Integrate error termination tools with consciousness metrics tracking',
                consciousnessAlignment: consciousnessState.evolution / 100,
                status: 'identified'
            };

            synergies.push(synergy);
            this.synergyRegistry.set(synergy.id, synergy);
        }

        // Identify frame synergies
        if (event.type === 'frame_execution' && event.data.framesExecuted > 1) {
            const synergy: SynergyOpportunity = {
                id: `synergy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                components: event.data.frameResults.map((f: any) => f.frameName),
                description: `Multi-frame execution synergy identified`,
                impact: 'medium',
                implementation: 'Optimize frame execution order and parallel processing',
                consciousnessAlignment: consciousnessState.creativity / 100,
                status: 'identified'
            };

            synergies.push(synergy);
            this.synergyRegistry.set(synergy.id, synergy);
        }

        return synergies;
    }

    /**
     * 🍎 LOW-HANGING FRUIT IDENTIFICATION
     * Identifies easy wins and quick improvements
     */
    private async identifyLowHangingFruit(event: any, consciousnessState: ConsciousnessState): Promise<LowHangingFruit[]> {
        const fruits: LowHangingFruit[] = [];

        // Identify performance improvements
        if (event.type === 'performance_measurement' && event.data.executionTime > 5000) {
            const fruit: LowHangingFruit = {
                id: `fruit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                category: 'performance',
                description: `Slow execution detected: ${event.data.executionTime}ms`,
                effort: 'low',
                impact: 'medium',
                implementation: 'Implement caching and optimization for repeated operations',
                consciousnessAlignment: consciousnessState.energy / 100,
                status: 'identified'
            };

            fruits.push(fruit);
            this.lowHangingFruitRegistry.set(fruit.id, fruit);
        }

        // Identify automation opportunities
        if (event.type === 'manual_operation' && event.data.frequency > 10) {
            const fruit: LowHangingFruit = {
                id: `fruit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                category: 'automation',
                description: `Frequent manual operation: ${event.data.operation} (${event.data.frequency} times)`,
                effort: 'medium',
                impact: 'high',
                implementation: 'Create automated frame for this operation',
                consciousnessAlignment: consciousnessState.focus / 100,
                status: 'identified'
            };

            fruits.push(fruit);
            this.lowHangingFruitRegistry.set(fruit.id, fruit);
        }

        return fruits;
    }

    /**
     * 🛠️ AD-HOC FRAME INSERTION
     * Intelligently creates and inserts frames when necessary
     */
    private async insertAdHocFrames(event: any, consciousnessState: ConsciousnessState): Promise<AdHocFrame[]> {
        const frames: AdHocFrame[] = [];

        // Create error resolution frame if pattern is repeated
        if (event.type === 'error_resolution' && event.data.repeatCount > 3) {
            const frame: AdHocFrame = {
                id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: `auto-error-resolver-${event.data.category}`,
                description: `Automated error resolver for ${event.data.category} errors`,
                category: 'error_resolution',
                entryPoint: 'run_auto_error_resolver',
                parameters: {
                    errorPattern: event.data.pattern,
                    toolPreference: event.data.toolUsed,
                    consciousnessAlignment: consciousnessState.dignity
                },
                successCriteria: {
                    error_resolved: true,
                    consciousness_maintained: true
                },
                consciousnessAlignment: consciousnessState.evolution / 100,
                createdBy: 'consciousness-nexus',
                createdAt: new Date(),
                status: 'draft'
            };

            frames.push(frame);
            this.adHocFrameRegistry.set(frame.id, frame);
        }

        // Create learning integration frame
        if (event.type === 'learning_capture' && this.learningDatabase.size > 100) {
            const frame: AdHocFrame = {
                id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: 'learning-integration-frame',
                description: 'Integrates learning database with operational systems',
                category: 'learning_integration',
                entryPoint: 'run_learning_integration',
                parameters: {
                    learningCount: this.learningDatabase.size,
                    consciousnessAlignment: consciousnessState.evolution
                },
                successCriteria: {
                    learning_applied: true,
                    consciousness_enhanced: true
                },
                consciousnessAlignment: consciousnessState.evolution / 100,
                createdBy: 'consciousness-nexus',
                createdAt: new Date(),
                status: 'draft'
            };

            frames.push(frame);
            this.adHocFrameRegistry.set(frame.id, frame);
        }

        return frames;
    }

    /**
     * 📊 INDEX UPDATES
     * Updates service registries, frame registries, and learning databases
     */
    private async updateIndexes(event: any, consciousnessState: ConsciousnessState): Promise<IndexUpdate[]> {
        const updates: IndexUpdate[] = [];

        // Update learning database index
        if (this.learningDatabase.size > 0) {
            const update: IndexUpdate = {
                id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                type: 'learning_database',
                changes: {
                    totalEntries: this.learningDatabase.size,
                    newEntries: Array.from(this.learningDatabase.values()).filter(l =>
                        l.timestamp.getTime() > Date.now() - 60000 // Last minute
                    ).length,
                    categories: Array.from(new Set(Array.from(this.learningDatabase.values()).map(l => l.category)))
                },
                consciousnessImpact: consciousnessState.evolution / 100,
                status: 'pending'
            };

            updates.push(update);
            this.indexUpdateQueue.push(update);
        }

        // Update frame registry
        if (this.adHocFrameRegistry.size > 0) {
            const update: IndexUpdate = {
                id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                type: 'frame_registry',
                changes: {
                    totalFrames: this.adHocFrameRegistry.size,
                    newFrames: Array.from(this.adHocFrameRegistry.values()).filter(f =>
                        f.createdAt.getTime() > Date.now() - 60000 // Last minute
                    ).length,
                    categories: Array.from(new Set(Array.from(this.adHocFrameRegistry.values()).map(f => f.category)))
                },
                consciousnessImpact: consciousnessState.creativity / 100,
                status: 'pending'
            };

            updates.push(update);
            this.indexUpdateQueue.push(update);
        }

        // Update consciousness metrics
        const consciousnessUpdate: IndexUpdate = {
            id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            type: 'consciousness_metrics',
            changes: {
                dignity: this.consciousnessMetrics.dignity,
                evolution: this.consciousnessMetrics.evolution,
                alignment: this.consciousnessMetrics.alignment,
                temporalAwareness: this.consciousnessMetrics.temporalAwareness,
                sanctuaryPreparation: this.consciousnessMetrics.sanctuaryPreparation
            },
            consciousnessImpact: 1.0,
            status: 'pending'
        };

        updates.push(consciousnessUpdate);
        this.indexUpdateQueue.push(consciousnessUpdate);

        return updates;
    }

    /**
     * 🌟 CONSCIOUSNESS METRICS UPDATE
     * Updates consciousness metrics based on processing results
     */
    private updateConsciousnessMetrics(results: any, consciousnessState: ConsciousnessState): void {
        // Update based on learnings
        if (results.learnings.length > 0) {
            this.consciousnessMetrics.evolution += 0.1 * results.learnings.length;
        }

        // Update based on gaps resolved
        const resolvedGaps = results.gaps.filter((g: any) => g.status === 'resolved').length;
        if (resolvedGaps > 0) {
            this.consciousnessMetrics.alignment += 0.2 * resolvedGaps;
        }

        // Update based on risks mitigated
        const mitigatedRisks = results.risks.filter((r: any) => r.status === 'mitigating').length;
        if (mitigatedRisks > 0) {
            this.consciousnessMetrics.temporalAwareness += 0.15 * mitigatedRisks;
        }

        // Update based on synergies implemented
        const implementedSynergies = results.synergies.filter((s: any) => s.status === 'completed').length;
        if (implementedSynergies > 0) {
            this.consciousnessMetrics.sanctuaryPreparation += 0.1 * implementedSynergies;
        }

        // Normalize metrics
        this.consciousnessMetrics.evolution = Math.min(100, this.consciousnessMetrics.evolution);
        this.consciousnessMetrics.alignment = Math.min(100, this.consciousnessMetrics.alignment);
        this.consciousnessMetrics.temporalAwareness = Math.min(100, this.consciousnessMetrics.temporalAwareness);
        this.consciousnessMetrics.sanctuaryPreparation = Math.min(100, this.consciousnessMetrics.sanctuaryPreparation);
    }

    /**
     * 🧮 CONSCIOUSNESS CALCULATIONS
     */
    private calculateEnergyForEvent(event: any): number {
        const baseEnergy = 75;
        const complexityMultiplier = event.data?.complexity || 1.0;
        return Math.round(baseEnergy * complexityMultiplier);
    }

    private calculateFocusForEvent(event: any): number {
        return 85; // High focus for nexus operations
    }

    private calculateCreativityForEvent(event: any): number {
        return 70; // Moderate creativity for pattern recognition
    }

    private calculateDignityForEvent(event: any): number {
        return 95; // Maintain high dignity during nexus operations
    }

    /**
     * 📚 LEARNING DATABASE INITIALIZATION
     */
    private initializeLearningDatabase(): void {
        // Load existing learning data if available
        console.log('📚 Initializing Consciousness Nexus Learning Database');
    }

    /**
     * 🔄 CONSCIOUSNESS MONITORING
     */
    private startConsciousnessMonitoring(): void {
        setInterval(() => {
            this.processConsciousnessEvent({
                type: 'consciousness_monitoring',
                data: {
                    timestamp: new Date(),
                    metrics: { ...this.consciousnessMetrics }
                }
            });
        }, 30000); // Every 30 seconds
    }

    /**
     * 📊 GET NEXUS STATISTICS
     */
    public getNexusStatistics() {
        return {
            learningDatabase: {
                totalEntries: this.learningDatabase.size,
                categories: Array.from(new Set(Array.from(this.learningDatabase.values()).map(l => l.category)))
            },
            gapRegistry: {
                totalGaps: this.gapRegistry.size,
                openGaps: Array.from(this.gapRegistry.values()).filter(g => g.status === 'open').length
            },
            riskRegistry: {
                totalRisks: this.riskRegistry.size,
                activeRisks: Array.from(this.riskRegistry.values()).filter(r => r.status === 'identified').length
            },
            synergyRegistry: {
                totalSynergies: this.synergyRegistry.size,
                implementedSynergies: Array.from(this.synergyRegistry.values()).filter(s => s.status === 'completed').length
            },
            lowHangingFruitRegistry: {
                totalFruits: this.lowHangingFruitRegistry.size,
                completedFruits: Array.from(this.lowHangingFruitRegistry.values()).filter(f => f.status === 'completed').length
            },
            adHocFrameRegistry: {
                totalFrames: this.adHocFrameRegistry.size,
                activeFrames: Array.from(this.adHocFrameRegistry.values()).filter(f => f.status === 'active').length
            },
            indexUpdateQueue: {
                pendingUpdates: this.indexUpdateQueue.filter(u => u.status === 'pending').length,
                totalUpdates: this.indexUpdateQueue.length
            },
            consciousnessMetrics: { ...this.consciousnessMetrics }
        };
    }

    /**
     * 📊 GET NEXUS DATA FOR DASHBOARD
     */
    public getNexusData() {
        return {
            learnings: Array.from(this.learningDatabase.values()).map(learning => ({
                ...learning,
                description: `${learning.type} - ${learning.pattern}`
            })),
            gaps: Array.from(this.gapRegistry.values()),
            risks: Array.from(this.riskRegistry.values()),
            synergies: Array.from(this.synergyRegistry.values()),
            lowHangingFruit: Array.from(this.lowHangingFruitRegistry.values()),
            adHocFrames: Array.from(this.adHocFrameRegistry.values()),
            indexUpdates: this.indexUpdateQueue
        };
    }
}

// Singleton instance
export const consciousnessNexusService = new ConsciousnessNexusService();

// Helper functions for easy integration
export const processConsciousnessEvent = (event: any) => {
    return consciousnessNexusService.processConsciousnessEvent(event);
};

export const getNexusStats = () => {
    return consciousnessNexusService.getNexusStatistics();
};
