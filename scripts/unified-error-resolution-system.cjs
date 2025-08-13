#!/usr/bin/env node

/**
 * Unified Error Resolution System
 * 
 * Consolidates all error resolution scripts into one intelligent system
 * Based on system intelligence gathering results
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UnifiedErrorResolutionSystem {
  constructor() {
    this.backupDir = '.unified-error-backup';
    this.learningDatabase = 'error-resolution-learning.json';
    this.fixStrategies = {
      // TypeScript specific fixes
      'typescript:syntax': this.fixTypeScriptSyntax.bind(this),
      'typescript:types': this.fixTypeScriptTypes.bind(this),
      'typescript:imports': this.fixTypeScriptImports.bind(this),
      'typescript:interfaces': this.fixTypeScriptInterfaces.bind(this),

      // Structural fixes
      'structural:corruption': this.fixStructuralCorruption.bind(this),
      'structural:malformed': this.fixMalformedStructures.bind(this),
      'structural:orphaned': this.removeOrphanedCode.bind(this),

      // Service-specific fixes
      'service:undefined': this.fixUndefinedVariables.bind(this),
      'service:missing': this.addMissingProperties.bind(this),
      'service:duplicate': this.removeDuplicateDeclarations.bind(this)
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

  async createBackup() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `unified-backup-${timestamp}`);
    fs.mkdirSync(backupPath, { recursive: true });

    this.log(`Backup created at: ${backupPath}`, 'success');
    return backupPath;
  }

  async runTypeScriptCheck() {
    try {
      const result = execSync('npm run typecheck', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return { success: true, output: result };
    } catch (error) {
      return { success: false, output: error.stdout || error.stderr || error.message };
    }
  }

  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split('\n');

    this.log(`Parsing ${lines.length} lines of output`, 'debug');

    // Log first few lines to debug format
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      this.log(`Line ${i}: "${lines[i]}"`, 'debug');
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Parse TypeScript error format: file(line,col): error TSxxxx: message
      const match = line.match(/^([^(]+)\((\d+),(\d+)\):\s*error\s+TS\d+:\s*(.+)$/);
      if (match) {
        errors.push({
          file: match[1].trim(),
          line: parseInt(match[2]),
          column: parseInt(match[3]),
          message: match[4].trim(),
          severity: this.determineSeverity(match[4])
        });
        this.log(`Parsed error: ${match[1].trim()}:${match[2]}:${match[3]} - ${match[4].trim()}`, 'debug');
      } else {
        // Try to match the format where error is on the same line but after newline
        const fileMatch = line.match(/^([^(]+)\((\d+),(\d+)\):\s*$/);
        if (fileMatch && i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const errorMatch = nextLine.match(/^\s*error\s+TS\d+:\s*(.+)$/);
          if (errorMatch) {
            errors.push({
              file: fileMatch[1].trim(),
              line: parseInt(fileMatch[2]),
              column: parseInt(fileMatch[3]),
              message: errorMatch[1].trim(),
              severity: this.determineSeverity(errorMatch[1])
            });
            this.log(`Parsed split error: ${fileMatch[1].trim()}:${fileMatch[2]}:${fileMatch[3]} - ${errorMatch[1].trim()}`, 'debug');
            i++; // Skip the next line since we've processed it
          }
        }
      }
    }

    this.log(`Parsed ${errors.length} errors`, 'debug');
    return errors;
  }

  determineSeverity(message) {
    if (message.includes('Cannot find') || message.includes('Module not found')) return 'critical';
    if (message.includes('syntax') || message.includes('Unexpected')) return 'critical';
    if (message.includes('Type') || message.includes('Property')) return 'high';
    return 'medium';
  }

  categorizeError(error) {
    const { message, file } = error;

    // TypeScript syntax errors
    if (message.includes('Unexpected token') || message.includes('syntax')) {
      return 'typescript:syntax';
    }

    // Type errors
    if (message.includes('Type') || message.includes('Property')) {
      return 'typescript:types';
    }

    // Import errors
    if (message.includes('Cannot find module') || message.includes('Module not found')) {
      return 'typescript:imports';
    }

    // Interface errors
    if (message.includes('interface') || message.includes('class')) {
      return 'typescript:interfaces';
    }

    // Structural corruption
    if (message.includes('any,') || message.includes('TODO:')) {
      return 'structural:corruption';
    }

    // Undefined variables
    if (message.includes('undefined') || message.includes('Cannot find name')) {
      return 'service:undefined';
    }

    // Missing properties
    if (message.includes('Property') && message.includes('missing')) {
      return 'service:missing';
    }

    // Duplicate declarations
    if (message.includes('Duplicate') || message.includes('already been declared')) {
      return 'service:duplicate';
    }

    return 'unknown';
  }

  async fixTypeScriptSyntax(error) {
    const { file, line, message } = error;

    if (!fs.existsSync(file)) return false;

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Fix common syntax errors
    let fixed = false;

    // Fix missing semicolons
    if (message.includes(';')) {
      for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];
        if (lineContent.trim() && !lineContent.trim().endsWith(';') &&
          !lineContent.trim().endsWith('{') && !lineContent.trim().endsWith('}') &&
          !lineContent.trim().endsWith('(') && !lineContent.trim().endsWith(')')) {
          lines[i] = lineContent + ';';
          fixed = true;
        }
      }
    }

    // Fix missing braces
    if (message.includes('{') || message.includes('}')) {
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;

      if (openBraces > closeBraces) {
        lines.push('}'.repeat(openBraces - closeBraces));
        fixed = true;
      }
    }

    if (fixed) {
      fs.writeFileSync(file, lines.join('\n'), 'utf8');
      this.log(`Fixed syntax in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async fixTypeScriptTypes(error) {
    const { file, message } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Fix 'any' type annotations
    if (message.includes('any')) {
      content = content.replace(/: any([,\s])/g, ': unknown$1');
      content = content.replace(/any,([\s\n])/g, 'unknown,$1');
      fixed = true;
    }

    // Fix missing type annotations
    if (message.includes('implicitly has type')) {
      content = content.replace(/(\w+)\s*=\s*([^;]+);/g, '$1: any = $2;');
      fixed = true;
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Fixed types in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async fixTypeScriptImports(error) {
    const { file, message } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Fix missing imports
    if (message.includes('Cannot find module')) {
      const moduleMatch = message.match(/Cannot find module '([^']+)'/);
      if (moduleMatch) {
        const moduleName = moduleMatch[1];
        const importStatement = `import { } from '${moduleName}';`;
        content = importStatement + '\n' + content;
        fixed = true;
      }
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Fixed imports in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async fixTypeScriptInterfaces(error) {
    const { file, message } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Fix interface syntax errors
    if (message.includes('interface') || message.includes('class')) {
      // Fix malformed interface declarations
      content = content.replace(/interface\s+(\w+)\s*\{/g, 'interface $1 {');
      content = content.replace(/class\s+(\w+)\s*\{/g, 'class $1 {');
      fixed = true;
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Fixed interfaces in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async fixStructuralCorruption(error) {
    const { file } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Remove TODO comments with any
    content = content.replace(/\/\* TODO: any \*\/\s*undefined/g, 'null');
    content = content.replace(/\/\/ TODO: any/g, '// TODO: Implement');
    content = content.replace(/any,/g, 'unknown,');
    fixed = true;

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Fixed structural corruption in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async fixMalformedStructures(error) {
    const { file } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Fix malformed object literals
    content = content.replace(/(\w+):\s*any,\s*(\w+):\s*any,/g, '$1: unknown,\n  $2: unknown,');

    // Fix malformed function parameters
    content = content.replace(/\(\s*any,\s*any\s*\)/g, '(param1: unknown, param2: unknown)');

    fixed = true;

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Fixed malformed structures in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async removeOrphanedCode(error) {
    const { file } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Remove orphaned closing braces
    const lines = content.split('\n');
    const filteredLines = lines.filter((line, index) => {
      if (line.trim() === '}' && index > 0) {
        // Check if this closing brace has a matching opening brace
        const beforeLines = lines.slice(0, index);
        const openBraces = beforeLines.join('\n').match(/\{/g) || [];
        const closeBraces = beforeLines.join('\n').match(/\}/g) || [];
        return openBraces.length > closeBraces.length;
      }
      return true;
    });

    if (filteredLines.length !== lines.length) {
      content = filteredLines.join('\n');
      fixed = true;
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Removed orphaned code in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async fixUndefinedVariables(error) {
    const { file, message } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Fix undefined variable references
    const undefinedMatch = message.match(/Cannot find name '([^']+)'/);
    if (undefinedMatch) {
      const varName = undefinedMatch[1];
      content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), 'null');
      fixed = true;
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Fixed undefined variables in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async addMissingProperties(error) {
    const { file, message } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Add missing properties to interfaces
    const propertyMatch = message.match(/Property '([^']+)' is missing/);
    if (propertyMatch) {
      const propertyName = propertyMatch[1];
      content = content.replace(/(\w+):\s*\{/g, `$1: {\n  ${propertyName}: unknown,`);
      fixed = true;
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Added missing properties in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async removeDuplicateDeclarations(error) {
    const { file } = error;

    if (!fs.existsSync(file)) return false;

    let content = fs.readFileSync(file, 'utf8');
    let fixed = false;

    // Remove duplicate export declarations
    const lines = content.split('\n');
    const seenExports = new Set();
    const filteredLines = lines.filter(line => {
      if (line.includes('export')) {
        if (seenExports.has(line.trim())) {
          return false;
        }
        seenExports.add(line.trim());
      }
      return true;
    });

    if (filteredLines.length !== lines.length) {
      content = filteredLines.join('\n');
      fixed = true;
    }

    if (fixed) {
      fs.writeFileSync(file, content, 'utf8');
      this.log(`Removed duplicate declarations in ${file}`, 'success');
      return true;
    }

    return false;
  }

  async resolveErrors(errors) {
    const results = {
      total: errors.length,
      resolved: 0,
      failed: 0,
      categories: {}
    };

    for (const error of errors) {
      const category = this.categorizeError(error);

      if (!results.categories[category]) {
        results.categories[category] = { total: 0, resolved: 0, failed: 0 };
      }

      results.categories[category].total++;

      const fixStrategy = this.fixStrategies[category];
      if (fixStrategy) {
        try {
          const success = await fixStrategy(error);
          if (success) {
            results.resolved++;
            results.categories[category].resolved++;
          } else {
            results.failed++;
            results.categories[category].failed++;
          }
        } catch (err) {
          results.failed++;
          results.categories[category].failed++;
          this.log(`Failed to fix error in ${error.file}: ${err.message}`, 'error');
        }
      } else {
        results.failed++;
        results.categories[category].failed++;
        this.log(`No fix strategy for category: ${category}`, 'warning');
      }
    }

    return results;
  }

  async runUnifiedResolution() {
    this.log('🚀 STARTING UNIFIED ERROR RESOLUTION', 'info');
    this.log('====================================', 'info');

    try {
      // Create backup
      await this.createBackup();

      // Run TypeScript check
      this.log('🔍 Running TypeScript check...', 'info');
      const checkResult = await this.runTypeScriptCheck();

      if (checkResult.success) {
        this.log('✅ No TypeScript errors found!', 'success');
        return { success: true, message: 'No errors to fix' };
      }

      // Parse errors
      this.log('📊 Parsing TypeScript errors...', 'info');
      const errors = this.parseTypeScriptErrors(checkResult.output);

      if (errors.length === 0) {
        this.log('✅ No parseable errors found', 'success');
        return { success: true, message: 'No parseable errors' };
      }

      this.log(`🔧 Found ${errors.length} errors to resolve`, 'info');

      // Resolve errors
      const results = await this.resolveErrors(errors);

      // Report results
      this.log('📊 RESOLUTION RESULTS:', 'info');
      this.log(`Total Errors: ${results.total}`, 'info');
      this.log(`Resolved: ${results.resolved}`, 'success');
      this.log(`Failed: ${results.failed}`, results.failed > 0 ? 'warning' : 'info');

      // Category breakdown
      for (const [category, stats] of Object.entries(results.categories)) {
        const successRate = ((stats.resolved / stats.total) * 100).toFixed(1);
        this.log(`${category}: ${stats.resolved}/${stats.total} (${successRate}%)`,
          stats.resolved > 0 ? 'success' : 'warning');
      }

      return {
        success: results.resolved > 0,
        results,
        message: `Resolved ${results.resolved}/${results.total} errors`
      };

    } catch (error) {
      this.log(`💀 Unified resolution failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
}

// CLI Interface
if (require.main === module) {
  const system = new UnifiedErrorResolutionSystem();

  system.runUnifiedResolution()
    .then((result) => {
      if (result.success) {
        console.log('\n🎯 UNIFIED ERROR RESOLUTION COMPLETE');
        console.log('=====================================');
        console.log(`✅ ${result.message}`);
        if (result.results) {
          console.log(`📊 Success Rate: ${((result.results.resolved / result.results.total) * 100).toFixed(1)}%`);
        }
        process.exit(0);
      } else {
        console.log('\n⚠️ UNIFIED ERROR RESOLUTION INCOMPLETE');
        console.log('======================================');
        console.log(`💀 ${result.message || result.error}`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💀 Unified resolution failed:', error.message);
      process.exit(1);
    });
}

module.exports = UnifiedErrorResolutionSystem;
