#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Analysis categories for comprehensive coverage
const ANALYSIS_CATEGORIES = {
    gaps: {
        capability: ['missing_features', 'incomplete_implementations', 'unmet_requirements'],
        coverage: ['untested_areas', 'edge_cases', 'error_scenarios'],
        integration: ['broken_links', 'inconsistent_apis', 'data_flow_issues'],
        knowledge: ['undocumented_processes', 'missing_documentation', 'knowledge_silos']
    },
    risks: {
        technical: ['security_vulnerabilities', 'performance_bottlenecks', 'scalability_issues'],
        operational: ['deployment_risks', 'monitoring_gaps', 'disaster_recovery'],
        security: ['access_control', 'data_protection', 'compliance_issues'],
        business: ['market_fit', 'user_experience', 'competitive_position']
    },
    opportunities: {
        optimization: ['performance_improvements', 'resource_efficiency', 'cost_reduction'],
        automation: ['manual_processes', 'repetitive_tasks', 'deployment_automation'],
        synergy: ['tool_integration', 'process_alignment', 'knowledge_sharing'],
        innovation: ['new_features', 'technology_upgrades', 'market_expansion']
    },
    synergies: {
        cross_component: ['shared_utilities', 'common_patterns', 'unified_apis'],
        tool_integration: ['workflow_automation', 'data_flow', 'event_driven_arch'],
        process_efficiency: ['streamlined_workflows', 'reduced_duplication', 'faster_iteration']
    }
};

// Impact scoring system
const IMPACT_LEVELS = {
    critical: { score: 5, description: 'Immediate attention required, blocking progress' },
    high: { score: 4, description: 'Significant impact on system health or efficiency' },
    medium: { score: 3, description: 'Moderate impact, should be addressed soon' },
    low: { score: 2, description: 'Minor impact, nice to have' },
    negligible: { score: 1, description: 'Minimal impact, can be deferred' }
};

// Effort estimation
const EFFORT_LEVELS = {
    trivial: { hours: 1, description: 'Quick fix or simple addition' },
    small: { hours: 4, description: 'Few hours of work' },
    medium: { hours: 16, description: '1-2 days of work' },
    large: { hours: 40, description: '1 week of work' },
    massive: { hours: 80, description: '2+ weeks of work' }
};

function analyzeFileStructure() {
    const analysis = {
        files: [],
        directories: [],
        patterns: {},
        missing: []
    };

    const rootDir = process.cwd();
    const commonPatterns = [
        'package.json', 'requirements.txt', 'README.md', '.gitignore',
        'tsconfig.json', 'vite.config.ts', 'tailwind.config.js',
        'Dockerfile', 'docker-compose.yml', '.env.example'
    ];

    function scanDirectory(dir, relativePath = '') {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativeItemPath = path.join(relativePath, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    analysis.directories.push(relativeItemPath);
                    scanDirectory(fullPath, relativeItemPath);
                } else {
                    analysis.files.push(relativeItemPath);
                }
            }
        } catch (error) {
            // Directory might not be accessible
        }
    }

    scanDirectory(rootDir);

    // Check for missing common patterns
    for (const pattern of commonPatterns) {
        if (!analysis.files.some(f => f.includes(pattern))) {
            analysis.missing.push(pattern);
        }
    }

    return analysis;
}

function analyzeDependencies() {
    const analysis = {
        python: { packages: [], vulnerabilities: [], outdated: [] },
        node: { packages: [], vulnerabilities: [], outdated: [] },
        system: { tools: [], missing: [] }
    };

    try {
        // Analyze Python dependencies
        if (fs.existsSync('backend/requirements.txt')) {
            const requirements = fs.readFileSync('backend/requirements.txt', 'utf8');
            analysis.python.packages = requirements.split('\n')
                .filter(line => line.trim() && !line.startsWith('#'))
                .map(line => line.split('==')[0].split('>=')[0].split('<=')[0]);
        }

        // Analyze Node.js dependencies
        if (fs.existsSync('package.json')) {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            analysis.node.packages = [
                ...Object.keys(packageJson.dependencies || {}),
                ...Object.keys(packageJson.devDependencies || {})
            ];
        }

        // Check for system tools
        const systemTools = ['git', 'node', 'npm', 'python', 'pip'];
        for (const tool of systemTools) {
            try {
                execSync(`${tool} --version`, { stdio: 'ignore' });
                analysis.system.tools.push(tool);
            } catch {
                analysis.system.missing.push(tool);
            }
        }
    } catch (error) {
        // Continue analysis even if some checks fail
    }

    return analysis;
}

