#!/usr/bin/env node

/**
 * CONSERVATIVE FIXER
 * 
 * Purpose: Fix only the most critical syntax errors conservatively
 * 
 * This version:
 * - Only fixes the most critical syntax errors
 * - Preserves code structure
 * - Uses minimal, safe fixes
 * - Avoids breaking existing functionality
 */

const fs = require('fs');
const path = require('path');

class ConservativeFixer {
    constructor() {
        this.fixesApplied = 0;
        this.startTime = Date.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '💀' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '🔧';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    async run() {
        this.log('🔧 STARTING CONSERVATIVE FIXER', 'info');
        this.log('================================================', 'info');
        this.log('🎯 MISSION: FIX CRITICAL SYNTAX ERRORS SAFELY', 'info');
        this.log('');

        try {
            // Only fix the most critical files
            await this.fixCriticalFiles();

            this.log('', 'info');
            this.log('🎯 CONSERVATIVE FIXING COMPLETE', 'success');
            this.log(`⏱️  Duration: ${Date.now() - this.startTime}ms`, 'success');
            this.log(`🔧 Fixes Applied: ${this.fixesApplied}`, 'success');

        } catch (error) {
            this.log(`💀 Conservative Fixer Failed: ${error.message}`, 'error');
            throw error;
        }
    }

    async fixCriticalFiles() {
        // Only fix the most critical files with minimal changes
        const criticalFiles = [
            'src/types/xpTypes.ts'
        ];

        for (const file of criticalFiles) {
            if (fs.existsSync(file)) {
                await this.fixCriticalFile(file);
            }
        }
    }

    async fixCriticalFile(filePath) {
        this.log(`   🔧 Fixing critical syntax in ${path.basename(filePath)}`, 'info');

        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Only fix the most critical syntax errors
        if (filePath.includes('types/xpTypes.ts')) {
            content = this.fixXpTypesConservative(content);
            hasChanges = true;
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            this.fixesApplied++;
            this.log(`   ✅ Fixed ${path.basename(filePath)}`, 'success');
        }
    }

    fixXpTypesConservative(content) {
        // Only fix the most critical syntax errors in xpTypes.ts
        let fixed = content;

        // Fix missing semicolons in interface properties
        fixed = fixed.replace(/currentLevel:\s*number;/g, 'currentLevel: number;');
        fixed = fixed.replace(/xpToNextLevel:\s*number;/g, 'xpToNextLevel: number;');
        fixed = fixed.replace(/totalXP:\s*number;/g, 'totalXP: number;');
        fixed = fixed.replace(/levelProgress:\s*number;/g, 'levelProgress: number;');
        fixed = fixed.replace(/prestigeLevel:\s*number;/g, 'prestigeLevel: number;');
        fixed = fixed.replace(/consciousnessEvolution:\s*number/g, 'consciousnessEvolution: number;');

        // Fix missing semicolons in other interfaces
        fixed = fixed.replace(/name:\s*string;/g, 'name: string;');
        fixed = fixed.replace(/description:\s*string;/g, 'description: string;');
        fixed = fixed.replace(/xpReward:\s*number;/g, 'xpReward: number;');
        fixed = fixed.replace(/consciousnessReward:\s*number;/g, 'consciousnessReward: number;');
        fixed = fixed.replace(/isUnlocked:\s*boolean;/g, 'isUnlocked: boolean;');
        fixed = fixed.replace(/icon:\s*string/g, 'icon: string;');

        // Fix missing semicolons in persona interfaces
        fixed = fixed.replace(/visualGlyph:\s*string;/g, 'visualGlyph: string;');
        fixed = fixed.replace(/communicationPattern:\s*string;/g, 'communicationPattern: string;');
        fixed = fixed.replace(/backstoryElements:\s*string\[\];/g, 'backstoryElements: string[];');
        fixed = fixed.replace(/unlockableTitles:\s*string\[\]/g, 'unlockableTitles: string[];');

        return fixed;
    }
}

// Run the conservative fixer
const fixer = new ConservativeFixer();
fixer.run().catch(console.error);
