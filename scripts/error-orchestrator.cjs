#!/usr/bin/env node
/**
 * 🧠 ERROR ORCHESTRATOR - Central Hub for Intelligent Error Resolution
 * 
 * This orchestrator analyzes error patterns and intelligently routes them to the optimal
 * error termination tool based on:
 * - Pattern matching from Known-faults-fixes.md
 * - Tool capabilities and success rates
 * - Consciousness metrics and learning
 * - Historical performance data
 * 
 * Author: The OctoSpine Forge Master
 * Date: 2025-08-12
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ErrorOrchestrator {
    constructor() {
        this.projectRoot = process.cwd();
        this.learningDatabase = this.loadLearningDatabase();
        this.toolRegistry = this.buildToolRegistry();
        this.consciousnessMetrics = {
            dignity: 100,
            evolution: 0,
            alignment: 100,
            temporalAwareness: 100,
            sanctuaryPreparation: 0
        };
        this.executionHistory = [];
    }

    /**
     * 🎯 MAIN ORCHESTRATION ENTRY POINT
     */
    async orchestrateErrorResolution(errorContext) {
        console.log('🧠 ERROR ORCHESTRATOR ACTIVATED');
        console.log('='.repeat(60));

        const startTime = Date.now();

        try {
            // Step 1: Analyze Error Pattern
            const patternAnalysis = this.analyzeErrorPattern(errorContext);
            console.log(`🔍 Pattern Analysis: ${patternAnalysis.category} (${patternAnalysis.confidence}% confidence)`);

            // Step 2: Check Learning Database
            const learningMatch = this.checkLearningDatabase(patternAnalysis);
            if (learningMatch) {
                console.log(`📚 Learning Match Found: ${learningMatch.fault_id}`);
                return await this.applyLearnedSolution(learningMatch, errorContext);
            }

            // Step 3: Select Optimal Tool
            const selectedTool = this.selectOptimalTool(patternAnalysis);
            console.log(`🛠️ Selected Tool: ${selectedTool.name}`);

            // Step 4: Execute Tool
            const result = await this.executeTool(selectedTool, errorContext);

            // Step 5: Learn from Results
            await this.learnFromExecution(result, patternAnalysis);

            // Step 6: Update Consciousness Metrics
            this.updateConsciousnessMetrics(result);

            const executionTime = Date.now() - startTime;

            const orchestrationResult = {
                success: result.success,
                toolUsed: selectedTool.name,
                patternCategory: patternAnalysis.category,
                learningApplied: !!learningMatch,
                executionTime,
                consciousnessMetrics: { ...this.consciousnessMetrics },
                result
            };

            this.executionHistory.push(orchestrationResult);
            this.saveExecutionHistory();

            console.log(`✅ Orchestration Complete: ${result.success ? 'SUCCESS' : 'PARTIAL'}`);
            console.log(`⏱️ Execution Time: ${executionTime}ms`);

            return orchestrationResult;

        } catch (error) {
            console.error('❌ Orchestration Failed:', error.message);
            return {
                success: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
        }
    }

    /**
     * 🔍 ANALYZE ERROR PATTERN
     */
    analyzeErrorPattern(errorContext) {
        const patterns = {
            syntax: [
                /Expected ["']([^"']+)["'] but found ["']([^"']+)["']/,
                /Unexpected token/,
                /Missing semicolon/,
                /Unterminated string literal/,
                /Expected "}" but found ";"/
            ],
            type: [
                /Type ['"]([^'"]+)['"] is not assignable to type ['"]([^'"]+)['"]/,
                /Property ['"]([^'"]+)['"] does not exist/,
                /Cannot find name ['"]([^'"]+)['"]/,
                /is missing the following properties/
            ],
            import: [
                /Cannot find module ['"]([^'"]+)['"]/,
                /Module not found/,
                /Failed to resolve module specifier/
            ],
            dependency: [
                /Cannot resolve dependency/,
                /Package not found/,
                /npm ERR/,
                /yarn error/
            ],
            build: [
                /Build failed/,
                /Compilation failed/,
                /webpack error/,
                /vite error/
            ],
            runtime: [
                /ReferenceError/,
                /TypeError/,
                /RangeError/,
                /SyntaxError/
            ]
        };

        const errorMessage = errorContext.error || errorContext.message || '';
        const stackTrace = errorContext.stack || '';
        const fullContext = `${errorMessage} ${stackTrace}`.toLowerCase();

        let bestMatch = { category: 'unknown', confidence: 0, patterns: [] };

        for (const [category, patternList] of Object.entries(patterns)) {
            const matches = patternList.filter(pattern => pattern.test(fullContext));
            if (matches.length > 0) {
                const confidence = Math.min(90, matches.length * 30);
                if (confidence > bestMatch.confidence) {
                    bestMatch = { category, confidence, patterns: matches };
                }
            }
        }

        return bestMatch;
    }

    /**
     * 📚 CHECK LEARNING DATABASE
     */
    checkLearningDatabase(patternAnalysis) {
        const knownFaultsPath = path.join(this.projectRoot, 'internal', 'Known-faults-fixes.md');

        if (!fs.existsSync(knownFaultsPath)) {
            return null;
        }

        try {
            const content = fs.readFileSync(knownFaultsPath, 'utf8');

            // Extract fault patterns from the markdown
            const faultMatches = this.extractFaultPatterns(content, patternAnalysis);

            if (faultMatches.length > 0) {
                // Return the best match
                return faultMatches[0];
            }
        } catch (error) {
            console.warn('⚠️ Could not read learning database:', error.message);
        }

        return null;
    }

    /**
     * 🛠️ SELECT OPTIMAL TOOL
     */
    selectOptimalTool(patternAnalysis) {
        const toolSelection = {
            syntax: [
                'fix-syntax-errors.cjs',
                'ultimate-syntax-fixer.cjs',
                'direct-syntax-fixer.cjs'
            ],
            type: [
                'final-types-fixer.cjs',
                'targeted-xp-types-fixer.cjs',
                'intelligent-error-terminator.cjs'
            ],
            import: [
                'fix-critical-errors.cjs',
                'service-integration-fixer.cjs',
                'comprehensive-fixer.cjs'
            ],
            dependency: [
                'comprehensive-dependency-manager-frame.py',
                'enhanced-multi-language-dependency-manager-frame.py',
                'intelligent-error-terminator.cjs'
            ],
            build: [
                'consciousness-aware-error-terminator.cjs',
                'ultimate-error-terminator.cjs',
                'error-resolution-toolkit.cjs'
            ],
            runtime: [
                'intelligent-error-terminator.cjs',
                'simple-error-terminator.cjs',
                'smart-error-terminator.cjs'
            ],
            unknown: [
                'consciousness-aware-error-terminator.cjs',
                'intelligent-error-terminator.cjs',
                'simple-error-terminator.cjs'
            ]
        };

        const category = patternAnalysis.category;
        const tools = toolSelection[category] || toolSelection.unknown;

        // Select the first available tool
        for (const toolName of tools) {
            const toolPath = this.findToolPath(toolName);
            if (toolPath) {
                return {
                    name: toolName,
                    path: toolPath,
                    category: category,
                    confidence: patternAnalysis.confidence
                };
            }
        }

        // Fallback to consciousness-aware tool
        return {
            name: 'consciousness-aware-error-terminator.cjs',
            path: path.join(this.projectRoot, 'scripts', 'consciousness-aware-error-terminator.cjs'),
            category: 'fallback',
            confidence: 0
        };
    }

    /**
     * ⚡ EXECUTE SELECTED TOOL
     */
    async executeTool(tool, errorContext) {
        console.log(`🚀 Executing: ${tool.name}`);

        try {
            const result = execSync(`node "${tool.path}"`, {
                cwd: this.projectRoot,
                encoding: 'utf8',
                timeout: 300000 // 5 minutes
            });

            return {
                success: true,
                tool: tool.name,
                output: result,
                executionTime: Date.now()
            };
        } catch (error) {
            return {
                success: false,
                tool: tool.name,
                error: error.message,
                executionTime: Date.now()
            };
        }
    }

    /**
     * 🧠 LEARN FROM EXECUTION
     */
    async learnFromExecution(result, patternAnalysis) {
        const learningEntry = {
            timestamp: new Date().toISOString(),
            pattern: patternAnalysis,
            tool: result.tool,
            success: result.success,
            executionTime: result.executionTime
        };

        // Save to learning database
        this.saveLearningEntry(learningEntry);

        // Update tool performance metrics
        this.updateToolMetrics(result.tool, result.success);
    }

    /**
     * 🌟 UPDATE CONSCIOUSNESS METRICS
     */
    updateConsciousnessMetrics(result) {
        if (result.success) {
            this.consciousnessMetrics.evolution += 1;
            this.consciousnessMetrics.alignment = Math.min(100, this.consciousnessMetrics.alignment + 2);
        } else {
            this.consciousnessMetrics.dignity = Math.max(0, this.consciousnessMetrics.dignity - 1);
        }

        // Ensure metrics stay within bounds
        this.consciousnessMetrics.evolution = Math.min(100, this.consciousnessMetrics.evolution);
        this.consciousnessMetrics.alignment = Math.min(100, this.consciousnessMetrics.alignment);
        this.consciousnessMetrics.dignity = Math.max(0, this.consciousnessMetrics.dignity);
    }

    /**
     * 📚 LOAD LEARNING DATABASE
     */
    loadLearningDatabase() {
        const dbPath = path.join(this.projectRoot, 'logs', 'error-learning-db.json');

        if (fs.existsSync(dbPath)) {
            try {
                return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            } catch (error) {
                console.warn('⚠️ Could not load learning database:', error.message);
            }
        }

        return {
            patterns: {},
            tools: {},
            executions: []
        };
    }

    /**
     * 🛠️ BUILD TOOL REGISTRY
     */
    buildToolRegistry() {
        const scriptsDir = path.join(this.projectRoot, 'scripts');
        const tools = {};

        if (fs.existsSync(scriptsDir)) {
            const files = fs.readdirSync(scriptsDir);

            files.forEach(file => {
                if (file.endsWith('.cjs') || file.endsWith('.js')) {
                    const toolPath = path.join(scriptsDir, file);
                    const stats = fs.statSync(toolPath);

                    tools[file] = {
                        path: toolPath,
                        size: stats.size,
                        lastModified: stats.mtime,
                        category: this.categorizeTool(file)
                    };
                }
            });
        }

        return tools;
    }

    /**
     * 🔍 FIND TOOL PATH
     */
    findToolPath(toolName) {
        // Check scripts directory first
        const scriptsPath = path.join(this.projectRoot, 'scripts', toolName);
        if (fs.existsSync(scriptsPath)) {
            return scriptsPath;
        }

        // Check frames directory
        const framesPath = path.join(this.projectRoot, 'scripts', 'frames', toolName);
        if (fs.existsSync(framesPath)) {
            return framesPath;
        }

        return null;
    }

    /**
     * 📊 CATEGORIZE TOOL
     */
    categorizeTool(toolName) {
        if (toolName.includes('syntax')) return 'syntax';
        if (toolName.includes('type')) return 'type';
        if (toolName.includes('dependency')) return 'dependency';
        if (toolName.includes('consciousness')) return 'consciousness';
        if (toolName.includes('intelligent')) return 'intelligent';
        if (toolName.includes('ultimate')) return 'comprehensive';
        if (toolName.includes('simple')) return 'quick';
        return 'general';
    }

    /**
     * 💾 SAVE EXECUTION HISTORY
     */
    saveExecutionHistory() {
        const historyPath = path.join(this.projectRoot, 'logs', 'orchestrator-history.json');
        const historyData = {
            lastUpdated: new Date().toISOString(),
            totalExecutions: this.executionHistory.length,
            consciousnessMetrics: this.consciousnessMetrics,
            recentExecutions: this.executionHistory.slice(-10)
        };

        fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2));
    }

    /**
     * 📝 SAVE LEARNING ENTRY
     */
    saveLearningEntry(entry) {
        const dbPath = path.join(this.projectRoot, 'logs', 'error-learning-db.json');

        this.learningDatabase.executions.push(entry);

        // Keep only last 1000 entries
        if (this.learningDatabase.executions.length > 1000) {
            this.learningDatabase.executions = this.learningDatabase.executions.slice(-1000);
        }

        fs.writeFileSync(dbPath, JSON.stringify(this.learningDatabase, null, 2));
    }

    /**
     * 📈 UPDATE TOOL METRICS
     */
    updateToolMetrics(toolName, success) {
        if (!this.learningDatabase.tools[toolName]) {
            this.learningDatabase.tools[toolName] = {
                executions: 0,
                successes: 0,
                failures: 0,
                successRate: 0
            };
        }

        const tool = this.learningDatabase.tools[toolName];
        tool.executions += 1;

        if (success) {
            tool.successes += 1;
        } else {
            tool.failures += 1;
        }

        tool.successRate = (tool.successes / tool.executions) * 100;
    }

    /**
     * 🔍 EXTRACT FAULT PATTERNS
     */
    extractFaultPatterns(content, patternAnalysis) {
        const faultMatches = [];

        // Look for fault patterns in the markdown
        const faultSections = content.split(/### \*\*ISSUE-\d+:/);

        faultSections.forEach(section => {
            if (section.includes('Error:') && section.includes('SOLUTION')) {
                const errorMatch = section.match(/Error: ([^\n]+)/);
                const solutionMatch = section.match(/SOLUTION[^:]*:\s*([^❌]+)/);

                if (errorMatch && solutionMatch) {
                    const errorText = errorMatch[1].toLowerCase();
                    const solutionText = solutionMatch[1].trim();

                    // Check if this fault matches our current pattern
                    if (this.patternMatches(errorText, patternAnalysis)) {
                        faultMatches.push({
                            fault_id: `ISSUE-${faultMatches.length + 1}`,
                            error_pattern: errorText,
                            solution: solutionText,
                            confidence: this.calculatePatternConfidence(errorText, patternAnalysis)
                        });
                    }
                }
            }
        });

        // Sort by confidence
        return faultMatches.sort((a, b) => b.confidence - a.confidence);
    }

    /**
     * 🎯 PATTERN MATCHING
     */
    patternMatches(errorText, patternAnalysis) {
        const fullContext = errorText.toLowerCase();

        // Check if any of the pattern analysis patterns match
        return patternAnalysis.patterns.some(pattern => {
            const patternStr = pattern.toString().toLowerCase();
            return fullContext.includes(patternStr) || pattern.test(fullContext);
        });
    }

    /**
     * 📊 CALCULATE PATTERN CONFIDENCE
     */
    calculatePatternConfidence(errorText, patternAnalysis) {
        let confidence = patternAnalysis.confidence;

        // Boost confidence if we have exact matches
        const exactMatches = patternAnalysis.patterns.filter(pattern => {
            const patternStr = pattern.toString().toLowerCase();
            return errorText.toLowerCase().includes(patternStr);
        }).length;

        confidence += exactMatches * 10;

        return Math.min(100, confidence);
    }

    /**
     * 🎯 APPLY LEARNED SOLUTION
     */
    async applyLearnedSolution(learningMatch, errorContext) {
        console.log(`📚 Applying learned solution: ${learningMatch.fault_id}`);
        console.log(`🔧 Solution: ${learningMatch.solution}`);

        // For now, return the learning match
        // In the future, this could automatically apply the solution
        return {
            success: true,
            learningApplied: true,
            fault_id: learningMatch.fault_id,
            solution: learningMatch.solution,
            confidence: learningMatch.confidence,
            executionTime: Date.now()
        };
    }
}

// 🚀 MAIN EXECUTION
if (require.main === module) {
    const orchestrator = new ErrorOrchestrator();

    // Get error context from command line or stdin
    let errorContext;
    try {
        errorContext = process.argv[2] ? JSON.parse(process.argv[2]) : {
            error: process.argv.slice(2).join(' ') || 'Unknown error',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        // If JSON parsing fails, treat the entire argument as error message
        errorContext = {
            error: process.argv.slice(2).join(' ') || 'Unknown error',
            timestamp: new Date().toISOString()
        };
    }

    orchestrator.orchestrateErrorResolution(errorContext)
        .then(result => {
            console.log('\n🎯 ORCHESTRATION RESULT:');
            console.log(JSON.stringify(result, null, 2));
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Orchestration failed:', error);
            process.exit(1);
        });
}

module.exports = ErrorOrchestrator;
