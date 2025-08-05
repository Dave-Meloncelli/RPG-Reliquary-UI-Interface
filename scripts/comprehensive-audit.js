#!/usr/bin/env node

/**
 * Comprehensive Audit Script for AZ Interface
 * Checks for syntax errors, broken imports, and redundant files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ComprehensiveAudit {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.fixes = [];
    this.redundantFiles = [];
    this.brokenImports = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runAudit() {
    this.log('Starting comprehensive audit of AZ Interface...', 'info');
    
    try {
      // 1. Check working directory
      this.checkWorkingDirectory();
      
      // 2. Check for redundant files and folders
      this.checkRedundantFiles();
      
      // 3. Check import paths
      this.checkImportPaths();
      
      // 4. Check TypeScript syntax
      await this.checkTypeScriptSyntax();
      
      // 5. Check package.json consistency
      this.checkPackageConsistency();
      
      // 6. Check for missing dependencies
      this.checkMissingDependencies();
      
      // 7. Generate report
      this.generateReport();
      
    } catch (error) {
      this.log(`Audit failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  checkWorkingDirectory() {
    const cwd = process.cwd();
    this.log(`Current working directory: ${cwd}`, 'info');
    
    if (cwd.includes('F:\\AZ Interface')) {
      this.issues.push({
        type: 'CRITICAL',
        message: 'Running from wrong directory',
        details: `You are running from ${cwd} but fixes were applied to C:\\az-interface`,
        fix: 'Change directory to C:\\az-interface before running commands'
      });
    }
    
    // Check if we're in the correct project structure
    const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
    const hasSrcFolder = fs.existsSync(path.join(cwd, 'src'));
    const hasIndexHtml = fs.existsSync(path.join(cwd, 'index.html'));
    
    if (!hasPackageJson) {
      this.issues.push({
        type: 'CRITICAL',
        message: 'Missing package.json',
        details: 'No package.json found in current directory',
        fix: 'Ensure you are in the correct project root directory'
      });
    }
    
    if (!hasSrcFolder) {
      this.issues.push({
        type: 'CRITICAL',
        message: 'Missing src folder',
        details: 'No src folder found in current directory',
        fix: 'Ensure you are in the correct project root directory'
      });
    }
    
    if (!hasIndexHtml) {
      this.issues.push({
        type: 'CRITICAL',
        message: 'Missing index.html',
        details: 'No index.html found in current directory',
        fix: 'Create index.html in the root directory for Vite'
      });
    }
  }

  checkRedundantFiles() {
    this.log('Checking for redundant files and folders...', 'info');
    
    const redundantPatterns = [
      'Daves_NewTest', // Old test directory
      'node_modules/.vite', // Vite cache (can be cleared)
      '*.log', // Log files
      'dist', // Build output (can be regenerated)
      '.DS_Store', // macOS files
      'Thumbs.db' // Windows files
    ];
    
    const redundantFiles = [];
    
    redundantPatterns.forEach(pattern => {
      const files = this.findFiles(pattern);
      files.forEach(file => {
        redundantFiles.push({
          path: file,
          reason: `Matches redundant pattern: ${pattern}`,
          action: 'Consider removing if not needed'
        });
      });
    });
    
    // Check for duplicate directories
    const directories = this.getDirectories('.');
    const duplicateDirs = this.findDuplicateDirectories(directories);
    
    duplicateDirs.forEach(dir => {
      redundantFiles.push({
        path: dir,
        reason: 'Duplicate directory structure',
        action: 'Review and consolidate if needed'
      });
    });
    
    this.redundantFiles = redundantFiles;
    
    if (redundantFiles.length > 0) {
      this.log(`Found ${redundantFiles.length} potentially redundant files/folders`, 'warning');
    }
  }

  checkImportPaths() {
    this.log('Checking import paths...', 'info');
    
    const tsFiles = this.findFiles('**/*.{ts,tsx}');
    const importIssues = [];
    
    tsFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Check for relative imports that might be broken
        const relativeImportMatch = line.match(/import.*from\s+['"](\.\.?\/[^'"]+)['"]/);
        if (relativeImportMatch) {
          const importPath = relativeImportMatch[1];
          const resolvedPath = this.resolveImportPath(file, importPath);
          
          if (!fs.existsSync(resolvedPath) && !resolvedPath.includes('node_modules')) {
            importIssues.push({
              file,
              line: index + 1,
              import: importPath,
              issue: 'Import path does not resolve to existing file'
            });
          }
        }
        
        // Check for EventBus import issues
        if (line.includes('import { EventBus }') && line.includes('./eventBus')) {
          importIssues.push({
            file,
            line: index + 1,
            import: 'EventBus',
            issue: 'Should import eventBus instance, not EventBus type'
          });
        }
      });
    });
    
    this.brokenImports = importIssues;
    
    if (importIssues.length > 0) {
      this.log(`Found ${importIssues.length} import issues`, 'warning');
    }
  }

  async checkTypeScriptSyntax() {
    this.log('Checking TypeScript syntax...', 'info');
    
    try {
      // Run TypeScript compiler in noEmit mode
      const result = execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      this.log('TypeScript syntax check passed', 'success');
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const lines = output.split('\n');
      
      lines.forEach(line => {
        if (line.includes('error TS')) {
          this.issues.push({
            type: 'TypeScript',
            message: 'TypeScript compilation error',
            details: line.trim(),
            fix: 'Review and fix TypeScript errors'
          });
        }
      });
      
      this.log(`Found ${this.issues.filter(i => i.type === 'TypeScript').length} TypeScript errors`, 'error');
    }
  }

  checkPackageConsistency() {
    this.log('Checking package.json consistency...', 'info');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check for missing scripts
      const requiredScripts = ['dev', 'build', 'preview', 'type-check'];
      requiredScripts.forEach(script => {
        if (!packageJson.scripts[script]) {
          this.warnings.push({
            type: 'Package',
            message: `Missing script: ${script}`,
            details: `package.json does not contain ${script} script`,
            fix: `Add "${script}": "..." to package.json scripts`
          });
        }
      });
      
      // Check for missing dependencies
      const requiredDeps = ['react', 'react-dom', 'vite', '@vitejs/plugin-react'];
      requiredDeps.forEach(dep => {
        if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
          this.issues.push({
            type: 'Dependency',
            message: `Missing dependency: ${dep}`,
            details: `${dep} is not listed in package.json`,
            fix: `Run: npm install ${dep}`
          });
        }
      });
      
    } catch (error) {
      this.issues.push({
        type: 'CRITICAL',
        message: 'Invalid package.json',
        details: error.message,
        fix: 'Fix package.json syntax'
      });
    }
  }

  checkMissingDependencies() {
    this.log('Checking for missing dependencies...', 'info');
    
    const missingDeps = [
      '@google/genai',
      'monaco-editor'
    ];
    
    missingDeps.forEach(dep => {
      try {
        require.resolve(dep);
      } catch (error) {
        this.issues.push({
          type: 'Dependency',
          message: `Missing dependency: ${dep}`,
          details: `${dep} is not installed`,
          fix: `Run: npm install ${dep}`
        });
      }
    });
  }

  generateReport() {
    this.log('Generating comprehensive audit report...', 'info');
    
    console.log('\n' + '='.repeat(80));
    console.log('🔍 COMPREHENSIVE AUDIT REPORT');
    console.log('='.repeat(80));
    
    // Critical Issues
    const criticalIssues = this.issues.filter(i => i.type === 'CRITICAL');
    if (criticalIssues.length > 0) {
      console.log('\n❌ CRITICAL ISSUES:');
      criticalIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.message}`);
        console.log(`   Details: ${issue.details}`);
        console.log(`   Fix: ${issue.fix}`);
      });
    }
    
    // TypeScript Issues
    const tsIssues = this.issues.filter(i => i.type === 'TypeScript');
    if (tsIssues.length > 0) {
      console.log('\n🔧 TYPESCRIPT ISSUES:');
      tsIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.details}`);
      });
    }
    
    // Import Issues
    if (this.brokenImports.length > 0) {
      console.log('\n📁 IMPORT ISSUES:');
      this.brokenImports.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.file}:${issue.line}`);
        console.log(`   Import: ${issue.import}`);
        console.log(`   Issue: ${issue.issue}`);
      });
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.message}`);
        console.log(`   Details: ${warning.details}`);
        console.log(`   Fix: ${warning.fix}`);
      });
    }
    
    // Redundant Files
    if (this.redundantFiles.length > 0) {
      console.log('\n🗑️ REDUNDANT FILES:');
      this.redundantFiles.forEach((file, index) => {
        console.log(`\n${index + 1}. ${file.path}`);
        console.log(`   Reason: ${file.reason}`);
        console.log(`   Action: ${file.action}`);
      });
    }
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY:');
    console.log(`   Critical Issues: ${criticalIssues.length}`);
    console.log(`   TypeScript Errors: ${tsIssues.length}`);
    console.log(`   Import Issues: ${this.brokenImports.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Redundant Files: ${this.redundantFiles.length}`);
    console.log('='.repeat(80));
    
    // Recommendations
    if (criticalIssues.length > 0) {
      console.log('\n🚨 IMMEDIATE ACTION REQUIRED:');
      console.log('   Fix critical issues before proceeding with development.');
    }
    
    if (this.brokenImports.length > 0) {
      console.log('\n🔧 RECOMMENDED FIXES:');
      console.log('   1. Fix broken import paths');
      console.log('   2. Update EventBus imports to use eventBus instance');
      console.log('   3. Install missing dependencies');
    }
    
    console.log('\n✅ Audit completed successfully!');
  }

  // Helper methods
  findFiles(pattern) {
    // Simplified file finding - in a real implementation, you'd use glob
    const files = [];
    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (pattern.includes('*')) {
          // Simple pattern matching
          if (item.includes(pattern.replace('*', ''))) {
            files.push(fullPath);
          }
        } else if (fullPath.includes(pattern)) {
          files.push(fullPath);
        }
      });
    };
    walkDir('.');
    return files;
  }

  getDirectories(dir) {
    const items = fs.readdirSync(dir);
    return items.filter(item => {
      const fullPath = path.join(dir, item);
      return fs.statSync(fullPath).isDirectory();
    });
  }

  findDuplicateDirectories(dirs) {
    // Simplified duplicate detection
    const duplicates = [];
    const seen = new Set();
    
    dirs.forEach(dir => {
      const normalized = dir.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(normalized)) {
        duplicates.push(dir);
      } else {
        seen.add(normalized);
      }
    });
    
    return duplicates;
  }

  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    return path.resolve(fromDir, importPath);
  }
}

// Run the audit
const audit = new ComprehensiveAudit();
audit.runAudit().catch(error => {
  console.error('Audit failed:', error);
  process.exit(1);
}); 