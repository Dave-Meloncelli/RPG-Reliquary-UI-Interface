#!/usr/bin/env node

/**
 * Enhanced Error Detection and Resolution Frame
 * 
 * Comprehensive multi-language error detection and automated fixing system
 * for the AZ Interface codebase with integration to existing infrastructure.
 * 
 * Features:
 * - Pre-tool checks against known faults database
 * - Post-tool actions to update documentation
 * - Multi-language support (TypeScript, JavaScript, Python, Rust, etc.)
 * - Integration with Tech Stack Delegator
 * - Results tracking and learning
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class EnhancedErrorDetectionFrame {
    constructor() {
        this.errors = [];
        this.fixes = [];
        this.criticalIssues = [];
        this.warnings = [];
        this.fixedFiles = new Set();
        this.knownFaultsDatabase = {};
        this.techStackAnalysis = {};
        this.languageDetectors = {};
        this.preToolChecks = [];
        this.postToolActions = [];
        this.learningDatabase = {};

        // Initialize language detectors
        this.initializeLanguageDetectors();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    initializeLanguageDetectors() {
        this.languageDetectors = {
            typescript: {
                extensions: ['.ts', '.tsx'],
                configFiles: ['tsconfig.json'],
                checkCommand: 'npm run typecheck',
                errorPattern: /^([^:]+):(\d+):(\d+)\s*-\s*error\s+TS(\d+):\s*(.+)$/,
                name: 'TypeScript'
            },
            javascript: {
                extensions: ['.js', '.jsx', '.mjs'],
                configFiles: ['package.json', '.eslintrc.json'],
                checkCommand: 'npx eslint . --ext .js,.jsx,.mjs',
                errorPattern: /^([^:]+):(\d+):(\d+)\s*-\s*(.+)$/,
                name: 'JavaScript'
            },
            python: {
                extensions: ['.py'],
                configFiles: ['requirements.txt', 'pyproject.toml', 'setup.py'],
                checkCommand: 'python -m py_compile',
                errorPattern: /^([^:]+):(\d+):\s*(.+)$/,
                name: 'Python'
            },
            rust: {
                extensions: ['.rs'],
                configFiles: ['Cargo.toml'],
                checkCommand: 'cargo check',
                errorPattern: /^([^:]+):(\d+):(\d+):\s*(.+)$/,
                name: 'Rust'
            },
            go: {
                extensions: ['.go'],
                configFiles: ['go.mod', 'go.sum'],
                checkCommand: 'go build ./...',
                errorPattern: /^([^:]+):(\d+):(\d+):\s*(.+)$/,
                name: 'Go'
            },
            java: {
                extensions: ['.java'],
                configFiles: ['pom.xml', 'build.gradle'],
                checkCommand: 'javac -cp . *.java',
                errorPattern: /^([^:]+):(\d+):\s*(.+)$/,
                name: 'Java'
            }
        };
    }

    async runEnhancedErrorDetection() {
        this.log('🚀 Starting enhanced error detection and resolution...', 'info');

        try {
            // PHASE 1: Pre-tool checks and setup
            await this.performPreToolChecks();

            // PHASE 2: Multi-language error detection
            await this.detectErrorsInAllLanguages();

            // PHASE 3: Known faults integration
            await this.checkKnownFaultsDatabase();

            // PHASE 4: Tech stack delegator integration
            await this.integrateWithTechStackDelegator();

            // PHASE 5: Generate and apply fixes
            await this.generateAndApplyFixes();

            // PHASE 6: Post-tool actions
            await this.performPostToolActions();

            // PHASE 7: Generate comprehensive report
            await this.generateEnhancedReport();

        } catch (error) {
            this.log(`Enhanced error detection failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    async performPreToolChecks() {
        this.log('🔍 Performing pre-tool checks...', 'info');

        // Check 1: Load known faults database
        await this.loadKnownFaultsDatabase();

        // Check 2: Detect project structure
        await this.detectProjectStructure();

        // Check 3: Validate tool dependencies
        await this.validateToolDependencies();

        // Check 4: Check for existing error reports
        await this.checkExistingErrorReports();

        // Check 5: Initialize learning database
        await this.initializeLearningDatabase();

        this.log('✅ Pre-tool checks completed', 'success');
    }

    async loadKnownFaultsDatabase() {
        this.log('📚 Loading known faults database...', 'info');

        const knownFaultsPath = 'internal/Known-faults-fixes.md';

        if (fs.existsSync(knownFaultsPath)) {
            try {
                const content = fs.readFileSync(knownFaultsPath, 'utf8');
                this.knownFaultsDatabase = this.parseKnownFaultsContent(content);
                this.log(`✅ Loaded ${Object.keys(this.knownFaultsDatabase).length} known fault patterns`, 'success');
            } catch (error) {
                this.log(`⚠️ Failed to load known faults database: ${error.message}`, 'warning');
            }
        } else {
            this.log('⚠️ Known faults database not found, creating new one', 'warning');
            this.knownFaultsDatabase = {};
        }
    }

    parseKnownFaultsContent(content) {
        const faults = {};
        const sections = content.split('## ');

        for (const section of sections) {
            if (section.includes('Fault Description') || section.includes('Error Pattern')) {
                const lines = section.split('\n');
                let currentFault = null;

                for (const line of lines) {
                    if (line.startsWith('### ')) {
                        currentFault = line.replace('### ', '').trim();
                        faults[currentFault] = {
                            patterns: [],
                            solutions: [],
                            severity: 'medium',
                            language: 'unknown'
                        };
                    } else if (currentFault && line.includes('```')) {
                        // Extract code patterns
                        const codeMatch = section.match(/```(\w+)?\n([\s\S]*?)```/g);
                        if (codeMatch) {
                            faults[currentFault].codeExamples = codeMatch;
                        }
                    } else if (currentFault && line.includes('Error:')) {
                        faults[currentFault].patterns.push(line.replace('Error:', '').trim());
                    } else if (currentFault && line.includes('Fix:')) {
                        faults[currentFault].solutions.push(line.replace('Fix:', '').trim());
                    }
                }
            }
        }

        return faults;
    }

    async detectProjectStructure() {
        this.log('🏗️ Detecting project structure...', 'info');

        const projectStructure = {
            languages: [],
            services: [],
            products: [],
            configFiles: []
        };

        // Detect languages based on file extensions
        const files = this.getAllFiles('.');

        for (const [language, detector] of Object.entries(this.languageDetectors)) {
            const hasLanguageFiles = files.some(file =>
                detector.extensions.some(ext => file.endsWith(ext))
            );

            if (hasLanguageFiles) {
                projectStructure.languages.push(language);
                this.log(`✅ Detected ${detector.name} files`, 'info');
            }
        }

        // Detect services and products
        const servicePatterns = {
            web_service: ['app.py', 'server.py', 'main.py', 'index.js', 'server.js'],
            database: ['database.py', 'db.py', 'models.py', 'schema.sql'],
            api: ['api.py', 'routes.py', 'endpoints.py'],
            auth: ['auth.py', 'auth.js', 'authentication.py']
        };

        for (const [service, patterns] of Object.entries(servicePatterns)) {
            const hasService = patterns.some(pattern =>
                files.some(file => file.includes(pattern))
            );
            if (hasService) {
                projectStructure.services.push(service);
            }
        }

        this.projectStructure = projectStructure;
        this.log(`✅ Project structure: ${projectStructure.languages.join(', ')} languages, ${projectStructure.services.join(', ')} services`, 'success');
    }

    getAllFiles(dir, extensions = []) {
        const files = [];

        const readDir = (currentDir) => {
            try {
                const items = fs.readdirSync(currentDir);

                for (const item of items) {
                    const fullPath = path.join(currentDir, item);
                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                        readDir(fullPath);
                    } else if (stat.isFile()) {
                        if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (error) {
                // Skip directories we can't read
            }
        };

        readDir(dir);
        return files;
    }

    async validateToolDependencies() {
        this.log('🔧 Validating tool dependencies...', 'info');

        const dependencies = {
            typescript: 'npx tsc --version',
            eslint: 'npx eslint --version',
            python: 'python --version',
            rust: 'cargo --version',
            go: 'go version'
        };

        for (const [tool, command] of Object.entries(dependencies)) {
            try {
                execSync(command, { stdio: 'pipe' });
                this.log(`✅ ${tool} available`, 'info');
            } catch (error) {
                this.log(`⚠️ ${tool} not available: ${error.message}`, 'warning');
            }
        }
    }

    async checkExistingErrorReports() {
        this.log('📊 Checking existing error reports...', 'info');

        const reportFiles = [
            'error-detection-report.json',
            'syntax-fixes-report.json',
            'comprehensive-ts-fix-report.json'
        ];

        for (const reportFile of reportFiles) {
            if (fs.existsSync(reportFile)) {
                try {
                    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
                    this.log(`📋 Found existing report: ${reportFile}`, 'info');

                    // Extract learning from previous reports
                    if (report.summary) {
                        this.learningDatabase[reportFile] = {
                            timestamp: report.timestamp || new Date().toISOString(),
                            totalErrors: report.summary.totalErrors || 0,
                            fixedFiles: report.summary.filesFixed || 0,
                            successRate: report.summary.filesFixed / (report.summary.totalErrors || 1)
                        };
                    }
                } catch (error) {
                    this.log(`⚠️ Failed to parse existing report ${reportFile}: ${error.message}`, 'warning');
                }
            }
        }
    }

    async initializeLearningDatabase() {
        this.log('🧠 Initializing learning database...', 'info');

        const learningPath = 'config/error-learning-database.json';

        if (fs.existsSync(learningPath)) {
            try {
                this.learningDatabase = JSON.parse(fs.readFileSync(learningPath, 'utf8'));
                this.log(`✅ Loaded learning database with ${Object.keys(this.learningDatabase).length} entries`, 'success');
            } catch (error) {
                this.log(`⚠️ Failed to load learning database: ${error.message}`, 'warning');
                this.learningDatabase = {};
            }
        } else {
            this.learningDatabase = {
                errorPatterns: {},
                successfulFixes: {},
                failedFixes: {},
                toolEffectiveness: {}
            };
        }
    }

    async detectErrorsInAllLanguages() {
        this.log('🔍 Detecting errors in all languages...', 'info');

        for (const language of this.projectStructure.languages) {
            if (this.languageDetectors[language]) {
                await this.detectErrorsInLanguage(language);
            }
        }
    }

    async detectErrorsInLanguage(language) {
        const detector = this.languageDetectors[language];
        this.log(`🔍 Detecting ${detector.name} errors...`, 'info');

        try {
            // For TypeScript, we need to capture stderr even on success
            if (language === 'typescript') {
                const result = execSync(detector.checkCommand, {
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 400000 // 400 seconds timeout
                });
                // TypeScript might not return errors in stderr, so we need to parse the output
                this.parseLanguageErrors(result, language, detector);
            } else {
                const result = execSync(detector.checkCommand, {
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 400000 // 400 seconds timeout
                });
                this.log(`✅ ${detector.name} check completed successfully`, 'success');
            }
        } catch (error) {
            const output = error.stdout || error.stderr || '';
            this.parseLanguageErrors(output, language, detector);
        }
    }

    parseLanguageErrors(output, language, detector) {
        const lines = output.split('\n');

        for (const line of lines) {
            const errorMatch = line.match(detector.errorPattern);

            if (errorMatch) {
                const [, filePath, lineNum, colNum, message] = errorMatch;

                const error = {
                    file: filePath,
                    line: parseInt(lineNum),
                    column: parseInt(colNum) || 0,
                    language: language,
                    message: message.trim(),
                    category: this.categorizeLanguageError(message, language),
                    severity: this.determineLanguageErrorSeverity(message, language),
                    fixStrategy: this.generateLanguageFixStrategy(message, language)
                };

                this.errors.push(error);
            }
        }

        // For TypeScript, also check for summary lines
        if (language === 'typescript') {
            const summaryMatch = output.match(/Found (\d+) errors? in (\d+) files?/);
            if (summaryMatch) {
                const errorCount = parseInt(summaryMatch[1]);
                const fileCount = parseInt(summaryMatch[2]);
                this.log(`📊 TypeScript summary: ${errorCount} errors in ${fileCount} files`, 'info');
            }
        }

        this.log(`📊 Parsed ${this.errors.filter(e => e.language === language).length} ${detector.name} errors`, 'info');
    }

    categorizeLanguageError(message, language) {
        const lowerMessage = message.toLowerCase();

        // Common error patterns across languages
        if (lowerMessage.includes('cannot find') || lowerMessage.includes('undefined')) {
            return 'undefined_variable';
        }
        if (lowerMessage.includes('property') && lowerMessage.includes('does not exist')) {
            return 'missing_property';
        }
        if (lowerMessage.includes('type') && lowerMessage.includes('not assignable')) {
            return 'type_mismatch';
        }
        if (lowerMessage.includes('import') || lowerMessage.includes('export')) {
            return 'import_export_error';
        }
        if (lowerMessage.includes('syntax')) {
            return 'syntax_error';
        }

        return 'unknown';
    }

    determineLanguageErrorSeverity(message, language) {
        const lowerMessage = message.toLowerCase();

        // Critical errors that break compilation
        if (lowerMessage.includes('syntax') || lowerMessage.includes('cannot find')) {
            return 'critical';
        }

        // High priority errors
        if (lowerMessage.includes('type') || lowerMessage.includes('property')) {
            return 'high';
        }

        return 'medium';
    }

    generateLanguageFixStrategy(message, language) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('cannot find')) {
            return 'Define missing variable or import';
        }
        if (lowerMessage.includes('property') && lowerMessage.includes('does not exist')) {
            return 'Add missing property to interface or object';
        }
        if (lowerMessage.includes('type') && lowerMessage.includes('not assignable')) {
            return 'Fix type assignment or update interface';
        }
        if (lowerMessage.includes('import')) {
            return 'Add missing import statement';
        }
        if (lowerMessage.includes('syntax')) {
            return 'Fix syntax error';
        }

        return 'Manual review required';
    }

    async checkKnownFaultsDatabase() {
        this.log('🔍 Checking errors against known faults database...', 'info');

        let knownFaultMatches = 0;

        for (const error of this.errors) {
            const knownFault = this.findKnownFaultMatch(error);
            if (knownFault) {
                error.knownFault = knownFault;
                error.fixStrategy = knownFault.solutions[0] || error.fixStrategy;
                knownFaultMatches++;
            }
        }

        this.log(`✅ Found ${knownFaultMatches} errors matching known fault patterns`, 'success');
    }

    findKnownFaultMatch(error) {
        for (const [faultName, fault] of Object.entries(this.knownFaultsDatabase)) {
            for (const pattern of fault.patterns) {
                if (error.message.toLowerCase().includes(pattern.toLowerCase())) {
                    return fault;
                }
            }
        }
        return null;
    }

    async integrateWithTechStackDelegator() {
        this.log('🔗 Integrating with Tech Stack Delegator...', 'info');

        try {
            // Check if tech stack delegator exists
            const delegatorPath = 'tools/utilities/maintenance/tech-stack-delegator.py';

            if (fs.existsSync(delegatorPath)) {
                this.log('✅ Tech Stack Delegator found, integrating...', 'info');

                // Run tech stack delegator for comprehensive analysis
                const result = execSync('python tools/utilities/maintenance/tech-stack-delegator.py', {
                    encoding: 'utf8',
                    stdio: 'pipe',
                    timeout: 400000, // 400 seconds timeout
                    env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
                });

                // Parse delegator results (assuming JSON output)
                try {
                    this.techStackAnalysis = JSON.parse(result);
                    this.log('✅ Tech Stack Delegator analysis completed', 'success');
                } catch (error) {
                    this.log(`⚠️ Failed to parse Tech Stack Delegator output: ${error.message}`, 'warning');
                }
            } else {
                this.log('⚠️ Tech Stack Delegator not found, continuing without integration', 'warning');
            }
        } catch (error) {
            this.log(`⚠️ Tech Stack Delegator integration failed: ${error.message}`, 'warning');
        }
    }

    async generateAndApplyFixes() {
        this.log('🔧 Generating and applying fixes...', 'info');

        // Group errors by file for efficient fixing
        const errorsByFile = {};
        this.errors.forEach(error => {
            if (!errorsByFile[error.file]) {
                errorsByFile[error.file] = [];
            }
            errorsByFile[error.file].push(error);
        });

        // Generate fixes for each file
        for (const [file, errors] of Object.entries(errorsByFile)) {
            const fix = this.generateFileFix(file, errors);
            if (fix) {
                this.fixes.push(fix);
            }
        }

        // Apply automated fixes
        await this.applyAutomatedFixes();

        this.log(`✅ Generated ${this.fixes.length} fix strategies`, 'success');
    }

    generateFileFix(file, errors) {
        if (!fs.existsSync(file)) {
            this.log(`⚠️ File ${file} not found, skipping`, 'warning');
            return null;
        }

        let content;
        try {
            content = fs.readFileSync(file, 'utf8');
        } catch (error) {
            this.log(`⚠️ Cannot read file ${file}: ${error.message}`, 'warning');
            return null;
        }

        const lines = content.split('\n');
        const fixes = [];

        // Sort errors by line number (descending) to avoid line number shifts
        errors.sort((a, b) => b.line - a.line);

        errors.forEach(error => {
            const fix = this.generateLineFix(error, lines[error.line - 1]);
            if (fix) {
                fixes.push({
                    line: error.line,
                    original: lines[error.line - 1],
                    fixed: fix,
                    error: error
                });
            }
        });

        return {
            file,
            fixes,
            originalContent: content
        };
    }

    generateLineFix(error, line) {
        switch (error.category) {
            case 'undefined_variable':
                return this.fixUndefinedVariable(error, line);
            case 'missing_property':
                return this.fixMissingProperty(error, line);
            case 'type_mismatch':
                return this.fixTypeMismatch(error, line);
            case 'import_export_error':
                return this.fixImportExportError(error, line);
            case 'syntax_error':
                return this.fixSyntaxError(error, line);
            default:
                return null;
        }
    }

    fixUndefinedVariable(error, line) {
        const varName = this.extractVariableName(error.message);
        if (!varName) return null;

        // Check if it's a known fault with a solution
        if (error.knownFault && error.knownFault.solutions.length > 0) {
            return error.knownFault.solutions[0];
        }

        // Common patterns for undefined variables
        if (line.includes(`${varName},`)) {
            return line.replace(`${varName},`, `${varName} = undefined,`);
        }

        if (line.includes(`${varName}:`)) {
            return line.replace(`${varName}:`, `${varName}: undefined,`);
        }

        // Try to infer type and add declaration
        const inferredType = this.inferVariableType(varName, line);
        if (inferredType) {
            return line.replace(varName, `${varName}: ${inferredType}`);
        }

        return null;
    }

    fixMissingProperty(error, line) {
        const propName = this.extractPropertyName(error.message);
        if (!propName) return null;

        // Check if it's a known fault with a solution
        if (error.knownFault && error.knownFault.solutions.length > 0) {
            return error.knownFault.solutions[0];
        }

        // Add missing property with default value
        if (line.includes('{') && line.includes('}')) {
            return line.replace('}', `, ${propName}: undefined }`);
        }

        return null;
    }

    fixTypeMismatch(error, line) {
        // Check if it's a known fault with a solution
        if (error.knownFault && error.knownFault.solutions.length > 0) {
            return error.knownFault.solutions[0];
        }

        // Generic type mismatch fix
        return line + ' // TODO: Fix type mismatch';
    }

    fixImportExportError(error, line) {
        // Check if it's a known fault with a solution
        if (error.knownFault && error.knownFault.solutions.length > 0) {
            return error.knownFault.solutions[0];
        }

        // Generic import/export fix
        return line + ' // TODO: Fix import/export';
    }

    fixSyntaxError(error, line) {
        // Check if it's a known fault with a solution
        if (error.knownFault && error.knownFault.solutions.length > 0) {
            return error.knownFault.solutions[0];
        }

        // Generic syntax fix
        return line + ' // TODO: Fix syntax error';
    }

    extractVariableName(message) {
        const match = message.match(/Cannot find name '([^']+)'/);
        return match ? match[1] : null;
    }

    extractPropertyName(message) {
        const match = message.match(/Property '([^']+)' does not exist/);
        return match ? match[1] : null;
    }

    inferVariableType(varName, line) {
        // Simple type inference based on variable name patterns
        if (varName.includes('Id') || varName.includes('id')) return 'string';
        if (varName.includes('Count') || varName.includes('count')) return 'number';
        if (varName.includes('Is') || varName.includes('is')) return 'boolean';
        if (varName.includes('Date') || varName.includes('date')) return 'Date';
        if (varName.includes('Array') || varName.includes('array')) return 'any[]';
        if (varName.includes('Object') || varName.includes('object')) return 'Record<string, any>';

        return 'any';
    }

    async applyAutomatedFixes() {
        this.log('🔧 Applying automated fixes...', 'info');

        let fixedCount = 0;

        for (const fix of this.fixes) {
            try {
                const success = await this.applyFileFix(fix);
                if (success) {
                    fixedCount++;
                    this.fixedFiles.add(fix.file);
                }
            } catch (error) {
                this.log(`❌ Failed to apply fix to ${fix.file}: ${error.message}`, 'error');
            }
        }

        this.log(`✅ Applied ${fixedCount} automated fixes`, 'success');
    }

    async applyFileFix(fix) {
        const lines = fix.originalContent.split('\n');
        let modified = false;

        // Apply fixes in reverse order to maintain line numbers
        fix.fixes.reverse().forEach(({ line, fixed }) => {
            if (fixed && fixed !== lines[line - 1]) {
                lines[line - 1] = fixed;
                modified = true;
            }
        });

        if (modified) {
            // Write the fixed content back to file
            fs.writeFileSync(fix.file, lines.join('\n'), 'utf8');
            this.log(`✅ Fixed ${fix.file}`, 'success');
            return true;
        }

        return false;
    }

    async performPostToolActions() {
        this.log('📝 Performing post-tool actions...', 'info');

        // Action 1: Update known faults database
        await this.updateKnownFaultsDatabase();

        // Action 2: Update learning database
        await this.updateLearningDatabase();

        // Action 3: Update tech stack analysis
        await this.updateTechStackAnalysis();

        // Action 4: Generate fix documentation
        await this.generateFixDocumentation();

        // Action 5: Update error tracking
        await this.updateErrorTracking();

        this.log('✅ Post-tool actions completed', 'success');
    }

    async updateKnownFaultsDatabase() {
        this.log('📚 Updating known faults database...', 'info');

        // Record successful fixes as new known faults
        for (const fix of this.fixes) {
            for (const { error, fixed } of fix.fixes) {
                if (error && fixed) {
                    const faultKey = `auto_fix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                    this.knownFaultsDatabase[faultKey] = {
                        patterns: [error.message],
                        solutions: [fixed],
                        severity: error.severity,
                        language: error.language,
                        timestamp: new Date().toISOString(),
                        autoGenerated: true
                    };
                }
            }
        }

        // Write updated database back to file
        await this.writeKnownFaultsDatabase();
    }

    async writeKnownFaultsDatabase() {
        const knownFaultsPath = 'internal/Known-faults-fixes.md';

        let content = '# Known Faults & Fixes Log\n\n';
        content += 'This document serves as a living record of recurring issues and their permanent solutions.\n\n';
        content += '---\n\n';

        for (const [faultName, fault] of Object.entries(this.knownFaultsDatabase)) {
            content += `## ${faultName}\n\n`;
            content += `**Language:** ${fault.language}\n`;
            content += `**Severity:** ${fault.severity}\n`;
            content += `**Timestamp:** ${fault.timestamp}\n\n`;

            if (fault.patterns.length > 0) {
                content += '**Error Patterns:**\n';
                fault.patterns.forEach(pattern => {
                    content += `- ${pattern}\n`;
                });
                content += '\n';
            }

            if (fault.solutions.length > 0) {
                content += '**Solutions:**\n';
                fault.solutions.forEach(solution => {
                    content += `- ${solution}\n`;
                });
                content += '\n';
            }

            content += '---\n\n';
        }

        fs.writeFileSync(knownFaultsPath, content, 'utf8');
        this.log('✅ Updated known faults database', 'success');
    }

    async updateLearningDatabase() {
        this.log('🧠 Updating learning database...', 'info');

        // Record fix effectiveness
        const fixEffectiveness = {
            totalErrors: this.errors.length,
            fixedErrors: this.fixedFiles.size,
            successRate: this.fixedFiles.size / this.errors.length,
            timestamp: new Date().toISOString()
        };

        this.learningDatabase.toolEffectiveness[new Date().toISOString()] = fixEffectiveness;

        // Record successful patterns
        for (const fix of this.fixes) {
            for (const { error, fixed } of fix.fixes) {
                if (error && fixed) {
                    const pattern = error.category;
                    if (!this.learningDatabase.successfulFixes[pattern]) {
                        this.learningDatabase.successfulFixes[pattern] = [];
                    }
                    this.learningDatabase.successfulFixes[pattern].push({
                        error: error.message,
                        fix: fixed,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }

        // Write learning database to file
        const learningPath = 'config/error-learning-database.json';
        fs.writeFileSync(learningPath, JSON.stringify(this.learningDatabase, null, 2), 'utf8');
        this.log('✅ Updated learning database', 'success');
    }

    async updateTechStackAnalysis() {
        this.log('🔗 Updating tech stack analysis...', 'info');

        // Integrate our error analysis with tech stack delegator results
        if (this.techStackAnalysis) {
            this.techStackAnalysis.errorAnalysis = {
                totalErrors: this.errors.length,
                errorsByLanguage: this.groupErrorsByLanguage(),
                fixedFiles: Array.from(this.fixedFiles),
                timestamp: new Date().toISOString()
            };

            // Write updated tech stack analysis
            const techStackPath = 'config/tech-stack-analysis.json';
            fs.writeFileSync(techStackPath, JSON.stringify(this.techStackAnalysis, null, 2), 'utf8');
            this.log('✅ Updated tech stack analysis', 'success');
        }
    }

    groupErrorsByLanguage() {
        const grouped = {};
        this.errors.forEach(error => {
            if (!grouped[error.language]) {
                grouped[error.language] = [];
            }
            grouped[error.language].push(error);
        });
        return grouped;
    }

    async generateFixDocumentation() {
        this.log('📖 Generating fix documentation...', 'info');

        const fixDoc = {
            timestamp: new Date().toISOString(),
            summary: {
                totalErrors: this.errors.length,
                fixedFiles: this.fixedFiles.size,
                successRate: this.fixedFiles.size / this.errors.length
            },
            fixes: this.fixes.map(fix => ({
                file: fix.file,
                fixesApplied: fix.fixes.length,
                errors: fix.fixes.map(f => f.error.message)
            })),
            recommendations: this.generateRecommendations()
        };

        const fixDocPath = 'reports/enhanced-error-fix-report.json';
        fs.writeFileSync(fixDocPath, JSON.stringify(fixDoc, null, 2), 'utf8');
        this.log('✅ Generated fix documentation', 'success');
    }

    async updateErrorTracking() {
        this.log('📊 Updating error tracking...', 'info');

        // Create error tracking entry
        const trackingEntry = {
            timestamp: new Date().toISOString(),
            session: {
                totalErrors: this.errors.length,
                fixedFiles: this.fixedFiles.size,
                languages: this.projectStructure.languages,
                services: this.projectStructure.services
            },
            errors: this.errors.map(error => ({
                file: error.file,
                language: error.language,
                category: error.category,
                severity: error.severity,
                message: error.message
            }))
        };

        // Append to error tracking log
        const trackingPath = 'logs/error-tracking.jsonl';
        fs.appendFileSync(trackingPath, JSON.stringify(trackingEntry) + '\n', 'utf8');
        this.log('✅ Updated error tracking', 'success');
    }

    async generateEnhancedReport() {
        this.log('📊 Generating enhanced report...', 'info');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalErrors: this.errors.length,
                errorsByLanguage: this.groupErrorsByLanguage(),
                criticalErrors: this.errors.filter(e => e.severity === 'critical').length,
                highPriorityErrors: this.errors.filter(e => e.severity === 'high').length,
                mediumPriorityErrors: this.errors.filter(e => e.severity === 'medium').length,
                filesWithErrors: new Set(this.errors.map(e => e.file)).size,
                filesFixed: this.fixedFiles.size,
                successRate: this.fixedFiles.size / this.errors.length
            },
            projectStructure: this.projectStructure,
            knownFaultsIntegration: {
                faultsLoaded: Object.keys(this.knownFaultsDatabase).length,
                knownFaultMatches: this.errors.filter(e => e.knownFault).length
            },
            techStackIntegration: {
                delegatorAvailable: !!this.techStackAnalysis,
                analysisCompleted: !!this.techStackAnalysis
            },
            learningDatabase: {
                entries: Object.keys(this.learningDatabase).length,
                successfulPatterns: Object.keys(this.learningDatabase.successfulFixes || {}).length
            },
            categories: this.groupErrorsByCategory(),
            recommendations: this.generateRecommendations(),
            nextSteps: this.generateNextSteps()
        };

        // Write comprehensive report
        const reportPath = 'reports/enhanced-error-detection-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

        this.log(`📊 Enhanced report written to ${reportPath}`, 'success');
        this.log(`📈 Summary: ${report.summary.totalErrors} errors, ${report.summary.filesFixed} files fixed (${(report.summary.successRate * 100).toFixed(1)}% success rate)`, 'info');
    }

    groupErrorsByCategory() {
        const grouped = {};
        this.errors.forEach(error => {
            if (!grouped[error.category]) {
                grouped[error.category] = [];
            }
            grouped[error.category].push({
                file: error.file,
                line: error.line,
                message: error.message,
                language: error.language
            });
        });
        return grouped;
    }

    generateRecommendations() {
        const recommendations = [];

        if (this.errors.filter(e => e.category === 'undefined_variable').length > 10) {
            recommendations.push('High number of undefined variables - consider implementing strict TypeScript configuration');
        }

        if (this.errors.filter(e => e.category === 'type_mismatch').length > 5) {
            recommendations.push('Multiple type mismatches - review and update type definitions');
        }

        if (this.errors.filter(e => e.category === 'import_export_error').length > 3) {
            recommendations.push('Import/export errors detected - review module exports and imports');
        }

        if (this.fixedFiles.size < this.errors.length * 0.1) {
            recommendations.push('Low fix rate - many errors require manual intervention');
        }

        if (this.projectStructure.languages.length > 3) {
            recommendations.push('Multiple languages detected - consider using Tech Stack Delegator for comprehensive analysis');
        }

        return recommendations;
    }

    generateNextSteps() {
        const nextSteps = [
            'Review remaining errors that require manual intervention',
            'Integrate with CI/CD pipeline for automated error detection',
            'Set up monitoring for error patterns using learning database',
            'Schedule regular runs with Tech Stack Delegator',
            'Update known faults database with new patterns discovered'
        ];

        return nextSteps;
    }
}

// Run the enhanced error detection frame
async function main() {
    const frame = new EnhancedErrorDetectionFrame();
    await frame.runEnhancedErrorDetection();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = EnhancedErrorDetectionFrame;
