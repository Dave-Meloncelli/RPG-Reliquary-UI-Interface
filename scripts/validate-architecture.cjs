#!/usr/bin/env node

/**
 * Architecture Validator
 * 
 * Enforces architectural mandates from internal/architectural_mandates.md
 * Validates ArkType usage and other architectural patterns
 */

const fs = require('fs');
const path = require('path');

class ArchitectureValidator {
  constructor() {
    this.rootDir = process.cwd();
    this.srcDir = path.join(this.rootDir, 'src');
    this.errors = [];
    this.warnings = [];
    this.mandates = this.loadMandates();
  }

  loadMandates() {
    const mandatesPath = path.join(this.rootDir, 'internal/architectural_mandates.md');
    if (!fs.existsSync(mandatesPath)) {
      console.warn('⚠️ Architectural mandates file not found');
      return {};
    }

    const content = fs.readFileSync(mandatesPath, 'utf8');
    const mandates = {};

    // Parse ArkType mandate
    if (content.includes('ArkType')) {
      mandates.arktype = {
        required: true,
        description: 'Use ArkType for all runtime data validation'
      };
    }

    return mandates;
  }

  validateArkTypeUsage() {
    console.log('🏗️ Validating architectural compliance...');
    
    if (!fs.existsSync(this.srcDir)) {
      console.error('❌ src directory not found');
      process.exit(1);
    }

    const files = this.getAllFiles(this.srcDir, ['.ts', '.tsx']);
    console.log(`📁 Found ${files.length} TypeScript files to validate`);

    for (const file of files) {
      this.validateFile(file);
    }

    this.reportResults();
  }

  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.rootDir, filePath);
      
      // Skip test files and configuration files
      if (relativePath.includes('.test.') || 
          relativePath.includes('.spec.') ||
          relativePath.includes('config') ||
          relativePath.includes('vite.config')) {
        return;
      }

      this.validateArkTypeCompliance(filePath, content, relativePath);
      this.validateValidationPatterns(filePath, content, relativePath);
      this.validateServicePatterns(filePath, content, relativePath);
      this.validateComponentPatterns(filePath, content, relativePath);

    } catch (error) {
      this.errors.push(`Failed to read ${filePath}: ${error.message}`);
    }
  }

  validateArkTypeCompliance(filePath, content, relativePath) {
    if (!this.mandates.arktype) return;

    // Check for Zod usage (should use ArkType)
    const zodImports = content.match(/import.*from\s+['"]zod['"]/g);
    const zodUsage = content.match(/import.*zod/g);
    
    if (zodImports || zodUsage) {
      this.errors.push({
        file: relativePath,
        type: 'zod-usage',
        message: 'Zod usage found - should use ArkType per architectural mandate',
        details: 'Replace Zod with ArkType for runtime data validation'
      });
    }

    // Check for validation without ArkType
    const hasValidation = content.includes('validate') || 
                         content.includes('schema') ||
                         content.includes('validation');
    
    const hasArkType = content.includes('arktype') || 
                      content.includes('ArkType') ||
                      content.includes('type(');

    if (hasValidation && !hasArkType && !this.isExemptFile(relativePath)) {
      this.warnings.push({
        file: relativePath,
        type: 'validation-without-arktype',
        message: 'Validation logic found without ArkType usage',
        details: 'Consider using ArkType for runtime validation'
      });
    }
  }

  validateValidationPatterns(filePath, content, relativePath) {
    // Check for proper ArkType usage patterns
    const arkTypeImports = content.match(/import.*from\s+['"]arktype['"]/g);
    
    if (arkTypeImports) {
      // Check for proper ArkType schema definitions
      const hasTypeDefinition = content.includes('type(') || 
                               content.includes('Type(') ||
                               content.includes('schema(');
      
      if (!hasTypeDefinition) {
        this.warnings.push({
          file: relativePath,
          type: 'arktype-import-no-usage',
          message: 'ArkType imported but no type definitions found',
          details: 'Define types using ArkType type() function'
        });
      }
    }

    // Check for validation function patterns
    const validationFunctions = content.match(/function\s+\w*[Vv]alidate\w*/g);
    if (validationFunctions) {
      validationFunctions.forEach(func => {
        if (!content.includes('arktype') && !content.includes('Type(')) {
          this.warnings.push({
            file: relativePath,
            type: 'custom-validation-function',
            message: `Custom validation function found: ${func}`,
            details: 'Consider using ArkType for validation'
          });
        }
      });
    }
  }

  validateServicePatterns(filePath, content, relativePath) {
    // Check if this is a service file
    if (!relativePath.includes('/services/')) return;

    // Validate service export patterns
    const hasDefaultExport = content.includes('export default');
    const hasNamedExports = content.includes('export {') || 
                           content.includes('export const') ||
                           content.includes('export function') ||
                           content.includes('export class');

    if (!hasDefaultExport && !hasNamedExports) {
      this.warnings.push({
        file: relativePath,
        type: 'service-no-exports',
        message: 'Service file has no exports',
        details: 'Services should export functions, classes, or default exports'
      });
    }

    // Check for proper service structure
    const hasServiceClass = content.includes('class') && content.includes('Service');
    const hasServiceFunctions = content.includes('export function') || 
                               content.includes('export const');
    
    if (!hasServiceClass && !hasServiceFunctions) {
      this.warnings.push({
        file: relativePath,
        type: 'service-structure',
        message: 'Service file may not follow service patterns',
        details: 'Consider using service classes or exported functions'
      });
    }
  }

  validateComponentPatterns(filePath, content, relativePath) {
    // Check if this is a React component file
    if (!relativePath.includes('/components/') && !relativePath.includes('/apps/')) return;

    // Validate React component patterns
    const hasReactImport = content.includes('import React') || 
                          content.includes('import {') && content.includes('React');
    const hasComponentDefinition = content.includes('function') && content.includes('(') ||
                                  content.includes('const') && content.includes('=') && content.includes('(') ||
                                  content.includes('class') && content.includes('Component');

    if (!hasReactImport && hasComponentDefinition) {
      this.warnings.push({
        file: relativePath,
        type: 'component-no-react-import',
        message: 'React component without React import',
        details: 'Consider importing React for clarity'
      });
    }

    // Check for proper component exports
    const hasDefaultExport = content.includes('export default');
    if (!hasDefaultExport && hasComponentDefinition) {
      this.warnings.push({
        file: relativePath,
        type: 'component-no-export',
        message: 'Component defined but not exported',
        details: 'Components should be exported for use'
      });
    }
  }

  isExemptFile(relativePath) {
    // Files that are exempt from ArkType validation
    const exemptPatterns = [
      'types.ts',
      'types.tsx',
      'index.ts',
      'index.tsx',
      'constants.ts',
      'constants.tsx',
      'utils.ts',
      'utils.tsx',
      'helpers.ts',
      'helpers.tsx'
    ];

    return exemptPatterns.some(pattern => relativePath.includes(pattern));
  }

  getAllFiles(dir, extensions) {
    const files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  reportResults() {
    console.log('\n📊 Architecture Validation Results:');
    console.log('===================================');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All architectural mandates followed!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Found ${this.errors.length} architectural violations:`);
      
      const errorTypes = {};
      this.errors.forEach(error => {
        if (!errorTypes[error.type]) errorTypes[error.type] = 0;
        errorTypes[error.type]++;
        
        console.log(`  📁 ${error.file}`);
        console.log(`     Type: ${error.type}`);
        console.log(`     Message: ${error.message}`);
        if (error.details) console.log(`     Details: ${error.details}`);
        console.log('');
      });

      console.log('Violation Summary:');
      Object.entries(errorTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️ Found ${this.warnings.length} architectural warnings:`);
      
      const warningTypes = {};
      this.warnings.forEach(warning => {
        if (!warningTypes[warning.type]) warningTypes[warning.type] = 0;
        warningTypes[warning.type]++;
        
        console.log(`  📁 ${warning.file}`);
        console.log(`     Type: ${warning.type}`);
        console.log(`     Message: ${warning.message}`);
        if (warning.details) console.log(`     Details: ${warning.details}`);
        console.log('');
      });

      console.log('Warning Summary:');
      Object.entries(warningTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    }

    // Exit with error code if there are errors
    if (this.errors.length > 0) {
      console.log('\n❌ Architecture validation failed. Please fix the violations above.');
      process.exit(1);
    }
  }
}

// Run validation
const validator = new ArchitectureValidator();
validator.validateArkTypeUsage(); 