function analyzeCodeQuality() {
    const analysis = {
        complexity: { high: [], medium: [], low: [] },
        duplication: { files: [], patterns: [] },
        documentation: { covered: [], missing: [] },
        testing: { coverage: 0, missing: [] }
    };

    // Analyze file sizes and complexity indicators
    const files = fs.readdirSync('.').filter(f =>
        f.endsWith('.py') || f.endsWith('.js') || f.endsWith('.ts')
    );

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n').length;

            if (lines > 1000) {
                analysis.complexity.high.push(file);
            } else if (lines > 500) {
                analysis.complexity.medium.push(file);
            } else {
                analysis.complexity.low.push(file);
            }

            // Check for documentation
            if (content.includes('"""') || content.includes("'''") || content.includes('//')) {
                analysis.documentation.covered.push(file);
            } else {
                analysis.documentation.missing.push(file);
            }
        } catch (error) {
            // Skip files that can't be read
        }
    }

    return analysis;
}

function identifyGaps(fileStructure, dependencies, codeQuality) {
    const gaps = [];

    // Capability gaps
    if (fileStructure.missing.length > 0) {
        gaps.push({
            category: 'capability',
            type: 'missing_features',
            description: `Missing common project files: ${fileStructure.missing.join(', ')}`,
            impact: IMPACT_LEVELS.medium,
            effort: EFFORT_LEVELS.small,
            priority: 'medium'
        });
    }

    if (dependencies.system.missing.length > 0) {
        gaps.push({
            category: 'capability',
            type: 'missing_features',
            description: `Missing system tools: ${dependencies.system.missing.join(', ')}`,
            impact: IMPACT_LEVELS.high,
            effort: EFFORT_LEVELS.small,
            priority: 'high'
        });
    }

    // Coverage gaps
    if (codeQuality.documentation.missing.length > 0) {
        gaps.push({
            category: 'coverage',
            type: 'missing_documentation',
            description: `${codeQuality.documentation.missing.length} files lack documentation`,
            impact: IMPACT_LEVELS.medium,
            effort: EFFORT_LEVELS.medium,
            priority: 'medium'
        });
    }

    // Integration gaps
    if (!fs.existsSync('KNOWLEDGE_HUB.md')) {
        gaps.push({
            category: 'integration',
            type: 'broken_links',
            description: 'Missing centralized knowledge hub',
            impact: IMPACT_LEVELS.high,
            effort: EFFORT_LEVELS.medium,
            priority: 'high'
        });
    }

    return gaps;
}

function identifyRisks(fileStructure, dependencies, codeQuality) {
    const risks = [];

    // Technical risks
    if (codeQuality.complexity.high.length > 0) {
        risks.push({
            category: 'technical',
            type: 'performance_bottlenecks',
            description: `${codeQuality.complexity.high.length} highly complex files may cause maintenance issues`,
            impact: IMPACT_LEVELS.high,
            effort: EFFORT_LEVELS.large,
            priority: 'high'
        });
    }

    if (dependencies.system.missing.length > 0) {
        risks.push({
            category: 'operational',
            type: 'deployment_risks',
            description: 'Missing system dependencies may cause deployment failures',
            impact: IMPACT_LEVELS.critical,
            effort: EFFORT_LEVELS.small,
            priority: 'critical'
        });
    }

    // Security risks
    if (fs.existsSync('.env') && !fs.existsSync('.env.example')) {
        risks.push({
            category: 'security',
            type: 'access_control',
            description: 'Environment variables not properly documented',
            impact: IMPACT_LEVELS.medium,
            effort: EFFORT_LEVELS.trivial,
            priority: 'medium'
        });
    }

    return risks;
}

function identifyOpportunities(fileStructure, dependencies, codeQuality) {
    const opportunities = [];

    // Optimization opportunities
    if (codeQuality.complexity.high.length > 0) {
        opportunities.push({
            category: 'optimization',
            type: 'performance_improvements',
            description: 'Refactor complex files to improve maintainability',
            impact: IMPACT_LEVELS.high,
            effort: EFFORT_LEVELS.large,
            priority: 'high'
        });
    }

    // Automation opportunities
    if (!fs.existsSync('.github/workflows')) {
        opportunities.push({
            category: 'automation',
            type: 'deployment_automation',
            description: 'Implement CI/CD pipeline for automated testing and deployment',
            impact: IMPACT_LEVELS.high,
            effort: EFFORT_LEVELS.medium,
            priority: 'high'
        });
    }

    // Innovation opportunities
    if (dependencies.python.packages.length > 0 && dependencies.node.packages.length > 0) {
        opportunities.push({
            category: 'innovation',
            type: 'technology_upgrades',
            description: 'Consider modernizing to a unified tech stack for better integration',
            impact: IMPACT_LEVELS.medium,
            effort: EFFORT_LEVELS.massive,
            priority: 'low'
        });
    }

    return opportunities;
}

function identifySynergies(fileStructure, dependencies, codeQuality) {
    const synergies = [];

    // Cross-component synergies
    if (fs.existsSync('scripts') && fs.existsSync('backend')) {
        synergies.push({
            category: 'cross_component',
            type: 'shared_utilities',
            description: 'Scripts and backend can share common utilities and patterns',
            impact: IMPACT_LEVELS.medium,
            effort: EFFORT_LEVELS.small,
            priority: 'medium'
        });
    }

    // Tool integration synergies
    if (dependencies.python.packages.length > 0 && dependencies.node.packages.length > 0) {
        synergies.push({
            category: 'tool_integration',
            type: 'workflow_automation',
            description: 'Python and Node.js tools can be integrated for comprehensive automation',
            impact: IMPACT_LEVELS.high,
            effort: EFFORT_LEVELS.medium,
            priority: 'high'
        });
    }

    return synergies;
}

