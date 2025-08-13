#!/usr/bin/env node

/**
 * Error Detection and Resolution Frame
 * 
 * Comprehensive TypeScript error detection and automated fixing system
 * for the AZ Interface codebase.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ErrorDetectionFrame {
  constructor() {
    this.errors = [];
    this.fixes = [];
    this.criticalIssues = [];
    this.warnings = [];
    this.fixedFiles = new Set();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runErrorDetection() {
    this.log('🚀 Starting comprehensive error detection and resolution...', 'info');

    try {
      // 1. Run TypeScript type checking
      await this.runTypeScriptCheck();

      // 2. Categorize errors by type
      this.categorizeErrors();

      // 3. Generate fix strategies
      this.generateFixStrategies();

      // 4. Apply automated fixes
      await this.applyAutomatedFixes();

      // 5. Generate comprehensive report
      this.generateErrorReport();

    } catch (error) {
      this.log(`Error detection failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async runTypeScriptCheck() {
    this.log('Running TypeScript type checking...', 'info');

    try {
      const result = execSync('npx tsc --noEmit', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      this.log('TypeScript check completed successfully', 'success');
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      this.parseTypeScriptErrors(output);
    }
  }

  parseTypeScriptErrors(output) {
    const lines = output.split('\n');
    let currentError = null;

    for (const line of lines) {
      // Parse error lines like: "src/file.ts:10:5 - error TS2304: Cannot find name 'variable'"
      const errorMatch = line.match(/^([^:]+):(\d+):(\d+)\s*-\s*error\s+TS(\d+):\s*(.+)$/);

      if (errorMatch) {
        const [, filePath, lineNum, colNum, errorCode, message] = errorMatch;

        currentError = {
          file: filePath,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          code: errorCode,
          message: message.trim(),
          category: this.categorizeError(errorCode, message),
          severity: this.determineSeverity(errorCode),
          fixStrategy: this.generateFixStrategy(errorCode, message)
        };

        this.errors.push(currentError);
      }
    }

    this.log(`Parsed ${this.errors.length} TypeScript errors`, 'info');
  }

  categorizeError(code, message) {
    const codeNum = parseInt(code);

    // TS2304: Cannot find name
    if (codeNum === 2304) return 'undefined_variable';

    // TS2339: Property does not exist
    if (codeNum === 2339) return 'missing_property';

    // TS2739: Type missing properties
    if (codeNum === 2739) return 'interface_mismatch';

    // TS2305: Module has no exported member
    if (codeNum === 2305) return 'missing_export';

    // TS2322: Type not assignable
    if (codeNum === 2322) return 'type_mismatch';

    // TS2353: Object literal may only specify known properties
    if (codeNum === 2353) return 'unknown_property';

    // TS18004: No value exists in scope for shorthand property
    if (codeNum === 18004) return 'shorthand_property_error';

    // TS2484: Export declaration conflicts
    if (codeNum === 2484) return 'export_conflict';

    // TS2724: Has no exported member
    if (codeNum === 2724) return 'missing_export';

    return 'unknown';
  }

  determineSeverity(code) {
    const codeNum = parseInt(code);

    // Critical errors that break compilation
    if ([2304, 2305, 2339, 2739].includes(codeNum)) return 'critical';

    // High priority errors
    if ([2322, 2353, 2484, 2724].includes(codeNum)) return 'high';

    // Medium priority warnings
    if ([18004].includes(codeNum)) return 'medium';

    return 'low';
  }

  generateFixStrategy(code, message) {
    const codeNum = parseInt(code);

    switch (codeNum) {
      case 2304: // Cannot find name
        return this.extractVariableName(message) ?
          `Define variable '${this.extractVariableName(message)}'` :
          'Define missing variable';

      case 2339: // Property does not exist
        return this.extractPropertyName(message) ?
          `Add property '${this.extractPropertyName(message)}' to interface` :
          'Add missing property to interface';

      case 2739: // Type missing properties
        return 'Add missing properties to object literal';

      case 2305: // Module has no exported member
        return this.extractExportName(message) ?
          `Export '${this.extractExportName(message)}' from module` :
          'Add missing export';

      case 2322: // Type not assignable
        return 'Fix type assignment or update interface';

      case 2353: // Unknown property
        return this.extractPropertyName(message) ?
          `Remove or rename property '${this.extractPropertyName(message)}'` :
          'Remove unknown property';

      case 18004: // Shorthand property error
        return 'Define variable before using shorthand property';

      case 2484: // Export declaration conflicts
        return 'Resolve export name conflicts';

      default:
        return 'Manual review required';
    }
  }

  extractVariableName(message) {
    const match = message.match(/Cannot find name '([^']+)'/);
    return match ? match[1] : null;
  }

  extractPropertyName(message) {
    const match = message.match(/Property '([^']+)' does not exist/);
    return match ? match[1] : null;
  }

  extractExportName(message) {
    const match = message.match(/has no exported member '([^']+)'/);
    return match ? match[1] : null;
  }

  categorizeErrors() {
    const categories = {};

    this.errors.forEach(error => {
      if (!categories[error.category]) {
        categories[error.category] = [];
      }
      categories[error.category].push(error);
    });

    this.log('Error categories:', 'info');
    Object.entries(categories).forEach(([category, errors]) => {
      this.log(`  ${category}: ${errors.length} errors`, 'info');
    });
  }

  generateFixStrategies() {
    this.log('Generating fix strategies...', 'info');

    // Group errors by file for efficient fixing
    const errorsByFile = {};
    this.errors.forEach(error => {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = [];
      }
      errorsByFile[error.file].push(error);
    });

    // Generate fixes for each file
    Object.entries(errorsByFile).forEach(([file, errors]) => {
      const fix = this.generateFileFix(file, errors);
      if (fix) {
        this.fixes.push(fix);
      }
    });

    this.log(`Generated ${this.fixes.length} fix strategies`, 'info');
  }

  generateFileFix(file, errors) {
    // Read the file content
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (error) {
      this.log(`Cannot read file ${file}: ${error.message}`, 'error');
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

      case 'interface_mismatch':
        return this.fixInterfaceMismatch(error, line);

      case 'shorthand_property_error':
        return this.fixShorthandProperty(error, line);

      default:
        return null;
    }
  }

  fixUndefinedVariable(error, line) {
    const varName = this.extractVariableName(error.message);
    if (!varName) return null;

    // Common patterns for undefined variables
    if (line.includes(`${varName},`)) {
      // Object destructuring - add default value
      return line.replace(`${varName},`, `${varName} = undefined,`);
    }

    if (line.includes(`${varName}:`)) {
      // Object property - add default value
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

    // Add missing property with default value
    if (line.includes('{') && line.includes('}')) {
      return line.replace('}', `, ${propName}: undefined }`);
    }

    return null;
  }

  fixInterfaceMismatch(error, line) {
    // Add missing properties to object literal
    if (line.includes('{') && line.includes('}')) {
      // This is a complex fix that requires interface analysis
      // For now, add a comment indicating manual fix needed
      return line + ' // TODO: Add missing properties';
    }

    return null;
  }

  fixShorthandProperty(error, line) {
    // Convert shorthand property to explicit property
    const match = line.match(/(\w+),/);
    if (match) {
      const propName = match[1];
      return line.replace(`${propName},`, `${propName}: ${propName},`);
    }

    return null;
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
    this.log('Applying automated fixes...', 'info');

    let fixedCount = 0;

    for (const fix of this.fixes) {
      try {
        const success = await this.applyFileFix(fix);
        if (success) {
          fixedCount++;
          this.fixedFiles.add(fix.file);
        }
      } catch (error) {
        this.log(`Failed to apply fix to ${fix.file}: ${error.message}`, 'error');
      }
    }

    this.log(`Applied ${fixedCount} automated fixes`, 'success');
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
      this.log(`Fixed ${fix.file}`, 'success');
      return true;
    }

    return false;
  }

  generateErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: this.errors.length,
        criticalErrors: this.errors.filter(e => e.severity === 'critical').length,
        highPriorityErrors: this.errors.filter(e => e.severity === 'high').length,
        mediumPriorityErrors: this.errors.filter(e => e.severity === 'medium').length,
        lowPriorityErrors: this.errors.filter(e => e.severity === 'low').length,
        filesWithErrors: new Set(this.errors.map(e => e.file)).size,
        filesFixed: this.fixedFiles.size
      },
      categories: {},
      criticalIssues: this.criticalIssues,
      recommendations: this.generateRecommendations()
    };

    // Group errors by category
    this.errors.forEach(error => {
      if (!report.categories[error.category]) {
        report.categories[error.category] = [];
      }
      report.categories[error.category].push({
        file: error.file,
        line: error.line,
        message: error.message,
        fixStrategy: error.fixStrategy
      });
    });

    // Write report to file
    const reportPath = 'error-detection-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Error report written to ${reportPath}`, 'success');
    this.log(`Summary: ${report.summary.totalErrors} errors, ${report.summary.filesFixed} files fixed`, 'info');
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.errors.filter(e => e.category === 'undefined_variable').length > 10) {
      recommendations.push('High number of undefined variables - consider implementing strict TypeScript configuration');
    }

    if (this.errors.filter(e => e.category === 'interface_mismatch').length > 5) {
      recommendations.push('Multiple interface mismatches - review and update type definitions');
    }

    if (this.errors.filter(e => e.category === 'missing_export').length > 3) {
      recommendations.push('Missing exports detected - review module exports and imports');
    }

    if (this.fixedFiles.size < this.errors.length * 0.1) {
      recommendations.push('Low fix rate - many errors require manual intervention');
    }

    return recommendations;
  }
}

// Run the error detection frame
async function main() {
  const frame = new ErrorDetectionFrame();
  await frame.runErrorDetection();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ErrorDetectionFrame;
