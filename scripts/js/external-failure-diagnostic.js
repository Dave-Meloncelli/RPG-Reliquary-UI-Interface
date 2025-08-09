#!/usr/bin/env node
/**
 * External Failure Diagnostic Frame
 * Analyzes external command failures and generates comprehensive recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Analyze external command failures and generate recommendations
 * @param {Object} context - Execution context from the framework
 * @returns {Object} Analysis results with recommendations
 */
export const analyzeFailures = async (context = {}) => {
    const {
        input_data = {},
        parameters = {},
        previous_results = {}
    } = context;
    
    // Suppress verbose output when called as a frame
    const verbose = !context.entry_point;
    
    if (verbose) {
        console.log('🔬 External Failure Diagnostic Analysis');
        console.log('=' * 50);
    }
    
    try {
        // Extract external failures from previous results
        const externalFailures = extractExternalFailures(previous_results);
        
        if (externalFailures.length === 0) {
            const result = {
                success: true,
                analysis_complete: true,
                recommendations_generated: true,
                data: {
                    status: 'no_failures',
                    message: 'No external failures detected',
                    recommendations: []
                },
                summary: 'No external command failures found',
                context: {
                    failures_analyzed: 0,
                    recommendations_generated: 0
                }
            };
            
            if (verbose) {
                console.log(JSON.stringify(result));
            }
            return result;
        }
        
        // Perform comprehensive analysis
        const analysis = performComprehensiveAnalysis(externalFailures, parameters);
        
        // Generate recommendations
        const recommendations = generateRecommendations(analysis);
        
        // Create action plan
        const actionPlan = createActionPlan(analysis, recommendations);
        
        const result = {
            success: true,
            analysis_complete: true,
            recommendations_generated: true,
            data: {
                status: 'failures_analyzed',
                total_failures: externalFailures.length,
                analysis: analysis,
                recommendations: recommendations,
                action_plan: actionPlan
            },
            summary: `Analyzed ${externalFailures.length} external failures and generated ${recommendations.length} recommendations`,
            context: {
                failures_analyzed: externalFailures.length,
                recommendations_generated: recommendations.length,
                critical_issues: analysis.criticalIssues.length,
                orphan_failures: analysis.orphanFailures.length
            }
        };
        
        if (verbose) {
            console.log(`✅ Analysis complete: ${externalFailures.length} failures analyzed`);
            console.log(`📋 Generated ${recommendations.length} recommendations`);
            console.log(`🚨 Critical issues: ${analysis.criticalIssues.length}`);
            console.log(`⚠️ Orphan failures: ${analysis.orphanFailures.length}`);
        }
        
        if (verbose) {
            console.log(JSON.stringify(result));
        }
        return result;
        
    } catch (error) {
        console.error('❌ External failure diagnostic analysis failed:', error.message);
        return {
            success: false,
            analysis_complete: false,
            recommendations_generated: false,
            error: error.message,
            data: {
                status: 'analysis_failed',
                message: 'Failed to analyze external failures'
            }
        };
    }
};

/**
 * Extract external failures from previous results
 */
function extractExternalFailures(previousResults) {
    const failures = [];
    
    // Look for external failures in stage results
    for (const [stageKey, stageResult] of Object.entries(previousResults)) {
        if (stageKey.startsWith('stage_') && stageResult.external_failures) {
            failures.push(...stageResult.external_failures);
        }
        
        // Also check for failure summaries
        if (stageResult.failure_summary && stageResult.failure_summary.status === 'failures_detected') {
            failures.push(...stageResult.failure_summary.all_failures || []);
        }
    }
    
    return failures;
}

/**
 * Perform comprehensive analysis of external failures
 */
function performComprehensiveAnalysis(failures, parameters) {
    const analysis = {
        failureTypes: {},
        criticalIssues: [],
        orphanFailures: [],
        dependencyIssues: [],
        qualityIssues: [],
        performanceIssues: [],
        rootCauses: [],
        impactAssessment: {
            high: 0,
            medium: 0,
            low: 0
        }
    };
    
    for (const failure of failures) {
        // Categorize by failure type
        const failureType = failure.error_type || 'unknown';
        if (!analysis.failureTypes[failureType]) {
            analysis.failureTypes[failureType] = [];
        }
        analysis.failureTypes[failureType].push(failure);
        
        // Categorize by severity
        const severity = failure.severity || 'medium';
        analysis.impactAssessment[severity]++;
        
        // Identify critical issues
        if (severity === 'critical' || severity === 'high') {
            analysis.criticalIssues.push(failure);
        }
        
        // Identify orphan failures (non-blocking)
        if (isOrphanFailure(failure)) {
            analysis.orphanFailures.push(failure);
        }
        
        // Categorize by domain
        if (isDependencyIssue(failure)) {
            analysis.dependencyIssues.push(failure);
        } else if (isQualityIssue(failure)) {
            analysis.qualityIssues.push(failure);
        } else if (isPerformanceIssue(failure)) {
            analysis.performanceIssues.push(failure);
        }
        
        // Analyze root causes
        const rootCause = analyzeRootCause(failure);
        if (rootCause && !analysis.rootCauses.includes(rootCause)) {
            analysis.rootCauses.push(rootCause);
        }
    }
    
    return analysis;
}

/**
 * Determine if a failure is an orphan (non-blocking)
 */
function isOrphanFailure(failure) {
    const command = failure.command || '';
    return command.includes('eslint') || 
           command.includes('prettier') || 
           command.includes('npm run') ||
           command.includes('lint');
}