function calculatePriorityScore(item) {
    const impactScore = item.impact.score;
    const effortScore = 6 - (item.effort.hours / 16); // Inverse relationship
    return (impactScore * 0.7) + (effortScore * 0.3);
}

function generateRecommendations(gaps, risks, opportunities, synergies) {
    const allItems = [...gaps, ...risks, ...opportunities, ...synergies];

    // Calculate priority scores
    allItems.forEach(item => {
        item.priorityScore = calculatePriorityScore(item);
    });

    // Sort by priority score
    allItems.sort((a, b) => b.priorityScore - a.priorityScore);

    // Generate actionable recommendations
    const recommendations = {
        immediate: allItems.filter(item => item.priority === 'critical' || item.priority === 'high'),
        short_term: allItems.filter(item => item.priority === 'medium'),
        long_term: allItems.filter(item => item.priority === 'low'),
        quick_wins: allItems.filter(item => item.effort.hours <= 4 && item.impact.score >= 3)
    };

    return recommendations;
}

export const allInAnalysis = async (context = {}) => {
    const verbose = !context.entry_point;

    try {
        console.log('🔍 Starting comprehensive "all-in" analysis...');

        // Perform systematic analysis
        const fileStructure = analyzeFileStructure();
        const dependencies = analyzeDependencies();
        const codeQuality = analyzeCodeQuality();

        // Identify all categories
        const gaps = identifyGaps(fileStructure, dependencies, codeQuality);
        const risks = identifyRisks(fileStructure, dependencies, codeQuality);
        const opportunities = identifyOpportunities(fileStructure, dependencies, codeQuality);
        const synergies = identifySynergies(fileStructure, dependencies, codeQuality);

        // Generate recommendations
        const recommendations = generateRecommendations(gaps, risks, opportunities, synergies);

        // Calculate summary metrics
        const summary = {
            total_items: gaps.length + risks.length + opportunities.length + synergies.length,
            critical_items: recommendations.immediate.length,
            quick_wins: recommendations.quick_wins.length,
            estimated_effort_hours: allItems.reduce((sum, item) => sum + item.effort.hours, 0),
            risk_score: risks.reduce((sum, risk) => sum + risk.impact.score, 0) / Math.max(risks.length, 1),
            opportunity_score: opportunities.reduce((sum, opp) => sum + opp.impact.score, 0) / Math.max(opportunities.length, 1)
        };

        // Save detailed report
        const reportsDir = 'reports';
        if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

        const reportPath = path.join(reportsDir, `all_in_analysis_${Date.now()}.json`);
        const detailedReport = {
            analysis_timestamp: new Date().toISOString(),
            summary,
            gaps,
            risks,
            opportunities,
            synergies,
            recommendations,
            raw_data: {
                file_structure: fileStructure,
                dependencies: dependencies,
                code_quality: codeQuality
            }
        };

        fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));

        const result = {
            success: true,
            all_in_analysis_complete: true,
            report_path: reportPath,
            summary,
            critical_items_count: recommendations.immediate.length,
            quick_wins_count: recommendations.quick_wins.length,
            total_effort_hours: summary.estimated_effort_hours,
            risk_score: summary.risk_score,
            opportunity_score: summary.opportunity_score
        };

        if (context && context.entry_point) {
            console.log(JSON.stringify(result));
            return result;
        } else {
            console.log(JSON.stringify(result));
            console.log('\n📊 Analysis Summary:');
            console.log(`Total items analyzed: ${summary.total_items}`);
            console.log(`Critical items: ${summary.critical_items}`);
            console.log(`Quick wins: ${summary.quick_wins}`);
            console.log(`Estimated effort: ${summary.estimated_effort_hours} hours`);
            console.log(`Risk score: ${summary.risk_score.toFixed(2)}/5`);
            console.log(`Opportunity score: ${summary.opportunity_score.toFixed(2)}/5`);

            if (recommendations.immediate.length > 0) {
                console.log('\n🚨 Immediate Actions:');
                recommendations.immediate.slice(0, 5).forEach((item, i) => {
                    console.log(`${i + 1}. ${item.description} (${item.effort.hours}h, ${item.impact.description})`);
                });
            }

            if (recommendations.quick_wins.length > 0) {
                console.log('\n⚡ Quick Wins:');
                recommendations.quick_wins.slice(0, 3).forEach((item, i) => {
                    console.log(`${i + 1}. ${item.description} (${item.effort.hours}h, ${item.impact.description})`);
                });
            }

            return detailedReport;
        }

    } catch (e) {
        const fail = {
            success: false,
            all_in_analysis_complete: false,
            error: String(e),
            summary: 'All-in analysis failed'
        };
        if (verbose) console.log(JSON.stringify(fail));
        return fail;
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    allInAnalysis();
}
