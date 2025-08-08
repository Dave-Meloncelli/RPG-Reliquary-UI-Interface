#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Failure analysis patterns
const FAILURE_PATTERNS = {
    json_parsing: {
        patterns: ['JSON', 'parsing', 'success criteria', 'Missing key'],
        diagnostic_frames: ['frame_optimizer'],
        priority: 'high'
    },
    context_loss: {
        patterns: ['context', 'undefined', 'not defined', 'preservation'],
        diagnostic_frames: ['context_intelligence'],
        priority: 'high'
    },
    external_command: {
        patterns: ['command failed', 'exit code', 'subprocess', 'git', 'npm'],
        diagnostic_frames: ['external_failure_diagnostic'],
        priority: 'medium'
    },
    system_issue: {
        patterns: ['system', 'audit', 'validation', 'hub'],
        diagnostic_frames: ['system_audit'],
        priority: 'medium'
    },
    performance: {
        patterns: ['timeout', 'slow', 'performance', 'execution time'],
        diagnostic_frames: ['frame_optimizer'],
        priority: 'low'
    }
};

function analyzeFailure(failure_log, execution_context) {
    const analysis = {
        failure_type: 'unknown',
        confidence: 0,
        recommended_frames: [],
        escalation_level: 1,
        summary: ''
    };

    const log_text = JSON.stringify(failure_log).toLowerCase();
    let max_confidence = 0;

    for (const [failure_type, config] of Object.entries(FAILURE_PATTERNS)) {
        const matches = config.patterns.filter(pattern =>
            log_text.includes(pattern.toLowerCase())
        ).length;

        const confidence = matches / config.patterns.length;

        if (confidence > max_confidence) {
            max_confidence = confidence;
            analysis.failure_type = failure_type;
            analysis.confidence = confidence;
            analysis.recommended_frames = config.diagnostic_frames;
            analysis.priority = config.priority;
        }
    }

    // Determine escalation level based on failure history
    const failure_count = execution_context.failed_attempts || 0;
    analysis.escalation_level = Math.min(failure_count + 1, 4);

    // Add more comprehensive frames for higher escalation levels
    if (analysis.escalation_level >= 2) {
        analysis.recommended_frames.push('context_intelligence');
    }
    if (analysis.escalation_level >= 3) {
        analysis.recommended_frames.push('system_audit');
    }

    analysis.summary = `Failure type: ${analysis.failure_type} (confidence: ${Math.round(analysis.confidence * 100)}%). Escalation level: ${analysis.escalation_level}`;

    return analysis;
}

function generateEnhancedScaffold(original_scaffold, failure_analysis, execution_context) {
    const enhanced_scaffold = { ...original_scaffold };

    // Add diagnostic frames to appropriate stages
    const diagnostic_stage = enhanced_scaffold.stages['IDENTIFY_ANALYZE'] || [];

    // Add recommended diagnostic frames
    for (const frame of failure_analysis.recommended_frames) {
        if (!diagnostic_stage.includes(frame)) {
            diagnostic_stage.push(frame);
        }
    }

    enhanced_scaffold.stages['IDENTIFY_ANALYZE'] = diagnostic_stage;

    // Add meta-analysis for higher escalation levels
    if (failure_analysis.escalation_level >= 2) {
        const meta_stage = enhanced_scaffold.stages['META_AUDIT'] || [];
        if (!meta_stage.includes('frame_optimizer')) {
            meta_stage.push('frame_optimizer');
        }
        enhanced_scaffold.stages['META_AUDIT'] = meta_stage;
    }

    return enhanced_scaffold;
}

function shouldEscalateToFullDiagnostic(failure_analysis, execution_context) {
    // Escalate to full diagnostic scaffold if:
    // 1. High escalation level (3 or 4)
    // 2. Low confidence in failure analysis
    // 3. Multiple failure types detected

    return (
        failure_analysis.escalation_level >= 3 ||
        failure_analysis.confidence < 0.3 ||
        execution_context.failed_attempts >= 3
    );
}

export const intelligentFailureResponse = async (context = {}) => {
    const verbose = !context.entry_point;

    try {
        const { failure_log, execution_context, original_scaffold } = context;

        if (!failure_log) {
            return {
                success: false,
                error: 'No failure log provided',
                summary: 'Cannot analyze failure without log data'
            };
        }

        // Analyze the failure
        const failure_analysis = analyzeFailure(failure_log, execution_context);

        // Determine response strategy
        const should_escalate = shouldEscalateToFullDiagnostic(failure_analysis, execution_context);

        let response_strategy;
        let enhanced_scaffold;

        if (should_escalate) {
            response_strategy = 'full_diagnostic_scaffold';
            // Create a comprehensive diagnostic scaffold
            enhanced_scaffold = {
                id: 'full_diagnostic_scaffold',
                name: 'Full Diagnostic Scaffold',
                description: 'Comprehensive diagnostic analysis triggered by repeated failures',
                stages: {
                    'SCOPE': ['synthesis_analysis'],
                    'IDENTIFY_ANALYZE': [
                        'enhanced_analysis',
                        'frame_optimizer',
                        'context_intelligence',
                        'external_failure_diagnostic',
                        'system_audit'
                    ],
                    'PLAN': ['system_audit'],
                    'IMPLEMENT': ['risk_mitigation'],
                    'SUCCESS_CONTINUE': [],
                    'FINAL_AUDIT': ['synthesis_analysis'],
                    'META_AUDIT': ['meta_analysis', 'frame_optimizer', 'context_intelligence'],
                    'APPROVAL': ['human_approval_gate'],
                    'UPDATE_REGISTERS': ['knowledge_hub_update'],
                    'PUSH_GITHUB': ['external_failure_diagnostic', 'powershell_diagnostic']
                },
                dependencies: ['python', 'node', 'git'],
                success_criteria: { 'diagnostic_complete': true },
                context_preservation: true
            };
        } else {
            response_strategy = 'targeted_diagnostic_frames';
            enhanced_scaffold = generateEnhancedScaffold(original_scaffold, failure_analysis, execution_context);
        }

        // Generate response report
        const report = {
            failure_analysis,
            response_strategy,
            enhanced_scaffold,
            recommendations: [
                `Add ${failure_analysis.recommended_frames.join(', ')} frames to diagnostic stage`,
                `Escalation level: ${failure_analysis.escalation_level}/4`,
                `Confidence: ${Math.round(failure_analysis.confidence * 100)}%`
            ]
        };

        // Save report
        const reportsDir = 'reports';
        if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
        const reportPath = path.join(reportsDir, `failure_response_${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        const result = {
            success: true,
            intelligent_response_generated: true,
            report_path: reportPath,
            failure_type: failure_analysis.failure_type,
            escalation_level: failure_analysis.escalation_level,
            response_strategy,
            summary: `Generated ${response_strategy} for ${failure_analysis.failure_type} failure`,
            context: {
                confidence: failure_analysis.confidence,
                recommended_frames: failure_analysis.recommended_frames,
                should_escalate
            }
        };

        if (context && context.entry_point) {
            console.log(JSON.stringify(result));
            return result;
        } else {
            console.log(JSON.stringify(result));
            console.log(JSON.stringify(report));
            return report;
        }

    } catch (e) {
        const fail = {
            success: false,
            intelligent_response_generated: false,
            error: String(e),
            summary: 'Intelligent failure response generation failed'
        };
        if (verbose) console.log(JSON.stringify(fail));
        return fail;
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    intelligentFailureResponse();
}
