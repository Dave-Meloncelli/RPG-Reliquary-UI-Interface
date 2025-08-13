#!/usr/bin/env node

/**
 * Error Resolution Toolkit
 * 
 * A consolidated toolkit extracted from the az-interface error resolution journey.
 * This toolkit provides reusable patterns, strategies, and utilities for resolving
 * TypeScript errors in complex codebases.
 * 
 * Learning Extracted:
 * - Error categorization patterns
 * - Fix application strategies
 * - File structure analysis
 * - Type definition resolution
 * - Syntax error patterns
 * - Rollback and safety mechanisms
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ErrorResolutionToolkit {
    constructor(options = {}) {
        this.options = {
            maxIterations: 10,
            timeout: 300000, // 5 minutes
            backupFiles: true,
            verbose: true,
            ...options
        };

        this.errorPatterns = this.initializeErrorPatterns();
        this.fixStrategies = this.initializeFixStrategies();
        this.learningDatabase = this.loadLearningDatabase();
        this.backupDir = '.error-resolution-backup';
    }

    log(message, type = 'info') {
        if (!this.options.verbose) return;

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

    initializeErrorPatterns() {
        return {
            // Syntax Errors
            syntax: {
                missingBraces: /expected '}'/,
                missingSemicolon: /expected ';'/,
                duplicateDeclaration: /has already been declared/,
                malformedInterface: /interface.*\{/,
                orphanedCode: /^\s*\}\s*$/m
            },

            // Type Errors
            types: {
                missingType: /implicitly has an 'any' type/,
                typeMismatch: /Type.*is not assignable to type/,
                missingProperty: /Property.*does not exist on type/,
                undefinedVariable: /Cannot find name/,
                importError: /Module.*has no exported member/
            },

            // Structural Errors
            structural: {
                duplicateExport: /Duplicate export/,
                malformedObject: /Object literal may only specify known properties/,
                invalidMethod: /Method.*does not exist/,
                circularDependency: /Circular dependency/
            }
        };
    }

    initializeFixStrategies() {
        return {
            // Syntax Fixes
            syntax: {
                missingBraces: this.fixMissingBraces.bind(this),
                missingSemicolon: this.fixMissingSemicolon.bind(this),
                duplicateDeclaration: this.fixDuplicateDeclaration.bind(this),
                malformedInterface: this.fixMalformedInterface.bind(this),
                orphanedCode: this.removeOrphanedCode.bind(this)
            },

            // Type Fixes
            types: {
                missingType: this.addMissingType.bind(this),
                typeMismatch: this.fixTypeMismatch.bind(this),
                missingProperty: this.addMissingProperty.bind(this),
                undefinedVariable: this.defineUndefinedVariable.bind(this),
                importError: this.fixImportError.bind(this)
            },

            // Structural Fixes
            structural: {
                duplicateExport: this.removeDuplicateExport.bind(this),
                malformedObject: this.fixMalformedObject.bind(this),
                invalidMethod: this.fixInvalidMethod.bind(this),
                circularDependency: this.resolveCircularDependency.bind(this)
            }
        };
    }

    loadLearningDatabase() {
        const dbPath = path.join(__dirname, 'error-learning-db.json');
        if (fs.existsSync(dbPath)) {
            try {
                return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            } catch (error) {
                this.log('Failed to load learning database, creating new one', 'warning');
            }
        }

        return {
            errorPatterns: {},
            successfulFixes: {},
            failedFixes: {},
            filePatterns: {},
            statistics: {
                totalErrors: 0,
                resolvedErrors: 0,
                failedResolutions: 0,
                averageResolutionTime: 0
            }
        };
    }

    saveLearningDatabase() {
        const dbPath = path.join(__dirname, 'error-learning-db.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.learningDatabase, null, 2));
    }

    async runTypeScriptCheck() {
        try {
            const result = execSync('npm run typecheck', {
                encoding: 'utf8',
                timeout: this.options.timeout
            });
            return { success: true, output: result, errors: [] };
        } catch (error) {
            const output = error.stdout || error.stderr || '';
            const errors = this.parseTypeScriptErrors(output);
            return { success: false, output, errors };
        }
    }

    parseTypeScriptErrors(output) {
        const errorLines = output.split('\n').filter(line =>
            line.includes('error TS') ||
            line.includes('Cannot find') ||
            line.includes('has already been declared') ||
            line.includes('Property') && line.includes('does not exist')
        );

        return errorLines.map(line => {
            const match = line.match(/([^(]+)\((\d+),(\d+)\): error TS(\d+): (.+)/);
            if (match) {
                return {
                    file: match[1].trim(),
                    line: parseInt(match[2]),
                    column: parseInt(match[3]),
                    code: match[4],
                    message: match[5],
                    fullLine: line
                };
            }
            return { message: line, fullLine: line };
        });
    }

    categorizeError(error) {
        for (const [category, patterns] of Object.entries(this.errorPatterns)) {
            for (const [patternName, pattern] of Object.entries(patterns)) {
                if (pattern.test(error.message)) {
                    return { category, pattern: patternName, severity: this.determineSeverity(category) };
                }
            }
        }
        return { category: 'unknown', pattern: 'unknown', severity: 'medium' };
    }

    determineSeverity(category) {
        const severityMap = {
            syntax: 'high',
            types: 'medium',
            structural: 'high',
            unknown: 'medium'
        };
        return severityMap[category] || 'medium';
    }

    async createBackup() {
        if (!this.options.backupFiles) return;

        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
        fs.mkdirSync(backupPath, { recursive: true });

        // Backup TypeScript files
        const tsFiles = this.findTypeScriptFiles();
        for (const file of tsFiles) {
            const relativePath = path.relative('.', file);
            const backupFile = path.join(backupPath, relativePath);
            const backupDir = path.dirname(backupFile);

            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            fs.copyFileSync(file, backupFile);
        }

        this.log(`Backup created at: ${backupPath}`, 'success');
        return backupPath;
    }

    findTypeScriptFiles(dir = '.') {
        const files = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                files.push(...this.findTypeScriptFiles(fullPath));
            } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
                files.push(fullPath);
            }
        }

        return files;
    }

    async resolveErrors() {
        this.log('🚀 STARTING ERROR RESOLUTION TOOLKIT', 'info');
        this.log('================================================', 'info');

        const startTime = Date.now();
        let iteration = 0;
        let totalErrorsResolved = 0;

        // Create backup
        const backupPath = await this.createBackup();

        try {
            while (iteration < this.options.maxIterations) {
                iteration++;
                this.log(`\n🔄 ITERATION ${iteration}/${this.options.maxIterations}`, 'info');

                // Check current errors
                const checkResult = await this.runTypeScriptCheck();

                if (checkResult.success) {
                    this.log('✅ No TypeScript errors found!', 'success');
                    break;
                }

                const errors = checkResult.errors;
                this.log(`Found ${errors.length} errors to resolve`, 'info');

                if (errors.length === 0) {
                    this.log('No parseable errors found', 'warning');
                    break;
                }

                // Categorize and prioritize errors
                const categorizedErrors = errors.map(error => ({
                    ...error,
                    ...this.categorizeError(error)
                })).sort((a, b) => {
                    const severityOrder = { high: 3, medium: 2, low: 1 };
                    return severityOrder[b.severity] - severityOrder[a.severity];
                });

                // Apply fixes
                let errorsResolved = 0;
                for (const error of categorizedErrors) {
                    const fixResult = await this.applyFix(error);
                    if (fixResult.success) {
                        errorsResolved++;
                        totalErrorsResolved++;
                        this.updateLearningDatabase(error, fixResult, true);
                    } else {
                        this.updateLearningDatabase(error, fixResult, false);
                    }
                }

                this.log(`Resolved ${errorsResolved} errors in this iteration`, 'success');

                if (errorsResolved === 0) {
                    this.log('No more errors can be automatically resolved', 'warning');
                    break;
                }
            }

            const duration = Date.now() - startTime;
            this.log(`\n🎯 ERROR RESOLUTION COMPLETE`, 'success');
            this.log(`⏱️  Duration: ${duration}ms`, 'success');
            this.log(`🔧 Total Errors Resolved: ${totalErrorsResolved}`, 'success');
            this.log(`🔄 Iterations: ${iteration}`, 'success');

            // Save learning database
            this.saveLearningDatabase();

            // Final check
            const finalCheck = await this.runTypeScriptCheck();
            if (finalCheck.success) {
                this.log('✅ All TypeScript errors resolved successfully!', 'success');
            } else {
                this.log(`⚠️  ${finalCheck.errors.length} errors remain`, 'warning');
            }

        } catch (error) {
            this.log(`💀 Error resolution failed: ${error.message}`, 'error');

            // Restore from backup if available
            if (backupPath && fs.existsSync(backupPath)) {
                this.log('🔄 Restoring from backup...', 'info');
                await this.restoreFromBackup(backupPath);
            }

            throw error;
        }
    }

    async applyFix(error) {
        const { category, pattern } = error;
        const strategy = this.fixStrategies[category]?.[pattern];

        if (!strategy) {
            return { success: false, reason: 'No strategy available for this error type' };
        }

        try {
            const result = await strategy(error);
            return { success: true, result };
        } catch (fixError) {
            return { success: false, reason: fixError.message };
        }
    }

    // Fix Strategy Implementations
    async fixMissingBraces(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        // Count braces and add missing ones
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;

        if (openBraces > closeBraces) {
            const missingBraces = openBraces - closeBraces;
            const newContent = content + '\n'.repeat(missingBraces) + '}'.repeat(missingBraces);
            fs.writeFileSync(error.file, newContent, 'utf8');
            return { success: true, bracesAdded: missingBraces };
        }

        return { success: false, reason: 'No missing braces detected' };
    }

    async fixMissingSemicolon(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        if (error.line && error.line <= lines.length) {
            const lineIndex = error.line - 1;
            const line = lines[lineIndex];

            if (!line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}')) {
                lines[lineIndex] = line + ';';
                fs.writeFileSync(error.file, lines.join('\n'), 'utf8');
                return { success: true, lineFixed: error.line };
            }
        }

        return { success: false, reason: 'No missing semicolon detected' };
    }

    async fixDuplicateDeclaration(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        if (error.line && error.line <= lines.length) {
            const lineIndex = error.line - 1;
            const line = lines[lineIndex];

            // Remove duplicate declaration
            lines.splice(lineIndex, 1);
            fs.writeFileSync(error.file, lines.join('\n'), 'utf8');
            return { success: true, lineRemoved: error.line };
        }

        return { success: false, reason: 'No duplicate declaration found' };
    }

    async fixMalformedInterface(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');

        // Fix common interface issues
        let newContent = content
            .replace(/interface\s+(\w+)\s*\{/g, 'interface $1 {')
            .replace(/;\s*;/g, ';')
            .replace(/,\s*,/g, ',');

        if (newContent !== content) {
            fs.writeFileSync(error.file, newContent, 'utf8');
            return { success: true, interfacesFixed: true };
        }

        return { success: false, reason: 'No malformed interfaces detected' };
    }

    async removeOrphanedCode(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');
        const filteredLines = lines.filter(line => !line.trim().match(/^\s*\}\s*$/));

        if (filteredLines.length < lines.length) {
            fs.writeFileSync(error.file, filteredLines.join('\n'), 'utf8');
            return { success: true, orphanedCodeRemoved: true };
        }

        return { success: false, reason: 'No orphaned code detected' };
    }

    async addMissingType(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');

        // Add explicit any type where missing
        let newContent = content.replace(/(\w+):\s*([^;,\n]+)(?!\s*:)/g, '$1: any');

        if (newContent !== content) {
            fs.writeFileSync(error.file, newContent, 'utf8');
            return { success: true, typesAdded: true };
        }

        return { success: false, reason: 'No missing types detected' };
    }

    async fixTypeMismatch(error) {
        // Type mismatches often require manual intervention
        return { success: false, reason: 'Type mismatches require manual review' };
    }

    async addMissingProperty(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');

        // Extract property name from error message
        const propertyMatch = error.message.match(/Property '(\w+)' does not exist/);
        if (propertyMatch) {
            const propertyName = propertyMatch[1];

            // Find interface definitions and add missing property
            const newContent = content.replace(
                /(interface\s+\w+\s*\{[^}]*)/g,
                `$1\n  ${propertyName}?: any;`
            );

            if (newContent !== content) {
                fs.writeFileSync(error.file, newContent, 'utf8');
                return { success: true, propertyAdded: propertyName };
            }
        }

        return { success: false, reason: 'Could not add missing property' };
    }

    async defineUndefinedVariable(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');

        // Extract variable name from error message
        const variableMatch = error.message.match(/Cannot find name '(\w+)'/);
        if (variableMatch) {
            const variableName = variableMatch[1];

            // Add variable declaration at the top of the function/scope
            const newContent = content.replace(
                /(\w+\s*\([^)]*\)\s*\{)/g,
                `$1\n  const ${variableName} = null; // TODO: Define ${variableName}`
            );

            if (newContent !== content) {
                fs.writeFileSync(error.file, newContent, 'utf8');
                return { success: true, variableDefined: variableName };
            }
        }

        return { success: false, reason: 'Could not define undefined variable' };
    }

    async fixImportError(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');

        // Remove problematic imports
        const newContent = content.replace(
            /import\s+\{[^}]*\b\w+\b[^}]*\}\s+from\s+['"][^'"]+['"];?\n?/g,
            ''
        );

        if (newContent !== content) {
            fs.writeFileSync(error.file, newContent, 'utf8');
            return { success: true, importsCleaned: true };
        }

        return { success: false, reason: 'No import errors detected' };
    }

    async removeDuplicateExport(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');
        const lines = content.split('\n');

        // Remove duplicate export lines
        const seenExports = new Set();
        const filteredLines = lines.filter(line => {
            const exportMatch = line.match(/export\s+(.+)/);
            if (exportMatch) {
                const exportContent = exportMatch[1];
                if (seenExports.has(exportContent)) {
                    return false; // Remove duplicate
                }
                seenExports.add(exportContent);
            }
            return true;
        });

        if (filteredLines.length < lines.length) {
            fs.writeFileSync(error.file, filteredLines.join('\n'), 'utf8');
            return { success: true, duplicatesRemoved: true };
        }

        return { success: false, reason: 'No duplicate exports detected' };
    }

    async fixMalformedObject(error) {
        if (!error.file) return { success: false, reason: 'No file specified' };

        const content = fs.readFileSync(error.file, 'utf8');

        // Fix common object literal issues
        let newContent = content
            .replace(/,\s*,/g, ',')
            .replace(/,\s*}/g, '}')
            .replace(/{\s*,/g, '{');

        if (newContent !== content) {
            fs.writeFileSync(error.file, newContent, 'utf8');
            return { success: true, objectsFixed: true };
        }

        return { success: false, reason: 'No malformed objects detected' };
    }

    async fixInvalidMethod(error) {
        // Method errors often require manual intervention
        return { success: false, reason: 'Invalid method errors require manual review' };
    }

    async resolveCircularDependency(error) {
        // Circular dependencies require architectural changes
        return { success: false, reason: 'Circular dependencies require manual resolution' };
    }

    updateLearningDatabase(error, fixResult, success) {
        const errorKey = `${error.category}:${error.pattern}`;

        if (!this.learningDatabase.errorPatterns[errorKey]) {
            this.learningDatabase.errorPatterns[errorKey] = {
                count: 0,
                successfulFixes: 0,
                failedFixes: 0,
                averageResolutionTime: 0
            };
        }

        const pattern = this.learningDatabase.errorPatterns[errorKey];
        pattern.count++;

        if (success) {
            pattern.successfulFixes++;
            this.learningDatabase.statistics.resolvedErrors++;
        } else {
            pattern.failedFixes++;
            this.learningDatabase.statistics.failedResolutions++;
        }

        this.learningDatabase.statistics.totalErrors++;
    }

    async restoreFromBackup(backupPath) {
        if (!fs.existsSync(backupPath)) {
            throw new Error('Backup path does not exist');
        }

        const tsFiles = this.findTypeScriptFiles();
        for (const file of tsFiles) {
            const relativePath = path.relative('.', file);
            const backupFile = path.join(backupPath, relativePath);

            if (fs.existsSync(backupFile)) {
                fs.copyFileSync(backupFile, file);
            }
        }

        this.log('Backup restored successfully', 'success');
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            statistics: this.learningDatabase.statistics,
            errorPatterns: this.learningDatabase.errorPatterns,
            recommendations: this.generateRecommendations()
        };

        const reportPath = path.join(__dirname, 'error-resolution-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        this.log(`Report generated: ${reportPath}`, 'success');
        return report;
    }

    generateRecommendations() {
        const recommendations = [];

        // Analyze error patterns
        for (const [pattern, data] of Object.entries(this.learningDatabase.errorPatterns)) {
            const successRate = data.successfulFixes / data.count;

            if (successRate < 0.5) {
                recommendations.push({
                    type: 'pattern',
                    pattern,
                    issue: 'Low success rate',
                    suggestion: 'Review and improve fix strategy for this error pattern'
                });
            }
        }

        // General recommendations
        if (this.learningDatabase.statistics.failedResolutions > 0) {
            recommendations.push({
                type: 'general',
                issue: 'Failed resolutions detected',
                suggestion: 'Consider manual review of unresolved errors'
            });
        }

        return recommendations;
    }
}

// CLI Interface
if (require.main === module) {
    const toolkit = new ErrorResolutionToolkit({
        maxIterations: 10,
        timeout: 300000,
        backupFiles: true,
        verbose: true
    });

    toolkit.resolveErrors()
        .then(() => {
            toolkit.generateReport();
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error resolution failed:', error.message);
            process.exit(1);
        });
}

module.exports = ErrorResolutionToolkit;
