#!/usr/bin/env node

/**
 * Knowledge Hub Auto-Updater
 * 
 * Scans the codebase and automatically updates the Knowledge Hub
 * to ensure it stays current and comprehensive.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class KnowledgeHubUpdater {
    constructor() {
        this.projectRoot = process.cwd();
        this.hubPath = path.join(this.projectRoot, 'KNOWLEDGE_HUB.md');
        this.scanResults = {
            newFiles: [],
            modifiedFiles: [],
            newTools: [],
            newTemplates: [],
            newEndpoints: [],
            newScripts: [],
            newDocumentation: []
        };
    }

    async updateHub() {
        console.log('🔄 Updating Knowledge Hub...');

        try {
            // Scan for new and modified files
            await this.scanCodebase();

            // Analyze changes
            await this.analyzeChanges();

            // Update hub content
            await this.updateHubContent();

            // Generate update report
            await this.generateUpdateReport();

            console.log('✅ Knowledge Hub updated successfully!');

        } catch (error) {
            console.error('❌ Error updating Knowledge Hub:', error);
            process.exit(1);
        }
    }

    async scanCodebase() {
        console.log('📁 Scanning codebase for changes...');

        // Get git status for modified files
        try {
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
            const lines = gitStatus.split('\n').filter(line => line.trim());

            lines.forEach(line => {
                const status = line.substring(0, 2).trim();
                const filePath = line.substring(3);

                if (status === 'A' || status === '??') {
                    this.scanResults.newFiles.push(filePath);
                } else if (status === 'M') {
                    this.scanResults.modifiedFiles.push(filePath);
                }
            });
        } catch (error) {
            console.log('⚠️  Git not available, scanning all files...');
            await this.scanAllFiles();
        }
    }

    async scanAllFiles() {
        const directories = [
            'backend',
            'src',
            'tools',
            'scripts',
            'docs',
            'consciousness',
            'OCTOSPINE'
        ];

        for (const dir of directories) {
            if (fs.existsSync(dir)) {
                await this.scanDirectory(dir);
            }
        }
    }

    async scanDirectory(dirPath, relativePath = '') {
        const fullPath = path.join(this.projectRoot, dirPath);
        const items = fs.readdirSync(fullPath);

        for (const item of items) {
            const itemPath = path.join(fullPath, item);
            const relativeItemPath = path.join(relativePath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                await this.scanDirectory(itemPath, relativeItemPath);
            } else {
                this.categorizeFile(relativeItemPath);
            }
        }
    }

    categorizeFile(filePath) {
        const ext = path.extname(filePath);
        const fileName = path.basename(filePath);

        // Categorize based on file type and location
        if (filePath.includes('template') && ext === '.py') {
            this.scanResults.newTemplates.push(filePath);
        } else if (filePath.includes('endpoint') || filePath.includes('route')) {
            this.scanResults.newEndpoints.push(filePath);
        } else if (filePath.includes('script') || filePath.includes('.js') || filePath.includes('.py')) {
            this.scanResults.newScripts.push(filePath);
        } else if (filePath.includes('tool') || filePath.includes('utility')) {
            this.scanResults.newTools.push(filePath);
        } else if (ext === '.md' || ext === '.txt') {
            this.scanResults.newDocumentation.push(filePath);
        }
    }

    async analyzeChanges() {
        console.log('🔍 Analyzing changes...');

        // Analyze new templates
        for (const template of this.scanResults.newTemplates) {
            await this.analyzeTemplate(template);
        }

        // Analyze new endpoints
        for (const endpoint of this.scanResults.newEndpoints) {
            await this.analyzeEndpoint(endpoint);
        }

        // Analyze new tools
        for (const tool of this.scanResults.newTools) {
            await this.analyzeTool(tool);
        }
    }

    async analyzeTemplate(templatePath) {
        try {
            const content = fs.readFileSync(templatePath, 'utf8');

            // Extract template information
            const templateInfo = {
                name: path.basename(templatePath, path.extname(templatePath)),
                path: templatePath,
                category: this.determineTemplateCategory(content),
                description: this.extractDescription(content),
                parameters: this.extractParameters(content)
            };

            console.log(`📋 Found template: ${templateInfo.name}`);
        } catch (error) {
            console.log(`⚠️  Could not analyze template ${templatePath}:`, error.message);
        }
    }

    async analyzeEndpoint(endpointPath) {
        try {
            const content = fs.readFileSync(endpointPath, 'utf8');

            // Extract endpoint information
            const endpointInfo = {
                name: path.basename(endpointPath, path.extname(endpointPath)),
                path: endpointPath,
                methods: this.extractHttpMethods(content),
                description: this.extractDescription(content)
            };

            console.log(`🔗 Found endpoint: ${endpointInfo.name}`);
        } catch (error) {
            console.log(`⚠️  Could not analyze endpoint ${endpointPath}:`, error.message);
        }
    }

    async analyzeTool(toolPath) {
        try {
            const content = fs.readFileSync(toolPath, 'utf8');

            // Extract tool information
            const toolInfo = {
                name: path.basename(toolPath, path.extname(toolPath)),
                path: toolPath,
                category: this.determineToolCategory(content),
                description: this.extractDescription(content),
                usage: this.extractUsage(content)
            };

            console.log(`🛠️  Found tool: ${toolInfo.name}`);
        } catch (error) {
            console.log(`⚠️  Could not analyze tool ${toolPath}:`, error.message);
        }
    }

    determineTemplateCategory(content) {
        if (content.includes('BUSINESS') || content.includes('revenue')) return 'Business';
        if (content.includes('VAULT') || content.includes('security')) return 'Vault';
        if (content.includes('SYSTEM') || content.includes('infrastructure')) return 'System';
        if (content.includes('INTEGRATION') || content.includes('coordination')) return 'Integration';
        return 'General';
    }

    determineToolCategory(content) {
        if (content.includes('extraction') || content.includes('parse')) return 'Extraction';
        if (content.includes('analysis') || content.includes('analyze')) return 'Analysis';
        if (content.includes('utility') || content.includes('helper')) return 'Utility';
        if (content.includes('automation') || content.includes('script')) return 'Automation';
        return 'General';
    }

    extractDescription(content) {
        // Look for common description patterns
        const patterns = [
            /"""([^"]+)"""/,
            /'''([^']+)'''/,
            /\/\*\*([^*]+)\*\//,
            /\/\/\s*([^\n]+)/,
            /#\s*([^\n]+)/
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return 'No description found';
    }

    extractParameters(content) {
        // Extract function parameters
        const paramPattern = /def\s+\w+\s*\(([^)]+)\)/g;
        const params = [];
        let match;

        while ((match = paramPattern.exec(content)) !== null) {
            params.push(...match[1].split(',').map(p => p.trim()));
        }

        return params;
    }

    extractHttpMethods(content) {
        const methods = [];
        const methodPatterns = [
            /@app\.get/g,
            /@app\.post/g,
            /@app\.put/g,
            /@app\.delete/g,
            /@app\.patch/g
        ];

        methodPatterns.forEach((pattern, index) => {
            const matches = content.match(pattern);
            if (matches) {
                const methodNames = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
                methods.push(methodNames[index]);
            }
        });

        return methods;
    }

    extractUsage(content) {
        // Look for usage examples
        const usagePattern = /usage[:\s]+([^\n]+)/i;
        const match = content.match(usagePattern);
        return match ? match[1].trim() : 'No usage information found';
    }

    async updateHubContent() {
        console.log('📝 Updating Knowledge Hub content...');

        // Read current hub content
        let hubContent = fs.readFileSync(this.hubPath, 'utf8');

        // Update sections based on scan results
        hubContent = this.updateTemplatesSection(hubContent);
        hubContent = this.updateToolsSection(hubContent);
        hubContent = this.updateEndpointsSection(hubContent);
        hubContent = this.updateScriptsSection(hubContent);

        // Write updated content
        fs.writeFileSync(this.hubPath, hubContent);
    }

    updateTemplatesSection(content) {
        if (this.scanResults.newTemplates.length === 0) return content;

        const newTemplates = this.scanResults.newTemplates
            .map(template => `  - \`@template ${path.basename(template, path.extname(template))}\` - ${this.extractDescription(fs.readFileSync(template, 'utf8'))}`)
            .join('\n');

        // Find templates section and add new ones
        const templateSection = content.indexOf('### **Template System (129 Templates)**');
        if (templateSection !== -1) {
            const insertPoint = content.indexOf('### **Template Categories**', templateSection);
            if (insertPoint !== -1) {
                const before = content.substring(0, insertPoint);
                const after = content.substring(insertPoint);
                return before + '\n\n' + newTemplates + '\n\n' + after;
            }
        }

        return content;
    }

    updateToolsSection(content) {
        if (this.scanResults.newTools.length === 0) return content;

        const newTools = this.scanResults.newTools
            .map(tool => `  - **${path.basename(tool)}** - ${this.extractDescription(fs.readFileSync(tool, 'utf8'))}`)
            .join('\n');

        // Find tools section and add new ones
        const toolsSection = content.indexOf('### **Development Tools**');
        if (toolsSection !== -1) {
            const insertPoint = content.indexOf('---', toolsSection);
            if (insertPoint !== -1) {
                const before = content.substring(0, insertPoint);
                const after = content.substring(insertPoint);
                return before + '\n\n' + newTools + '\n\n' + after;
            }
        }

        return content;
    }

    updateEndpointsSection(content) {
        if (this.scanResults.newEndpoints.length === 0) return content;

        const newEndpoints = this.scanResults.newEndpoints
            .map(endpoint => `  - **${path.basename(endpoint)}** - ${this.extractDescription(fs.readFileSync(endpoint, 'utf8'))}`)
            .join('\n');

        // Find backend section and add new endpoints
        const backendSection = content.indexOf('### **Backend (FastAPI)**');
        if (backendSection !== -1) {
            const insertPoint = content.indexOf('### **Frontend (React/TypeScript)**', backendSection);
            if (insertPoint !== -1) {
                const before = content.substring(0, insertPoint);
                const after = content.substring(insertPoint);
                return before + '\n  - **New Endpoints**:\n' + newEndpoints + '\n\n' + after;
            }
        }

        return content;
    }

    updateScriptsSection(content) {
        if (this.scanResults.newScripts.length === 0) return content;

        const newScripts = this.scanResults.newScripts
            .map(script => `  - **${path.basename(script)}** - ${this.extractDescription(fs.readFileSync(script, 'utf8'))}`)
            .join('\n');

        // Find scripts section and add new ones
        const scriptsSection = content.indexOf('### **Scripts & Automation**');
        if (scriptsSection !== -1) {
            const insertPoint = content.indexOf('### **Development Tools**', scriptsSection);
            if (insertPoint !== -1) {
                const before = content.substring(0, insertPoint);
                const after = content.substring(insertPoint);
                return before + '\n\n' + newScripts + '\n\n' + after;
            }
        }

        return content;
    }

    async generateUpdateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            newFiles: this.scanResults.newFiles.length,
            modifiedFiles: this.scanResults.modifiedFiles.length,
            newTemplates: this.scanResults.newTemplates.length,
            newEndpoints: this.scanResults.newEndpoints.length,
            newTools: this.scanResults.newTools.length,
            newScripts: this.scanResults.newScripts.length,
            newDocumentation: this.scanResults.newDocumentation.length
        };

        const reportPath = path.join(this.projectRoot, 'knowledge-hub-update-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log('📊 Update Report:');
        console.log(`  - New Files: ${report.newFiles}`);
        console.log(`  - Modified Files: ${report.modifiedFiles}`);
        console.log(`  - New Templates: ${report.newTemplates}`);
        console.log(`  - New Endpoints: ${report.newEndpoints}`);
        console.log(`  - New Tools: ${report.newTools}`);
        console.log(`  - New Scripts: ${report.newScripts}`);
        console.log(`  - New Documentation: ${report.newDocumentation}`);
    }
}

// Run the updater
if (import.meta.url === `file://${process.argv[1]}`) {
    const updater = new KnowledgeHubUpdater();
    updater.updateHub().catch(console.error);
}

// Export the main function for framework execution
export const updateHub = async (context = {}) => {
    const updater = new KnowledgeHubUpdater();
    const result = await updater.updateHub();

    // Return structured result for framework integration
    const response = {
        success: true,
        hub_updated: true,
        report_generated: true,
        data: result,
        summary: {
            newFiles: updater.scanResults.newFiles.length,
            modifiedFiles: updater.scanResults.modifiedFiles.length,
            newTemplates: updater.scanResults.newTemplates.length,
            newEndpoints: updater.scanResults.newEndpoints.length,
            newTools: updater.scanResults.newTools.length,
            newScripts: updater.scanResults.newScripts.length,
            newDocumentation: updater.scanResults.newDocumentation.length
        },
        context: context
    };

    // Output JSON response to stdout for framework integration
    console.log(JSON.stringify(response));

    return response;
};

export default KnowledgeHubUpdater;
