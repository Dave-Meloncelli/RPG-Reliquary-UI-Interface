#!/usr/bin/env node

/**
 * System Intelligence Gathering Script
 * 
 * Comprehensive analysis of the az-interface system to:
 * - Map all components and their relationships
 * - Identify orphaned or incomplete code
 * - Find missed opportunities and synergies
 * - Assess risks and blockers
 * - Create unified development roadmap
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SystemIntelligenceGathering {
    constructor() {
        this.systemMap = {
            apps: {},
            services: {},
            scripts: {},
            tools: {},
            types: {},
            components: {},
            connections: [],
            orphaned: [],
            opportunities: [],
            risks: [],
            blockers: []
        };

        this.analysisResults = {
            totalFiles: 0,
            totalErrors: 0,
            criticalIssues: 0,
            orphanedComponents: 0,
            missedOpportunities: 0,
            systemHealth: 0
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            error: '💀',
            warning: '⚠️',
            success: '✅',
            info: '🔧',
            debug: '🔍'
        }[type] || '🔧';

        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async gatherSystemIntelligence() {
        this.log('🧠 STARTING COMPREHENSIVE SYSTEM INTELLIGENCE GATHERING', 'info');
        this.log('================================================', 'info');

        try {
            // Phase 1: Component Inventory
            await this.inventoryComponents();

            // Phase 2: Connection Mapping
            await this.mapConnections();

            // Phase 3: Orphan Detection
            await this.detectOrphans();

            // Phase 4: Opportunity Analysis
            await this.analyzeOpportunities();

            // Phase 5: Risk Assessment
            await this.assessRisks();

            // Phase 6: Generate Report
            await this.generateIntelligenceReport();

        } catch (error) {
            this.log(`💀 Intelligence gathering failed: ${error.message}`, 'error');
            throw error;
        }
    }

    async inventoryComponents() {
        this.log('📋 PHASE 1: COMPONENT INVENTORY', 'info');

        // Inventory Apps
        const appsDir = path.join(__dirname, '../src/apps');
        if (fs.existsSync(appsDir)) {
            const appFiles = fs.readdirSync(appsDir).filter(f => f.endsWith('.tsx'));
            for (const appFile of appFiles) {
                const appPath = path.join(appsDir, appFile);
                const appName = appFile.replace('.tsx', '');
                const content = fs.readFileSync(appPath, 'utf8');

                this.systemMap.apps[appName] = {
                    file: appFile,
                    path: appPath,
                    size: content.length,
                    imports: this.extractImports(content),
                    exports: this.extractExports(content),
                    hasErrors: content.includes('any,') || content.includes('TODO:'),
                    complexity: this.calculateComplexity(content)
                };
            }
        }

        // Inventory Services
        const servicesDir = path.join(__dirname, '../src/services');
        if (fs.existsSync(servicesDir)) {
            const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts'));
            for (const serviceFile of serviceFiles) {
                const servicePath = path.join(servicesDir, serviceFile);
                const serviceName = serviceFile.replace('.ts', '');
                const content = fs.readFileSync(servicePath, 'utf8');

                this.systemMap.services[serviceName] = {
                    file: serviceFile,
                    path: servicePath,
                    size: content.length,
                    imports: this.extractImports(content),
                    exports: this.extractExports(content),
                    hasErrors: content.includes('any,') || content.includes('TODO:'),
                    complexity: this.calculateComplexity(content),
                    isCorrupted: this.isFileCorrupted(content)
                };
            }
        }

        // Inventory Scripts
        const scriptsDir = path.join(__dirname);
        const scriptFiles = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.cjs') || f.endsWith('.js'));
        for (const scriptFile of scriptFiles) {
            const scriptPath = path.join(scriptsDir, scriptFile);
            const scriptName = scriptFile.replace(/\.(cjs|js)$/, '');
            const content = fs.readFileSync(scriptPath, 'utf8');

            this.systemMap.scripts[scriptName] = {
                file: scriptFile,
                path: scriptPath,
                size: content.length,
                purpose: this.extractScriptPurpose(content),
                isErrorResolution: scriptName.includes('error') || scriptName.includes('fix'),
                complexity: this.calculateComplexity(content)
            };
        }

        this.log(`📊 Inventoried: ${Object.keys(this.systemMap.apps).length} apps, ${Object.keys(this.systemMap.services).length} services, ${Object.keys(this.systemMap.scripts).length} scripts`, 'success');
    }

    async mapConnections() {
        this.log('🔗 PHASE 2: CONNECTION MAPPING', 'info');

        // Map service-to-service connections
        for (const [serviceName, service] of Object.entries(this.systemMap.services)) {
            for (const importPath of service.imports) {
                const importedService = this.resolveImport(importPath);
                if (importedService) {
                    this.systemMap.connections.push({
                        from: serviceName,
                        to: importedService,
                        type: 'service-dependency',
                        strength: 'strong'
                    });
                }
            }
        }

        // Map app-to-service connections
        for (const [appName, app] of Object.entries(this.systemMap.apps)) {
            for (const importPath of app.imports) {
                const importedService = this.resolveImport(importPath);
                if (importedService) {
                    this.systemMap.connections.push({
                        from: appName,
                        to: importedService,
                        type: 'app-service',
                        strength: 'strong'
                    });
                }
            }
        }

        this.log(`🔗 Mapped ${this.systemMap.connections.length} connections`, 'success');
    }

    async detectOrphans() {
        this.log('👻 PHASE 3: ORPHAN DETECTION', 'info');

        // Find services that aren't imported by any app
        const usedServices = new Set();
        for (const connection of this.systemMap.connections) {
            if (connection.type === 'app-service') {
                usedServices.add(connection.to);
            }
        }

        for (const [serviceName, service] of Object.entries(this.systemMap.services)) {
            if (!usedServices.has(serviceName) && !service.isCorrupted) {
                this.systemMap.orphaned.push({
                    type: 'service',
                    name: serviceName,
                    reason: 'Not imported by any app',
                    potential: this.assessOrphanPotential(service)
                });
            }
        }

        // Find corrupted files
        for (const [serviceName, service] of Object.entries(this.systemMap.services)) {
            if (service.isCorrupted) {
                this.systemMap.orphaned.push({
                    type: 'corrupted-service',
                    name: serviceName,
                    reason: 'File is corrupted with syntax errors',
                    severity: 'critical'
                });
            }
        }

        this.log(`👻 Found ${this.systemMap.orphaned.length} orphaned/corrupted components`, 'warning');
    }

    async analyzeOpportunities() {
        this.log('💡 PHASE 4: OPPORTUNITY ANALYSIS', 'info');

        // Find error resolution scripts that could be consolidated
        const errorScripts = Object.entries(this.systemMap.scripts)
            .filter(([name, script]) => script.isErrorResolution)
            .map(([name, script]) => name);

        if (errorScripts.length > 5) {
            this.systemMap.opportunities.push({
                type: 'consolidation',
                title: 'Error Resolution Script Consolidation',
                description: `Found ${errorScripts.length} error resolution scripts that could be consolidated`,
                impact: 'high',
                effort: 'medium',
                scripts: errorScripts
            });
        }

        // Find services with similar purposes
        const serviceGroups = this.groupSimilarServices();
        for (const [groupName, services] of Object.entries(serviceGroups)) {
            if (services.length > 2) {
                this.systemMap.opportunities.push({
                    type: 'integration',
                    title: `${groupName} Service Integration`,
                    description: `Found ${services.length} services with similar purposes that could be integrated`,
                    impact: 'medium',
                    effort: 'high',
                    services: services
                });
            }
        }

        // Find missing integrations
        const missingIntegrations = this.findMissingIntegrations();
        for (const integration of missingIntegrations) {
            this.systemMap.opportunities.push({
                type: 'missing-integration',
                title: integration.title,
                description: integration.description,
                impact: integration.impact,
                effort: integration.effort
            });
        }

        this.log(`💡 Found ${this.systemMap.opportunities.length} opportunities`, 'success');
    }

    async assessRisks() {
        this.log('⚠️ PHASE 5: RISK ASSESSMENT', 'info');

        // Critical corrupted files
        const corruptedServices = this.systemMap.orphaned.filter(o => o.type === 'corrupted-service');
        if (corruptedServices.length > 0) {
            this.systemMap.risks.push({
                type: 'critical',
                title: 'Corrupted Service Files',
                description: `${corruptedServices.length} service files are corrupted and causing build failures`,
                impact: 'critical',
                probability: 'high',
                services: corruptedServices.map(s => s.name)
            });
        }

        // High complexity components
        const complexComponents = Object.entries(this.systemMap.services)
            .filter(([name, service]) => service.complexity > 50)
            .map(([name, service]) => ({ name, complexity: service.complexity }));

        if (complexComponents.length > 0) {
            this.systemMap.risks.push({
                type: 'complexity',
                title: 'High Complexity Components',
                description: `${complexComponents.length} services have high complexity scores`,
                impact: 'medium',
                probability: 'medium',
                components: complexComponents
            });
        }

        // Missing error handling
        const servicesWithoutErrorHandling = Object.entries(this.systemMap.services)
            .filter(([name, service]) => !service.content?.includes('try') && !service.content?.includes('catch'))
            .map(([name, service]) => name);

        if (servicesWithoutErrorHandling.length > 0) {
            this.systemMap.risks.push({
                type: 'error-handling',
                title: 'Missing Error Handling',
                description: `${servicesWithoutErrorHandling.length} services lack proper error handling`,
                impact: 'medium',
                probability: 'high',
                services: servicesWithoutErrorHandling
            });
        }

        this.log(`⚠️ Identified ${this.systemMap.risks.length} risks`, 'warning');
    }

    async generateIntelligenceReport() {
        this.log('📊 PHASE 6: GENERATING INTELLIGENCE REPORT', 'info');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalApps: Object.keys(this.systemMap.apps).length,
                totalServices: Object.keys(this.systemMap.services).length,
                totalScripts: Object.keys(this.systemMap.scripts).length,
                totalConnections: this.systemMap.connections.length,
                orphanedComponents: this.systemMap.orphaned.length,
                opportunities: this.systemMap.opportunities.length,
                risks: this.systemMap.risks.length
            },
            systemMap: this.systemMap,
            recommendations: this.generateRecommendations(),
            actionPlan: this.generateActionPlan()
        };

        const reportPath = path.join(__dirname, 'system-intelligence-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        this.log(`📊 Intelligence report generated: ${reportPath}`, 'success');

        // Generate markdown summary
        const markdownReport = this.generateMarkdownReport(report);
        const markdownPath = path.join(__dirname, 'system-intelligence-summary.md');
        fs.writeFileSync(markdownPath, markdownReport);

        this.log(`📊 Markdown summary generated: ${markdownPath}`, 'success');

        return report;
    }

    // Helper methods
    extractImports(content) {
        const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
        const imports = [];
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    }

    extractExports(content) {
        const exportRegex = /export\s+(?:default\s+)?(?:function|class|const|interface|type)\s+(\w+)/g;
        const exports = [];
        let match;
        while ((match = exportRegex.exec(content)) !== null) {
            exports.push(match[1]);
        }
        return exports;
    }

    calculateComplexity(content) {
        // Simple complexity calculation based on lines, functions, and nesting
        const lines = content.split('\n').length;
        const functions = (content.match(/function|=>/g) || []).length;
        const nesting = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
        return Math.abs(lines + functions * 2 + nesting * 3);
    }

    isFileCorrupted(content) {
        return content.includes('any,') && content.includes('TODO:') && content.includes('undefined');
    }

    extractScriptPurpose(content) {
        if (content.includes('error') && content.includes('fix')) return 'error-resolution';
        if (content.includes('audit') || content.includes('analysis')) return 'analysis';
        if (content.includes('build') || content.includes('compile')) return 'build';
        return 'utility';
    }

    resolveImport(importPath) {
        // Simple import resolution
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const parts = importPath.split('/');
            return parts[parts.length - 1].replace(/\.(ts|tsx|js)$/, '');
        }
        return null;
    }

    assessOrphanPotential(service) {
        // Assess if an orphaned service has potential value
        const keywords = ['api', 'service', 'manager', 'controller', 'handler'];
        const hasKeywords = keywords.some(keyword =>
            service.file.toLowerCase().includes(keyword)
        );
        return hasKeywords ? 'high' : 'low';
    }

    groupSimilarServices() {
        const groups = {};
        for (const [name, service] of Object.entries(this.systemMap.services)) {
            const category = this.categorizeService(name, service);
            if (!groups[category]) groups[category] = [];
            groups[category].push(name);
        }
        return groups;
    }

    categorizeService(name, service) {
        if (name.includes('auth')) return 'authentication';
        if (name.includes('api')) return 'api';
        if (name.includes('data') || name.includes('db')) return 'data';
        if (name.includes('ai') || name.includes('llm')) return 'ai';
        if (name.includes('file') || name.includes('fs')) return 'file-system';
        return 'utility';
    }

    findMissingIntegrations() {
        const integrations = [];

        // Check for missing error handling integration
        const hasErrorHandling = Object.values(this.systemMap.services)
            .some(service => service.file.includes('error') || service.file.includes('exception'));

        if (!hasErrorHandling) {
            integrations.push({
                title: 'Error Handling Integration',
                description: 'No centralized error handling service found',
                impact: 'high',
                effort: 'medium'
            });
        }

        // Check for missing monitoring integration
        const hasMonitoring = Object.values(this.systemMap.services)
            .some(service => service.file.includes('monitor') || service.file.includes('log'));

        if (!hasMonitoring) {
            integrations.push({
                title: 'Monitoring Integration',
                description: 'No centralized monitoring service found',
                impact: 'medium',
                effort: 'high'
            });
        }

        return integrations;
    }

    generateRecommendations() {
        const recommendations = [];

        // Critical fixes
        if (this.systemMap.orphaned.some(o => o.type === 'corrupted-service')) {
            recommendations.push({
                priority: 'critical',
                action: 'Fix corrupted service files',
                description: 'Resolve syntax errors in corrupted services before proceeding',
                impact: 'critical'
            });
        }

        // Consolidation opportunities
        const consolidationOpps = this.systemMap.opportunities.filter(o => o.type === 'consolidation');
        for (const opp of consolidationOpps) {
            recommendations.push({
                priority: 'high',
                action: opp.title,
                description: opp.description,
                impact: opp.impact
            });
        }

        // Integration opportunities
        const integrationOpps = this.systemMap.opportunities.filter(o => o.type === 'integration');
        for (const opp of integrationOpps) {
            recommendations.push({
                priority: 'medium',
                action: opp.title,
                description: opp.description,
                impact: opp.impact
            });
        }

        return recommendations;
    }

    generateActionPlan() {
        return {
            immediate: this.systemMap.risks.filter(r => r.impact === 'critical').map(r => r.title),
            shortTerm: this.systemMap.opportunities.filter(o => o.impact === 'high').map(o => o.title),
            mediumTerm: this.systemMap.opportunities.filter(o => o.impact === 'medium').map(o => o.title),
            longTerm: this.systemMap.opportunities.filter(o => o.impact === 'low').map(o => o.title)
        };
    }

    generateMarkdownReport(report) {
        return `# System Intelligence Report

## Executive Summary

- **Total Apps**: ${report.summary.totalApps}
- **Total Services**: ${report.summary.totalServices}
- **Total Scripts**: ${report.summary.totalScripts}
- **Total Connections**: ${report.summary.totalConnections}
- **Orphaned Components**: ${report.summary.orphanedComponents}
- **Opportunities**: ${report.summary.opportunities}
- **Risks**: ${report.summary.risks}

## Critical Issues

${report.systemMap.orphaned.filter(o => o.type === 'corrupted-service').map(o => `- **${o.name}**: ${o.reason}`).join('\n')}

## Top Opportunities

${report.recommendations.filter(r => r.priority === 'high' || r.priority === 'critical').map(r => `- **${r.action}**: ${r.description}`).join('\n')}

## Action Plan

### Immediate (Critical)
${report.actionPlan.immediate.map(item => `- ${item}`).join('\n')}

### Short Term (High Impact)
${report.actionPlan.shortTerm.map(item => `- ${item}`).join('\n')}

### Medium Term (Medium Impact)
${report.actionPlan.mediumTerm.map(item => `- ${item}`).join('\n')}

## System Health Score

**Current Health**: ${this.calculateSystemHealth()}%

*Report generated on: ${new Date().toISOString()}*
`;
    }

    calculateSystemHealth() {
        const totalComponents = Object.keys(this.systemMap.apps).length +
            Object.keys(this.systemMap.services).length;
        const corruptedComponents = this.systemMap.orphaned.filter(o => o.type === 'corrupted-service').length;
        const orphanedComponents = this.systemMap.orphaned.filter(o => o.type !== 'corrupted-service').length;

        const healthScore = Math.max(0, 100 - (corruptedComponents * 20) - (orphanedComponents * 5));
        return Math.round(healthScore);
    }
}

// CLI Interface
if (require.main === module) {
    const intelligence = new SystemIntelligenceGathering();

    intelligence.gatherSystemIntelligence()
        .then((report) => {
            console.log('\n🎯 SYSTEM INTELLIGENCE GATHERING COMPLETE');
            console.log('==========================================');
            console.log(`📊 System Health: ${intelligence.calculateSystemHealth()}%`);
            console.log(`💀 Critical Issues: ${report.summary.orphanedComponents}`);
            console.log(`💡 Opportunities: ${report.summary.opportunities}`);
            console.log(`⚠️ Risks: ${report.summary.risks}`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('💀 Intelligence gathering failed:', error.message);
            process.exit(1);
        });
}

module.exports = SystemIntelligenceGathering;
