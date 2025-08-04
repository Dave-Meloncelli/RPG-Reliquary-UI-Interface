const fs = require('fs');
const path = require('path');

class BacklogAuditor {
  constructor() {
    this.backlogFiles = [
      'COMPREHENSIVE_BACKLOG_ANALYSIS.md',
      'docs/backlog.md',
      'CRITICAL_AUDIT_FINDINGS.md',
      'VERSION_CONFLICT_ANALYSIS.md'
    ];
    
    this.pendingItems = [];
    this.completedItems = [];
    this.criticalIssues = [];
  }
  
  async auditBacklog() {
    console.log('🔍 Auditing backlog and pending items...');
    
    try {
      // Scan backlog files
      await this.scanBacklogFiles();
      
      // Check for TODO comments in code
      await this.scanCodeForTodos();
      
      // Check for FIXME comments
      await this.scanCodeForFixmes();
      
      // Check for critical issues
      await this.scanForCriticalIssues();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Backlog audit failed:', error.message);
      process.exit(1);
    }
  }
  
  async scanBacklogFiles() {
    console.log('🔍 Scanning backlog documentation...');
    
    for (const file of this.backlogFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Count pending items
        const pendingMatches = content.match(/\[ \]/g);
        if (pendingMatches) {
          this.pendingItems.push({
            file,
            count: pendingMatches.length,
            type: 'checkbox'
          });
        }
        
        // Count TODO items
        const todoMatches = content.match(/TODO:/gi);
        if (todoMatches) {
          this.pendingItems.push({
            file,
            count: todoMatches.length,
            type: 'TODO'
          });
        }
        
        // Count completed items
        const completedMatches = content.match(/\[x\]/g);
        if (completedMatches) {
          this.completedItems.push({
            file,
            count: completedMatches.length
          });
        }
        
        console.log(`✅ ${file} - Scanned`);
      } else {
        console.log(`⚠️  ${file} - Not found`);
      }
    }
  }
  
  async scanCodeForTodos() {
    console.log('🔍 Scanning code for TODO comments...');
    
    const codeDirs = ['src', 'scripts', 'backend'];
    
    for (const dir of codeDirs) {
      if (fs.existsSync(dir)) {
        const files = this.getFilesRecursively(dir, ['.ts', '.tsx', '.js', '.jsx']);
        
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          const todoMatches = content.match(/TODO:/gi);
          
          if (todoMatches) {
            this.pendingItems.push({
              file,
              count: todoMatches.length,
              type: 'TODO'
            });
          }
        }
      }
    }
  }
  
  async scanCodeForFixmes() {
    console.log('🔍 Scanning code for FIXME comments...');
    
    const codeDirs = ['src', 'scripts', 'backend'];
    
    for (const dir of codeDirs) {
      if (fs.existsSync(dir)) {
        const files = this.getFilesRecursively(dir, ['.ts', '.tsx', '.js', '.jsx']);
        
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          const fixmeMatches = content.match(/FIXME:/gi);
          
          if (fixmeMatches) {
            this.criticalIssues.push({
              file,
              count: fixmeMatches.length,
              type: 'FIXME'
            });
          }
        }
      }
    }
  }
  
  async scanForCriticalIssues() {
    console.log('🔍 Scanning for critical issues...');
    
    // Check for TypeScript errors
    try {
      const { execSync } = require('child_process');
      const result = execSync('npm run type-check', { encoding: 'utf8', stdio: 'pipe' });
      console.log('✅ TypeScript compilation successful');
    } catch (error) {
      this.criticalIssues.push({
        file: 'TypeScript',
        count: 1,
        type: 'Compilation Error',
        details: error.message
      });
    }
    
    // Check for linting errors
    try {
      const { execSync } = require('child_process');
      const result = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
      console.log('✅ Linting passed');
    } catch (error) {
      this.criticalIssues.push({
        file: 'ESLint',
        count: 1,
        type: 'Linting Error',
        details: error.message
      });
    }
  }
  
  getFilesRecursively(dir, extensions) {
    const files = [];
    
    function scan(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }
    
    scan(dir);
    return files;
  }
  
  generateReport() {
    console.log('\n📊 BACKLOG AUDIT REPORT:');
    console.log('==========================');
    
    // Calculate totals
    const totalPending = this.pendingItems.reduce((sum, item) => sum + item.count, 0);
    const totalCompleted = this.completedItems.reduce((sum, item) => sum + item.count, 0);
    const totalCritical = this.criticalIssues.length;
    
    console.log(`📋 Total Pending Items: ${totalPending}`);
    console.log(`✅ Total Completed Items: ${totalCompleted}`);
    console.log(`🚨 Critical Issues: ${totalCritical}`);
    
    if (this.pendingItems.length > 0) {
      console.log('\n📋 PENDING ITEMS BY FILE:');
      this.pendingItems.forEach(item => {
        console.log(`  - ${item.file}: ${item.count} ${item.type} items`);
      });
    }
    
    if (this.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      this.criticalIssues.forEach(issue => {
        console.log(`  - ${issue.file}: ${issue.type} (${issue.count} issues)`);
        if (issue.details) {
          console.log(`    Details: ${issue.details.substring(0, 100)}...`);
        }
      });
    }
    
    if (totalCritical === 0 && totalPending < 50) {
      console.log('\n🎉 Backlog audit completed successfully!');
      console.log('✅ No critical issues found');
      console.log('✅ Backlog is manageable');
    } else if (totalCritical === 0) {
      console.log('\n⚠️  Backlog audit completed with warnings');
      console.log('✅ No critical issues found');
      console.log(`⚠️  Large backlog: ${totalPending} pending items`);
    } else {
      console.log('\n❌ Backlog audit completed with critical issues');
      console.log(`🚨 ${totalCritical} critical issues need immediate attention`);
      process.exit(1);
    }
  }
}

// Run the audit
const auditor = new BacklogAuditor();
auditor.auditBacklog(); 