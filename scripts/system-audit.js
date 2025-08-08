#!/usr/bin/env node

/**
 * Recursive System Audit Tool
 * 
 * Performs a comprehensive audit of the entire AZ Interface system,
 * mapping all connections and ensuring the Knowledge Hub is complete.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class SystemAuditor {
    constructor(context = {}) {
        this.projectRoot = process.cwd();
        this.context = context;
        this.auditResults = {
            files: {},
            connections: {},
            dependencies: {},
            templates: {},
            endpoints: {},
            tools: {},
            documentation: {},
            missing: {},
            recommendations: []
        };
    }

    async performFullAudit() {
        console.log('🔍 Performing Full Recursive System Audit...');

        try {
            // Phase 1: File Discovery
            await this.discoverAllFiles();

            // Phase 2: Connection Mapping
            await this.mapConnections();

            // Phase 3: Dependency Analysis
            await this.analyzeDependencies();

            // Phase 4: Knowledge Hub Validation
            await this.validateKnowledgeHub();

            // Phase 5: Generate Recommendations
            await this.generateRecommendations();

            // Phase 6: Generate Audit Report
            await this.generateAuditReport();

            // Don't output to console when called from framework
            if (!this.context || !this.context.entry_point) {
                console.log('✅ Full system audit completed!');
            }

        } catch (error) {
            if (!this.context || !this.context.entry_point) {
                console.error('❌ Error during system audit:', error);
                process.exit(1);
            } else {
                throw error;
            }
        }
    }

    async discoverAllFiles() {
        if (!this.context || !this.context.entry_point) {
            console.log('📁 Phase 1: Discovering all files...');
        }

        const directories = [
            'backend',
            'src',
            'tools',
            'scripts',
            'docs',
            'consciousness',
            'OCTOSPINE',
            'Personas',
            'a2a',
            'crewai',
            'monitoring',
            'installer',
            'config',
            'internal'
        ];

        for (const dir of directories) {
            if (fs.existsSync(dir)) {
                await this.scanDirectoryRecursively(dir);
            }
        }

        if (!this.context || !this.context.entry_point) {
            console.log(`📊 Discovered ${Object.keys(this.auditResults.files).length} files`);
        }
    }

    async scanDirectoryRecursively(dirPath, relativePath = '') {
        // Use the dirPath directly since it's already relative to project root
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const relativeItemPath = path.join(relativePath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                await this.scanDirectoryRecursively(itemPath, relativeItemPath);
            } else {
                this.categorizeAndAnalyzeFile(relativeItemPath);
            }
        }
    }

    categorizeAndAnalyzeFile(filePath) {
        const ext = path.extname(filePath);
        const fileName = path.basename(filePath);
        const fullPath = path.join(this.projectRoot, filePath);

        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const stats = fs.statSync(fullPath);

            const fileInfo = {
                path: filePath,
                name: fileName,
                extension: ext,
                size: stats.size,
                modified: stats.mtime,
                category: this.determineCategory(filePath, content),
                description: this.extractDescription(content),
                dependencies: this.extractDependencies(content, ext),
                connections: this.extractConnections(content, filePath),
                templateInfo: this.extractTemplateInfo(content, filePath),
                endpointInfo: this.extractEndpointInfo(content, filePath),
                toolInfo: this.extractToolInfo(content, filePath)
            };

            this.auditResults.files[filePath] = fileInfo;

            // Categorize into specific collections
            if (fileInfo.templateInfo) {
                this.auditResults.templates[filePath] = fileInfo;
            }
            if (fileInfo.endpointInfo) {
                this.auditResults.endpoints[filePath] = fileInfo;
            }
            if (fileInfo.toolInfo) {
                this.auditResults.tools[filePath] = fileInfo;
            }
            if (ext === '.md' || ext === '.txt') {
                this.auditResults.documentation[filePath] = fileInfo;
            }

        } catch (error) {
            console.log(`⚠️  Could not analyze file ${filePath}:`, error.message);
        }
    }

    determineCategory(filePath, content) {
        if (filePath.includes('template')) return 'Template';
        if (filePath.includes('endpoint') || filePath.includes('route')) return 'Endpoint';
        if (filePath.includes('tool') || filePath.includes('utility')) return 'Tool';
        if (filePath.includes('script')) return 'Script';
        if (filePath.includes('model') || filePath.includes('schema')) return 'Model';
        if (filePath.includes('service')) return 'Service';
        if (filePath.includes('component')) return 'Component';
        if (filePath.includes('config')) return 'Configuration';
        if (filePath.includes('test')) return 'Test';
        if (filePath.includes('doc') || filePath.includes('readme')) return 'Documentation';
        return 'General';
    }

    extractDescription(content) {
        const patterns = [
            /"""([^"]+)"""/,
            /'''([^']+)'''/,
            /\/\*\*([^*]+)\*\//,
            /\/\/\s*([^\n]+)/,
            /#\s*([^\n]+)/,
            /##\s*([^\n]+)/,
            /###\s*([^\n]+)/
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return 'No description found';
    }

    extractDependencies(content, ext) {
        const dependencies = [];

        if (ext === '.py') {
            // Python imports
            const importPattern = /(?:from|import)\s+([a-zA-Z_][a-zA-Z0-9_.]*)/g;
            let match;
            while ((match = importPattern.exec(content)) !== null) {
                dependencies.push(match[1]);
            }
        } else if (ext === '.js' || ext === '.ts' || ext === '.tsx') {
            // JavaScript/TypeScript imports
            const importPattern = /(?:import|require)\s*\(?['"`]([^'"`]+)['"`]\)?/g;
            let match;
            while ((match = importPattern.exec(content)) !== null) {
                dependencies.push(match[1]);
            }
        }

        return dependencies;
    }

    extractConnections(content, filePath) {
        const connections = [];

        // Look for references to other files
        const fileRefPattern = /['"`]([^'"`]*\.(?:py|js|ts|tsx|md|json|yaml|yml))['"`]/g;
        let match;
        while ((match = fileRefPattern.exec(content)) !== null) {
            connections.push(match[1]);
        }

        // Look for API endpoint references
        const endpointPattern = /['"`](\/[a-zA-Z0-9\/_-]+)['"`]/g;
        while ((match = endpointPattern.exec(content)) !== null) {
            connections.push(`API: ${match[1]}`);
        }

        // Look for template references
        const templatePattern = /@template\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        while ((match = templatePattern.exec(content)) !== null) {
            connections.push(`Template: ${match[1]}`);
        }

        return connections;
    }

    extractTemplateInfo(content, filePath) {
        if (!filePath.includes('template') && !content.includes('@template')) {
            return null;
        }

        return {
            name: path.basename(filePath, path.extname(filePath)),
            category: this.determineTemplateCategory(content),
            parameters: this.extractTemplateParameters(content),
            agent: this.extractAgentReference(content),
            tier: this.extractTemplateTier(content)
        };
    }

    extractEndpointInfo(content, filePath) {
        if (!content.includes('@app.') && !content.includes('router.')) {
            return null;
        }

        const methods = [];
        const methodPatterns = [
            /@app\.get/g,
            /@app\.post/g,
            /@app\.put/g,
            /@app\.delete/g,
            /@app\.patch/g,
            /router\.get/g,
            /router\.post/g,
            /router\.put/g,
            /router\.delete/g,
            /router\.patch/g
        ];

        methodPatterns.forEach((pattern, index) => {
            const matches = content.match(pattern);
            if (matches) {
                const methodNames = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
                methods.push(methodNames[index % 5]);
            }
        });

        return {
            methods: methods,
            path: this.extractEndpointPath(content),
            description: this.extractDescription(content)
        };
    }

    extractToolInfo(content, filePath) {
        if (!filePath.includes('tool') && !filePath.includes('utility') && !filePath.includes('script')) {
            return null;
        }

        return {
            name: path.basename(filePath, path.extname(filePath)),
            category: this.determineToolCategory(content),
            usage: this.extractUsage(content),
            dependencies: this.extractDependencies(content, path.extname(filePath))
        };
    }

    determineTemplateCategory(content) {
        if (content.includes('BUSINESS') || content.includes('revenue')) return 'Business';
        if (content.includes('VAULT') || content.includes('security')) return 'Vault';
        if (content.includes('SYSTEM') || content.includes('infrastructure')) return 'System';
        if (content.includes('INTEGRATION') || content.includes('coordination')) return 'Integration';
        if (content.includes('CONSCIOUSNESS') || content.includes('consciousness')) return 'Consciousness';
        return 'General';
    }

    determineToolCategory(content) {
        if (content.includes('extraction') || content.includes('parse')) return 'Extraction';
        if (content.includes('analysis') || content.includes('analyze')) return 'Analysis';
        if (content.includes('utility') || content.includes('helper')) return 'Utility';
        if (content.includes('automation') || content.includes('script')) return 'Automation';
        if (content.includes('audit') || content.includes('audit')) return 'Audit';
        return 'General';
    }

    extractTemplateParameters(content) {
        const paramPattern = /def\s+\w+\s*\(([^)]+)\)/g;
        const params = [];
        let match;

        while ((match = paramPattern.exec(content)) !== null) {
            params.push(...match[1].split(',').map(p => p.trim()));
        }

        return params;
    }

    extractAgentReference(content) {
        const agentPattern = /agent[:\s]+([a-zA-Z0-9_-]+)/i;
        const match = content.match(agentPattern);
        return match ? match[1] : null;
    }

    extractTemplateTier(content) {
        const tierPatterns = [
            /tier[:\s]+([a-zA-Z]+)/i,
            /level[:\s]+([a-zA-Z]+)/i
        ];

        for (const pattern of tierPatterns) {
            const match = content.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return 'Unknown';
    }

    extractEndpointPath(content) {
        const pathPattern = /['"`](\/[a-zA-Z0-9\/_-]+)['"`]/;
        const match = content.match(pathPattern);
        return match ? match[1] : null;
    }

    extractUsage(content) {
        const usagePattern = /usage[:\s]+([^\n]+)/i;
        const match = content.match(usagePattern);
        return match ? match[1].trim() : 'No usage information found';
    }

    async mapConnections() {
        if (!this.context || !this.context.entry_point) {
            console.log('🔗 Phase 2: Mapping connections...');
        }

        for (const [filePath, fileInfo] of Object.entries(this.auditResults.files)) {
            for (const connection of fileInfo.connections) {
                if (!this.auditResults.connections[connection]) {
                    this.auditResults.connections[connection] = [];
                }
                this.auditResults.connections[connection].push(filePath);
            }
        }

        if (!this.context || !this.context.entry_point) {
            console.log(`📊 Mapped ${Object.keys(this.auditResults.connections).length} connections`);
        }
    }

    async analyzeDependencies() {
        if (!this.context || !this.context.entry_point) {
            console.log('📦 Phase 3: Analyzing dependencies...');
        }

        for (const [filePath, fileInfo] of Object.entries(this.auditResults.files)) {
            for (const dependency of fileInfo.dependencies) {
                if (!this.auditResults.dependencies[dependency]) {
                    this.auditResults.dependencies[dependency] = [];
                }
                this.auditResults.dependencies[dependency].push(filePath);
            }
        }

        if (!this.context || !this.context.entry_point) {
            console.log(`📊 Analyzed ${Object.keys(this.auditResults.dependencies).length} dependencies`);
        }
    }

    async validateKnowledgeHub() {
        if (!this.context || !this.context.entry_point) {
            console.log('✅ Phase 4: Validating Knowledge Hub...');
        }

        const hubPath = path.join(this.projectRoot, 'KNOWLEDGE_HUB.md');
        if (!fs.existsSync(hubPath)) {
            this.auditResults.missing.knowledgeHub = 'KNOWLEDGE_HUB.md does not exist';
            return;
        }

        const hubContent = fs.readFileSync(hubPath, 'utf8');

        // Check for missing sections
        const requiredSections = [
            'CORE DOCUMENTATION',
            'TOOLS & UTILITIES',
            'CONSCIOUSNESS FRAMEWORK',
            'SYSTEM ARCHITECTURE',
            'TEMPLATES & WORKFLOWS',
            'MONITORING & DIAGNOSTICS',
            'DEVELOPMENT WORKFLOW'
        ];

        for (const section of requiredSections) {
            if (!hubContent.includes(section)) {
                this.auditResults.missing[section] = `Section "${section}" missing from Knowledge Hub`;
            }
        }

        // Check for missing file references
        for (const [filePath, fileInfo] of Object.entries(this.auditResults.files)) {
            if (fileInfo.category === 'Template' && !hubContent.includes(fileInfo.name)) {
                this.auditResults.missing[`template_${fileInfo.name}`] = `Template "${fileInfo.name}" not referenced in Knowledge Hub`;
            }
            if (fileInfo.category === 'Tool' && !hubContent.includes(fileInfo.name)) {
                this.auditResults.missing[`tool_${fileInfo.name}`] = `Tool "${fileInfo.name}" not referenced in Knowledge Hub`;
            }
        }
    }

    async generateRecommendations() {
        if (!this.context || !this.context.entry_point) {
            console.log('💡 Phase 5: Generating recommendations...');
        }

        // Check for orphaned files
        for (const [filePath, fileInfo] of Object.entries(this.auditResults.files)) {
            if (fileInfo.connections.length === 0 && fileInfo.dependencies.length === 0) {
                this.auditResults.recommendations.push({
                    type: 'orphaned_file',
                    file: filePath,
                    message: 'File has no connections or dependencies - consider removal or documentation'
                });
            }
        }

        // Check for missing documentation
        for (const [filePath, fileInfo] of Object.entries(this.auditResults.files)) {
            if (fileInfo.description === 'No description found') {
                this.auditResults.recommendations.push({
                    type: 'missing_documentation',
                    file: filePath,
                    message: 'File lacks description - add documentation'
                });
            }
        }

        // Check for template consistency
        const templateCategories = Object.values(this.auditResults.templates).map(t => t.templateInfo.category);
        const categoryCounts = {};
        templateCategories.forEach(cat => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        for (const [category, count] of Object.entries(categoryCounts)) {
            if (count < 2) {
                this.auditResults.recommendations.push({
                    type: 'template_balance',
                    category: category,
                    message: `Template category "${category}" has only ${count} template(s) - consider adding more`
                });
            }
        }
    }

    async generateAuditReport() {
        if (!this.context || !this.context.entry_point) {
            console.log('📊 Phase 6: Generating audit report...');
        }

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFiles: Object.keys(this.auditResults.files).length,
                templates: Object.keys(this.auditResults.templates).length,
                endpoints: Object.keys(this.auditResults.endpoints).length,
                tools: Object.keys(this.auditResults.tools).length,
                documentation: Object.keys(this.auditResults.documentation).length,
                connections: Object.keys(this.auditResults.connections).length,
                dependencies: Object.keys(this.auditResults.dependencies).length,
                missing: Object.keys(this.auditResults.missing).length,
                recommendations: this.auditResults.recommendations.length
            },
            details: this.auditResults,
            knowledgeHubStatus: {
                exists: fs.existsSync(path.join(this.projectRoot, 'KNOWLEDGE_HUB.md')),
                completeness: this.calculateHubCompleteness(),
                missingItems: this.auditResults.missing,
                recommendations: this.auditResults.recommendations
            }
        };

        const reportPath = path.join(this.projectRoot, 'system-audit-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        // Generate markdown summary
        const markdownReport = this.generateMarkdownReport(report);
        const markdownPath = path.join(this.projectRoot, 'SYSTEM_AUDIT_REPORT.md');
        fs.writeFileSync(markdownPath, markdownReport);

        if (!this.context || !this.context.entry_point) {
            console.log('📊 Audit Report Generated:');
            console.log(`  - JSON Report: system-audit-report.json`);
            console.log(`  - Markdown Report: SYSTEM_AUDIT_REPORT.md`);
            console.log(`  - Total Files: ${report.summary.totalFiles}`);
            console.log(`  - Templates: ${report.summary.templates}`);
            console.log(`  - Endpoints: ${report.summary.endpoints}`);
            console.log(`  - Tools: ${report.summary.tools}`);
            console.log(`  - Missing Items: ${report.summary.missing}`);
            console.log(`  - Recommendations: ${report.summary.recommendations}`);
        }
    }

    calculateHubCompleteness() {
        const totalItems = Object.keys(this.auditResults.files).length;
        const missingItems = Object.keys(this.auditResults.missing).length;
        return ((totalItems - missingItems) / totalItems * 100).toFixed(2);
    }

    generateMarkdownReport(report) {
        return `# 🔍 System Audit Report

## 📊 Summary

- **Total Files**: ${report.summary.totalFiles}
- **Templates**: ${report.summary.templates}
- **Endpoints**: ${report.summary.endpoints}
- **Tools**: ${report.summary.tools}
- **Documentation**: ${report.summary.documentation}
- **Connections**: ${report.summary.connections}
- **Dependencies**: ${report.summary.dependencies}
- **Missing Items**: ${report.summary.missing}
- **Recommendations**: ${report.summary.recommendations}

## 🎯 Knowledge Hub Status

- **Exists**: ${report.knowledgeHubStatus.exists ? '✅ Yes' : '❌ No'}
- **Completeness**: ${report.knowledgeHubStatus.completeness}%

## ❌ Missing Items

${Object.entries(report.knowledgeHubStatus.missingItems)
                .map(([key, message]) => `- **${key}**: ${message}`)
                .join('\n')}

## 💡 Recommendations

${report.knowledgeHubStatus.recommendations
                .map(rec => `- **${rec.type}**: ${rec.message}`)
                .join('\n')}

## 📁 File Categories

${(() => {
                const categories = Object.entries(this.auditResults.files)
                    .reduce((acc, [path, info]) => {
                        acc[info.category] = (acc[info.category] || 0) + 1;
                        return acc;
                    }, {});
                return Object.entries(categories)
                    .map(([category, count]) => `- **${category}**: ${count} files`)
                    .join('\n');
            })()}

## 🔗 Top Connections

${Object.entries(this.auditResults.connections)
                .sort(([, a], [, b]) => b.length - a.length)
                .slice(0, 10)
                .map(([connection, files]) => `- **${connection}**: ${files.length} references`)
                .join('\n')}

---
*Generated on ${new Date().toLocaleString()}*
`;
    }
}

// Run the auditor
if (import.meta.url === `file://${process.argv[1]}`) {
    const auditor = new SystemAuditor();
    auditor.performFullAudit().catch(console.error);
}

// Export the main function for framework execution
export const performFullAudit = async (context = {}) => {
    const auditor = new SystemAuditor(context);
    const result = await auditor.performFullAudit();

    // Return structured result for framework integration
    const response = {
        success: true,
        audit_complete: true,
        hub_validated: true,
        data: result,
        summary: {
            totalFiles: Object.keys(auditor.auditResults.files).length,
            templates: Object.keys(auditor.auditResults.files).filter(f => f.includes('template')).length,
            endpoints: Object.keys(auditor.auditResults.files).filter(f => f.includes('endpoint')).length,
            tools: Object.keys(auditor.auditResults.files).filter(f => f.includes('tool')).length,
            documentation: Object.keys(auditor.auditResults.files).filter(f => f.includes('doc')).length,
            connections: Object.keys(auditor.auditResults.connections).length,
            dependencies: Object.keys(auditor.auditResults.dependencies).length,
            missing: Object.keys(auditor.auditResults.missing).length,
            recommendations: auditor.auditResults.recommendations.length
        },
        context: context
    };

    // Output JSON response to stdout for framework integration
    console.log(JSON.stringify(response));

    return response;
};

export default SystemAuditor;