/**
 * Determine if a failure is a dependency issue
 */
function isDependencyIssue(failure) {
    const errorType = failure.error_type || '';
    const stderr = (failure.stderr || '').toLowerCase();
    
    return errorType === 'dependency_missing' ||
           stderr.includes('cannot find module') ||
           stderr.includes('package not found') ||
           stderr.includes('module not found');
}

/**
 * Determine if a failure is a quality issue
 */
function isQualityIssue(failure) {
    const command = failure.command || '';
    return command.includes('eslint') || 
           command.includes('prettier') ||
           command.includes('lint');
}

/**
 * Determine if a failure is a performance issue
 */
function isPerformanceIssue(failure) {
    const errorType = failure.error_type || '';
    const stderr = (failure.stderr || '').toLowerCase();
    
    return errorType === 'timeout' ||
           errorType === 'memory_issue' ||
           stderr.includes('timeout') ||
           stderr.includes('memory') ||
           stderr.includes('killed');
}

/**
 * Analyze root cause of a failure
 */
function analyzeRootCause(failure) {
    const errorType = failure.error_type || '';
    const stderr = (failure.stderr || '').toLowerCase();
    
    if (errorType === 'dependency_missing') {
        return 'Missing dependencies';
    } else if (errorType === 'permission_denied') {
        return 'Permission issues';
    } else if (errorType === 'timeout') {
        return 'Performance/timeout issues';
    } else if (errorType === 'memory_issue') {
        return 'Resource constraints';
    } else if (errorType === 'configuration_error') {
        return 'Configuration issues';
    } else if (stderr.includes('syntax error')) {
        return 'Code syntax issues';
    } else if (stderr.includes('import error')) {
        return 'Module import issues';
    }
    
    return 'Unknown root cause';
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(analysis) {
    const recommendations = [];
    
    // Critical issues
    if (analysis.criticalIssues.length > 0) {
        recommendations.push({
            priority: 'critical',
            category: 'critical_fixes',
            description: `Address ${analysis.criticalIssues.length} critical issues`,
            actions: [
                'Review and fix critical failures immediately',
                'Check system resources and dependencies',
                'Verify configuration and permissions'
            ]
        });
    }
    
    // Dependency issues
    if (analysis.dependencyIssues.length > 0) {
        recommendations.push({
            priority: 'high',
            category: 'dependencies',
            description: `Resolve ${analysis.dependencyIssues.length} dependency issues`,
            actions: [
                'Run npm install to install missing dependencies',
                'Check package.json for required packages',
                'Verify Node.js and npm versions',
                'Clear node_modules and reinstall if needed'
            ]
        });
    }
    
    // Quality issues
    if (analysis.qualityIssues.length > 0) {
        recommendations.push({
            priority: 'medium',
            category: 'code_quality',
            description: `Address ${analysis.qualityIssues.length} code quality issues`,
            actions: [
                'Run eslint --fix to auto-fix linting issues',
                'Run prettier --write to format code',
                'Review and fix remaining linting errors',
                'Update linting configuration if needed'
            ]
        });
    }
    
    // Performance issues
    if (analysis.performanceIssues.length > 0) {
        recommendations.push({
            priority: 'medium',
            category: 'performance',
            description: `Address ${analysis.performanceIssues.length} performance issues`,
            actions: [
                'Increase timeout values for long-running commands',
                'Check system resources (CPU, memory)',
                'Optimize command execution',
                'Consider breaking large operations into smaller parts'
            ]
        });
    }
    
    // Root cause recommendations
    analysis.rootCauses.forEach(rootCause => {
        recommendations.push({
            priority: 'medium',
            category: 'root_cause',
            description: `Address root cause: ${rootCause}`,
            actions: getRootCauseActions(rootCause)
        });
    });
    
    return recommendations;
}

/**
 * Get specific actions for a root cause
 */
function getRootCauseActions(rootCause) {
    switch (rootCause) {
        case 'Missing dependencies':
            return ['Install missing packages', 'Check package.json', 'Run npm install'];
        case 'Permission issues':
            return ['Check file permissions', 'Run with appropriate privileges', 'Verify file ownership'];
        case 'Performance/timeout issues':
            return ['Increase timeout values', 'Optimize command execution', 'Check system resources'];
        case 'Resource constraints':
            return ['Increase system memory', 'Close unnecessary processes', 'Optimize memory usage'];
        case 'Configuration issues':
            return ['Check configuration files', 'Verify environment variables', 'Review settings'];
        case 'Code syntax issues':
            return ['Fix syntax errors', 'Run linter', 'Check code formatting'];
        case 'Module import issues':
            return ['Check import paths', 'Verify module resolution', 'Update import statements'];
        default:
            return ['Investigate the specific error', 'Check logs for details', 'Review command syntax'];
    }
}

/**
 * Create action plan based on analysis and recommendations
 */
function createActionPlan(analysis, recommendations) {
    const actionPlan = {
        immediate: [],
        short_term: [],
        long_term: []
    };
    
    recommendations.forEach(rec => {
        if (rec.priority === 'critical') {
            actionPlan.immediate.push(rec);
        } else if (rec.priority === 'high') {
            actionPlan.short_term.push(rec);
        } else {
            actionPlan.long_term.push(rec);
        }
    });
    
    return actionPlan;
}

// Export for use as a frame
export default {
    analyzeFailures
};
