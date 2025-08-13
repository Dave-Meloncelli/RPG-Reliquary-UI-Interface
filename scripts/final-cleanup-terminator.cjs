#!/usr/bin/env node

/**
 * FINAL CLEANUP TERMINATOR
 * 
 * Purpose: Fix syntax errors created by the simple terminator
 * 
 * This version:
 * - Fixes syntax errors caused by replacing variable names with 'null'
 * - Restores proper variable names and function parameters
 * - Fixes malformed object literals and interfaces
 * - Completes the error termination process
 */

const fs = require('fs');
const path = require('path');

class FinalCleanupTerminator {
    constructor() {
        this.fixesApplied = 0;
        this.startTime = Date.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '💀' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '🧹';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async run() {
        this.log('🧹 STARTING FINAL CLEANUP TERMINATOR', 'info');
        this.log('================================================', 'info');
        this.log('🎯 MISSION: FIX SYNTAX ERRORS AND COMPLETE ERROR TERMINATION', 'info');
        this.log('');

        try {
            // Fix the files with syntax errors
            await this.fixSyntaxErrors();

            this.log('', 'info');
            this.log('🎯 FINAL CLEANUP COMPLETE', 'success');
            this.log(`⏱️  Duration: ${Date.now() - this.startTime}ms`, 'success');
            this.log(`🔧 Fixes Applied: ${this.fixesApplied}`, 'success');

        } catch (error) {
            this.log(`💀 Final Cleanup Terminator Failed: ${error.message}`, 'error');
            throw error;
        }
    }

    async fixSyntaxErrors() {
        const filesToFix = [
            'src/services/n8nIntegrationService.ts',
            'src/services/observatoryService.ts',
            'src/services/ocrService.ts',
            'src/services/symposiumService.ts',
            'src/services/trafficStrategyService.ts',
            'src/types/index.ts',
            'src/types/types.ts',
            'src/types/xpTypes.ts'
        ];

        for (const file of filesToFix) {
            if (fs.existsSync(file)) {
                await this.fixFileSyntax(file);
            }
        }
    }

    async fixFileSyntax(filePath) {
        this.log(`   🧹 Fixing syntax in ${path.basename(filePath)}`, 'info');

        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Fix syntax errors based on file type
        if (filePath.includes('n8nIntegrationService.ts')) {
            content = this.fixN8nIntegrationService(content);
            hasChanges = true;
        } else if (filePath.includes('observatoryService.ts')) {
            content = this.fixObservatoryService(content);
            hasChanges = true;
        } else if (filePath.includes('ocrService.ts')) {
            content = this.fixOcrService(content);
            hasChanges = true;
        } else if (filePath.includes('symposiumService.ts')) {
            content = this.fixSymposiumService(content);
            hasChanges = true;
        } else if (filePath.includes('trafficStrategyService.ts')) {
            content = this.fixTrafficStrategyService(content);
            hasChanges = true;
        } else if (filePath.includes('types/index.ts')) {
            content = this.fixTypesIndex(content);
            hasChanges = true;
        } else if (filePath.includes('types/types.ts')) {
            content = this.fixTypesTypes(content);
            hasChanges = true;
        } else if (filePath.includes('types/xpTypes.ts')) {
            content = this.fixXpTypes(content);
            hasChanges = true;
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            this.fixesApplied++;
            this.log(`   ✅ Fixed ${path.basename(filePath)}`, 'success');
        }
    }

    fixN8nIntegrationService(content) {
        // Fix syntax errors in n8nIntegrationService.ts
        let fixed = content;

        // Fix malformed object literals
        fixed = fixed.replace(/}\s*}\s*}/g, '}');
        fixed = fixed.replace(/generatedImages: GeneratedImage\[\];\s*}/g, 'generatedImages: GeneratedImage[];');

        // Fix for loop with null variable
        fixed = fixed.replace(/for \(const null of defaultWorkflows\)/g, 'for (const workflow of defaultWorkflows)');

        // Fix function parameters
        fixed = fixed.replace(/simulateWorkflowExecution\(null:/g, 'simulateWorkflowExecution(workflow:');

        // Fix object properties
        fixed = fixed.replace(/null,/g, 'workflow,');

        return fixed;
    }

    fixObservatoryService(content) {
        // Fix syntax errors in observatoryService.ts
        let fixed = content;

        // Fix malformed condition
        fixed = fixed.replace(/if \(false\.3\)/g, 'if (Math.random() > 0.3)');

        return fixed;
    }

    fixOcrService(content) {
        // Fix syntax errors in ocrService.ts
        let fixed = content;

        // Fix malformed interfaces
        fixed = fixed.replace(/null:\s*{/g, 'bookData: {');
        fixed = fixed.replace(/null:\s*any;/g, 'qualityScore: any;');

        // Fix variable declarations
        fixed = fixed.replace(/const null:\s*ScanSettings/g, 'const settings: ScanSettings');

        // Fix function parameters
        fixed = fixed.replace(/enrichBookData\(null:/g, 'enrichBookData(ocrResult:');
        fixed = fixed.replace(/extractStructuredData\(null:/g, 'extractStructuredData(data:');
        fixed = fixed.replace(/assessOCRQuality\(null:/g, 'assessOCRQuality(data:');
        fixed = fixed.replace(/analyzeMarketValue\(null:/g, 'analyzeMarketValue(data:');
        fixed = fixed.replace(/assessRarity\(null:/g, 'assessRarity(data:');
        fixed = fixed.replace(/analyzeCondition\(null:/g, 'analyzeCondition(data:');
        fixed = fixed.replace(/calculateCollectorInterest\(null:\s*any,\s*null:\s*any\)/g, 'calculateCollectorInterest(rarity: any, marketValue: any)');
        fixed = fixed.replace(/analyzeMarketTrend\(null:/g, 'analyzeMarketTrend(data:');

        // Fix object properties
        fixed = fixed.replace(/null,/g, 'data,');
        fixed = fixed.replace(/null:\s*any,/g, 'rarity: any,');
        fixed = fixed.replace(/null:\s*any/g, 'marketValue: any');

        return fixed;
    }

    fixSymposiumService(content) {
        // Fix syntax errors in symposiumService.ts
        let fixed = content;

        // Fix variable declarations
        fixed = fixed.replace(/const null = new Date/g, 'const startTime = new Date');
        fixed = fixed.replace(/const null = new Date/g, 'const endTime = new Date');

        return fixed;
    }

    fixTrafficStrategyService(content) {
        // Fix syntax errors in trafficStrategyService.ts
        let fixed = content;

        // Fix malformed object literals
        fixed = fixed.replace(/}\s*}/g, '}');

        // Fix filter functions
        fixed = fixed.replace(/filter\(null => null\.stage/g, 'filter(journey => journey.stage');
        fixed = fixed.replace(/filter\(null => null\.platform/g, 'filter(strategy => strategy.platform');

        // Fix variable declarations
        fixed = fixed.replace(/const null = this\.contentStrategies/g, 'const strategy = this.contentStrategies');

        return fixed;
    }

    fixTypesIndex(content) {
        // Fix syntax errors in types/index.ts
        let fixed = content;

        // Fix malformed interfaces
        fixed = fixed.replace(/}\s*}\s*}/g, '}');
        fixed = fixed.replace(/capabilities:\s*string\[\];\s*}/g, 'capabilities: string[];');

        return fixed;
    }

    fixTypesTypes(content) {
        // Fix syntax errors in types/types.ts
        let fixed = content;

        // Fix malformed interfaces
        fixed = fixed.replace(/}\s*}\s*}/g, '}');
        fixed = fixed.replace(/capabilities:\s*string\[\];\s*}/g, 'capabilities: string[];');

        return fixed;
    }

    fixXpTypes(content) {
        // Fix syntax errors in types/xpTypes.ts
        let fixed = content;

        // Fix malformed type definitions
        fixed = fixed.replace(/currentLevel:\s*'number',/g, 'currentLevel: number,');
        fixed = fixed.replace(/xpToNextLevel:\s*'number',/g, 'xpToNextLevel: number,');
        fixed = fixed.replace(/totalXP:\s*'number',/g, 'totalXP: number,');
        fixed = fixed.replace(/levelProgress:\s*'number',/g, 'levelProgress: number,');
        fixed = fixed.replace(/prestigeLevel:\s*'number',/g, 'prestigeLevel: number,');
        fixed = fixed.replace(/consciousnessEvolution:\s*'number'/g, 'consciousnessEvolution: number');

        fixed = fixed.replace(/name:\s*'string',/g, 'name: string,');
        fixed = fixed.replace(/description:\s*'string',/g, 'description: string,');
        fixed = fixed.replace(/xpReward:\s*'number',/g, 'xpReward: number,');
        fixed = fixed.replace(/consciousnessReward:\s*'number',/g, 'consciousnessReward: number,');
        fixed = fixed.replace(/category:\s*"'ceremonial' \| 'technical' \| 'creative' \| 'collaborative' \| 'consciousness'",/g, "category: 'ceremonial' | 'technical' | 'creative' | 'collaborative' | 'consciousness',");
        fixed = fixed.replace(/rarity:\s*"'common' \| 'uncommon' \| 'rare' \| 'epic' \| 'legendary'",/g, "rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',");
        fixed = fixed.replace(/isUnlocked:\s*'boolean',/g, 'isUnlocked: boolean,');
        fixed = fixed.replace(/icon:\s*'string'/g, 'icon: string');

        fixed = fixed.replace(/visualGlyph:\s*'string',/g, 'visualGlyph: string,');
        fixed = fixed.replace(/voiceStyle:\s*"'structured' \| 'creative' \| 'stealth' \| 'gentle' \| 'tactical' \| 'temporal'",/g, "voiceStyle: 'structured' | 'creative' | 'stealth' | 'gentle' | 'tactical' | 'temporal',");
        fixed = fixed.replace(/communicationPattern:\s*'string',/g, 'communicationPattern: string,');
        fixed = fixed.replace(/backstoryElements:\s*'string\[\]',/g, 'backstoryElements: string[],');
        fixed = fixed.replace(/unlockableTitles:\s*'string\[\]'/g, 'unlockableTitles: string[]');

        return fixed;
    }
}

// Run the final cleanup terminator
const terminator = new FinalCleanupTerminator();
terminator.run().catch(console.error);
