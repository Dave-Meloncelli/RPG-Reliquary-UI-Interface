#!/usr/bin/env node

/**
 * AZ Interface - Comprehensive System Audit
 * 
 * This script performs a complete audit of the system to ensure:
 * - All imports are correctly resolved
 * - All services are properly connected
 * - All apps are registered
 * - All types are consistent
 * - All dependencies are installed
 * - All documentation is up to date
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SystemAuditor {
  constructor() {
    this.rootDir = process.cwd();
    this.auditResults = {
      timestamp: new Date().toISOString(),
      summary: {},
      details: {},
      errors: [],
      warnings: [],
      recommendations: []
    };
  }

  async runFullAudit() {
    console.log('🔍 Starting Comprehensive System Audit...\n');
    
    try {
      await this.auditProjectStructure();
      await this.auditDependencies();
      await this.auditTypeScriptErrors();
      await this.auditImportConnections();
      await this.auditAppRegistry();
      await this.auditServiceConnections();
      await this.auditDocumentation();
      await this.auditVersionControl();
      await this.generateAuditReport();
      
      console.log('\n✅ System Audit Complete!');
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Audit failed:', error.message);
      this.auditResults.errors.push(error.message);
    }
  }

  async auditProjectStructure() {
    console.log('📁 Auditing Project Structure...');
    
    const requiredDirs = [
      'src',
      'src/components',
      'src/services',
      'src/apps',
      'src/types',
      'src/constants',
      'src/data',
      'src/styles',
      'public',
      'backend',
      'crewai',
      'a2a',
      'docs',
      'internal',
      'schemas'
    ];

    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'docker-compose.yml',
      'README.md',
      'src/components/App.tsx',
      'src/constants/constants.tsx',
      'src/types/types.ts'
    ];

    const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

    this.auditResults.details.projectStructure = {
      missingDirs,
      missingFiles,
      status: missingDirs.length === 0 && missingFiles.length === 0 ? 'PASS' : 'FAIL'
    };

    if (missingDirs.length > 0) {
      this.auditResults.warnings.push(`Missing directories: ${missingDirs.join(', ')}`);
    }
    if (missingFiles.length > 0) {
      this.auditResults.errors.push(`Missing critical files: ${missingFiles.join(', ')}`);
    }
  }

  async auditDependencies() {
    console.log('📦 Auditing Dependencies...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const installedDeps = Object.keys(packageJson.dependencies || {});
      const installedDevDeps = Object.keys(packageJson.devDependencies || {});
      
      // Check for common missing dependencies
      const requiredDeps = [
        'react', 'react-dom', 'typescript', 'vite',
        'tailwindcss', '@types/node', '@types/react'
      ];
      
      const missingDeps = requiredDeps.filter(dep => 
        !installedDeps.includes(dep) && !installedDevDeps.includes(dep)
      );

      this.auditResults.details.dependencies = {
        totalDeps: installedDeps.length,
        totalDevDeps: installedDevDeps.length,
        missingDeps,
        status: missingDeps.length === 0 ? 'PASS' : 'FAIL'
      };

      if (missingDeps.length > 0) {
        this.auditResults.warnings.push(`Missing dependencies: ${missingDeps.join(', ')}`);
      }

    } catch (error) {
      this.auditResults.errors.push(`Failed to audit dependencies: ${error.message}`);
    }
  }

  async auditTypeScriptErrors() {
    console.log('🔧 Auditing TypeScript Errors...');
    
    try {
      const result = execSync('npm run type-check 2>&1', { encoding: 'utf8' });
      const errorMatch = result.match(/Found (\d+) errors? in (\d+) files?/);
      
      if (errorMatch) {
        const errorCount = parseInt(errorMatch[1]);
        const fileCount = parseInt(errorMatch[2]);
        
        this.auditResults.details.typeScript = {
          errorCount,
          fileCount,
          status: errorCount === 0 ? 'PASS' : 'FAIL',
          details: result
        };

        if (errorCount > 0) {
          this.auditResults.errors.push(`${errorCount} TypeScript errors in ${fileCount} files`);
        }
      } else {
        this.auditResults.details.typeScript = {
          errorCount: 0,
          fileCount: 0,
          status: 'PASS',
          details: 'No TypeScript errors found'
        };
      }

    } catch (error) {
      // TypeScript check failed, which means there are errors
      const errorOutput = error.stdout || error.stderr || error.message;
      const errorMatch = errorOutput.match(/Found (\d+) errors? in (\d+) files?/);
      
      if (errorMatch) {
        const errorCount = parseInt(errorMatch[1]);
        const fileCount = parseInt(errorMatch[2]);
        
        this.auditResults.details.typeScript = {
          errorCount,
          fileCount,
          status: 'FAIL',
          details: errorOutput
        };
        
        this.auditResults.errors.push(`${errorCount} TypeScript errors in ${fileCount} files`);
      }
    }
  }

  async auditImportConnections() {
    console.log('🔗 Auditing Import Connections...');
    
    const importIssues = [];
    const srcDir = path.join(this.rootDir, 'src');
    
    if (fs.existsSync(srcDir)) {
      const files = this.getAllFiles(srcDir, ['.ts', '.tsx']);
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
        
        if (importMatches) {
          for (const match of importMatches) {
            const importPath = match.match(/from\s+['"]([^'"]+)['"]/)[1];
            
            // Check if it's a relative import
            if (importPath.startsWith('.')) {
              const resolvedPath = this.resolveImportPath(file, importPath);
              if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.ts') && !fs.existsSync(resolvedPath + '.tsx')) {
                importIssues.push({
                  file: path.relative(this.rootDir, file),
                  import: importPath,
                  resolvedPath: path.relative(this.rootDir, resolvedPath)
                });
              }
            }
          }
        }
      }
    }

    this.auditResults.details.imports = {
      totalFiles: this.getAllFiles(srcDir, ['.ts', '.tsx']).length,
      importIssues,
      status: importIssues.length === 0 ? 'PASS' : 'FAIL'
    };

    if (importIssues.length > 0) {
      this.auditResults.errors.push(`${importIssues.length} import resolution issues found`);
    }
  }

  async auditAppRegistry() {
    console.log('📱 Auditing App Registry...');
    
    try {
      const constantsFile = path.join(this.rootDir, 'src/constants/constants.tsx');
      if (!fs.existsSync(constantsFile)) {
        this.auditResults.errors.push('App registry file not found: src/constants/constants.tsx');
        return;
      }

      const content = fs.readFileSync(constantsFile, 'utf8');
      const appMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
      const apps = appMatches ? appMatches.map(match => match.match(/['"]([^'"]+)['"]/)[1]) : [];
      
      // Check if each app has a corresponding component file
      const missingApps = [];
      for (const appId of apps) {
        const appFile = path.join(this.rootDir, `src/apps/${this.kebabToPascal(appId)}App.tsx`);
        if (!fs.existsSync(appFile)) {
          missingApps.push(appId);
        }
      }

      this.auditResults.details.appRegistry = {
        totalApps: apps.length,
        missingApps,
        status: missingApps.length === 0 ? 'PASS' : 'FAIL'
      };

      if (missingApps.length > 0) {
        this.auditResults.errors.push(`Missing app components: ${missingApps.join(', ')}`);
      }

    } catch (error) {
      this.auditResults.errors.push(`Failed to audit app registry: ${error.message}`);
    }
  }

  async auditServiceConnections() {
    console.log('🔌 Auditing Service Connections...');
    
    const serviceDir = path.join(this.rootDir, 'src/services');
    if (!fs.existsSync(serviceDir)) {
      this.auditResults.errors.push('Services directory not found');
      return;
    }

    const serviceFiles = fs.readdirSync(serviceDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
      .map(file => file.replace('.ts', ''));

    const connectionIssues = [];
    
    // Check for circular dependencies and missing imports
    for (const service of serviceFiles) {
      const servicePath = path.join(serviceDir, `${service}.ts`);
      const content = fs.readFileSync(servicePath, 'utf8');
      
      // Check for export statements
      const hasExports = content.includes('export ') || content.includes('export default');
      if (!hasExports) {
        connectionIssues.push(`${service}: No exports found`);
      }
      
      // Check for proper imports
      const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
      if (importMatches) {
        for (const match of importMatches) {
          const importPath = match.match(/from\s+['"]([^'"]+)['"]/)[1];
          if (importPath.startsWith('.')) {
            const resolvedPath = this.resolveImportPath(servicePath, importPath);
            if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.ts')) {
              connectionIssues.push(`${service}: Invalid import ${importPath}`);
            }
          }
        }
      }
    }

    this.auditResults.details.services = {
      totalServices: serviceFiles.length,
      connectionIssues,
      status: connectionIssues.length === 0 ? 'PASS' : 'FAIL'
    };

    if (connectionIssues.length > 0) {
      this.auditResults.errors.push(`${connectionIssues.length} service connection issues found`);
    }
  }

  async auditDocumentation() {
    console.log('📚 Auditing Documentation...');
    
    const requiredDocs = [
      'README.md',
      'BACKLOG_MANAGEMENT.md',
      'TECH_STACK_REGISTRY.md',
      'internal/Known-faults-fixes.md'
    ];

    const missingDocs = requiredDocs.filter(doc => !fs.existsSync(doc));
    const outdatedDocs = [];

    // Check if README mentions Concurrent Agent Hub
    if (fs.existsSync('README.md')) {
      const readmeContent = fs.readFileSync('README.md', 'utf8');
      if (!readmeContent.includes('Concurrent Agent Hub')) {
        outdatedDocs.push('README.md: Missing Concurrent Agent Hub documentation');
      }
    }

    this.auditResults.details.documentation = {
      totalDocs: requiredDocs.length,
      missingDocs,
      outdatedDocs,
      status: missingDocs.length === 0 && outdatedDocs.length === 0 ? 'PASS' : 'FAIL'
    };

    if (missingDocs.length > 0) {
      this.auditResults.warnings.push(`Missing documentation: ${missingDocs.join(', ')}`);
    }
    if (outdatedDocs.length > 0) {
      this.auditResults.warnings.push(`Outdated documentation: ${outdatedDocs.join(', ')}`);
    }
  }

  async auditVersionControl() {
    console.log('🔄 Auditing Version Control...');
    
    try {
      // Check if git is initialized
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const hasUncommittedChanges = gitStatus.trim().length > 0;
      
      // Check for .gitignore
      const hasGitignore = fs.existsSync('.gitignore');
      
      // Check for conventional commits
      const recentCommits = execSync('git log --oneline -10', { encoding: 'utf8' });
      const conventionalCommits = recentCommits.split('\n').filter(line => 
        line.match(/^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: /)
      ).length;

      this.auditResults.details.versionControl = {
        hasUncommittedChanges,
        hasGitignore,
        conventionalCommits,
        totalRecentCommits: recentCommits.split('\n').filter(line => line.trim()).length,
        status: hasGitignore && conventionalCommits > 0 ? 'PASS' : 'WARN'
      };

      if (hasUncommittedChanges) {
        this.auditResults.warnings.push('Uncommitted changes detected');
      }
      if (!hasGitignore) {
        this.auditResults.warnings.push('Missing .gitignore file');
      }
      if (conventionalCommits === 0) {
        this.auditResults.warnings.push('No conventional commits found in recent history');
      }

    } catch (error) {
      this.auditResults.warnings.push(`Version control audit failed: ${error.message}`);
    }
  }

  async generateAuditReport() {
    console.log('📊 Generating Audit Report...');
    
    // Calculate summary
    const totalChecks = Object.keys(this.auditResults.details).length;
    const passedChecks = Object.values(this.auditResults.details)
      .filter(detail => detail.status === 'PASS').length;
    
    this.auditResults.summary = {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      errorCount: this.auditResults.errors.length,
      warningCount: this.auditResults.warnings.length,
      overallStatus: this.auditResults.errors.length === 0 ? 'PASS' : 'FAIL'
    };

    // Save detailed report
    const reportPath = path.join(this.rootDir, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.auditResults, null, 2));
    
    // Save human-readable report
    const humanReportPath = path.join(this.rootDir, 'AUDIT_REPORT.md');
    fs.writeFileSync(humanReportPath, this.generateHumanReadableReport());
  }

  generateHumanReadableReport() {
    const { summary, details, errors, warnings, recommendations } = this.auditResults;
    
    return `# 🔍 AZ Interface System Audit Report

**Generated:** ${new Date().toLocaleString()}
**Overall Status:** ${summary.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}

## 📊 Summary

- **Total Checks:** ${summary.totalChecks}
- **Passed:** ${summary.passedChecks}
- **Failed:** ${summary.failedChecks}
- **Errors:** ${summary.errorCount}
- **Warnings:** ${summary.warningCount}

## 🔍 Detailed Results

${Object.entries(details).map(([category, detail]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1)}
**Status:** ${detail.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
${Object.entries(detail).filter(([key]) => key !== 'status').map(([key, value]) => `- **${key}:** ${JSON.stringify(value)}`).join('\n')}
`).join('\n')}

## ❌ Errors

${errors.length > 0 ? errors.map(error => `- ${error}`).join('\n') : '- No errors found'}

## ⚠️ Warnings

${warnings.length > 0 ? warnings.map(warning => `- ${warning}`).join('\n') : '- No warnings found'}

## 💡 Recommendations

${recommendations.length > 0 ? recommendations.map(rec => `- ${rec}`).join('\n') : '- No specific recommendations'}

## 🚀 Next Steps

1. **Fix TypeScript Errors:** ${details.typeScript?.errorCount || 0} errors need to be resolved
2. **Resolve Import Issues:** ${details.imports?.importIssues?.length || 0} import problems found
3. **Update Documentation:** Ensure all new features are documented
4. **Commit Changes:** Use conventional commit format for all changes

---
*Report generated by AZ Interface System Auditor*
`;
  }

  printSummary() {
    const { summary, errors, warnings } = this.auditResults;
    
    console.log('\n📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Overall Status: ${summary.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Checks: ${summary.passedChecks}/${summary.totalChecks} passed`);
    console.log(`Errors: ${summary.errorCount}`);
    console.log(`Warnings: ${summary.warningCount}`);
    
    if (errors.length > 0) {
      console.log('\n❌ CRITICAL ISSUES:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log('\n📄 Reports saved to:');
    console.log('  - audit-report.json (detailed JSON)');
    console.log('  - AUDIT_REPORT.md (human-readable)');
  }

  // Utility methods
  getAllFiles(dir, extensions) {
    const files = [];
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

  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    return path.resolve(fromDir, importPath);
  }

  kebabToPascal(str) {
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
  }
}

// Run the audit
const auditor = new SystemAuditor();
auditor.runFullAudit().catch(console.error); 