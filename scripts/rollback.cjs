#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Rollback System
 * Integrates with audit pipeline and persona security handshake
 */

class RollbackSystem {
  constructor() {
    this.auditLogPath = path.join(process.cwd(), 'audit-logs');
    this.backupPath = path.join(process.cwd(), 'backups');
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.auditLogPath, this.backupPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  logAuditEvent(event, details) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
      persona: process.env.PERSONA_ID || 'system'
    };

    const logFile = path.join(this.auditLogPath, `rollback-${timestamp.split('T')[0]}.json`);
    let logs = [];
    
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }

  createBackup(description) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}`;
      const backupDir = path.join(this.backupPath, backupName);
      
      // Create backup directory
      fs.mkdirSync(backupDir, { recursive: true });
      
      // Get current git commit
      const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      
      // Create backup manifest
      const manifest = {
        timestamp,
        description,
        gitCommit: currentCommit,
        files: []
      };
      
      // Backup critical files
      const criticalFiles = [
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        'vite.config.ts',
        '.eslintrc.json',
        'CHANGELOG.md'
      ];
      
      criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
          const destPath = path.join(backupDir, file);
          fs.copyFileSync(file, destPath);
          manifest.files.push(file);
        }
      });
      
      // Backup src directory
      if (fs.existsSync('src')) {
        const srcBackupPath = path.join(backupDir, 'src');
        this.copyDirectory('src', srcBackupPath);
        manifest.files.push('src/');
      }
      
      // Save manifest
      fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
      
      this.logAuditEvent('backup_created', { backupName, description });
      console.log(`✅ Backup created: ${backupName}`);
      
      return backupName;
    } catch (error) {
      console.error('❌ Error creating backup:', error.message);
      return null;
    }
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  listBackups() {
    try {
      const backups = fs.readdirSync(this.backupPath)
        .filter(dir => fs.statSync(path.join(this.backupPath, dir)).isDirectory())
        .map(dir => {
          const manifestPath = path.join(this.backupPath, dir, 'manifest.json');
          if (fs.existsSync(manifestPath)) {
            return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          }
          return { name: dir, timestamp: dir.split('-').slice(1).join('-') };
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return backups;
    } catch (error) {
      console.error('❌ Error listing backups:', error.message);
      return [];
    }
  }

  rollbackToBackup(backupName) {
    try {
      const backupDir = path.join(this.backupPath, backupName);
      if (!fs.existsSync(backupDir)) {
        throw new Error(`Backup ${backupName} not found`);
      }
      
      const manifestPath = path.join(backupDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        throw new Error(`Backup manifest not found for ${backupName}`);
      }
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Create pre-rollback backup
      const preRollbackBackup = this.createBackup(`Pre-rollback backup before rolling back to ${backupName}`);
      
      // Restore files
      manifest.files.forEach(file => {
        const srcPath = path.join(backupDir, file);
        if (fs.existsSync(srcPath)) {
          if (fs.statSync(srcPath).isDirectory()) {
            // Remove existing directory and copy backup
            if (fs.existsSync(file)) {
              fs.rmSync(file, { recursive: true, force: true });
            }
            this.copyDirectory(srcPath, file);
          } else {
            fs.copyFileSync(srcPath, file);
          }
          console.log(`✅ Restored: ${file}`);
        }
      });
      
      // Git operations
      try {
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "rollback: Restored from backup ${backupName}"`, { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️ Git operations failed, but files were restored');
      }
      
      this.logAuditEvent('rollback_executed', { 
        backupName, 
        preRollbackBackup,
        manifest 
      });
      
      console.log(`✅ Rollback completed to backup: ${backupName}`);
      return true;
    } catch (error) {
      console.error('❌ Error during rollback:', error.message);
      return false;
    }
  }

  rollbackToCommit(commitHash) {
    try {
      // Create backup before rollback
      const backup = this.createBackup(`Pre-rollback backup before rolling back to commit ${commitHash}`);
      
      // Verify commit exists
      try {
        execSync(`git show ${commitHash}`, { stdio: 'pipe' });
      } catch (error) {
        throw new Error(`Commit ${commitHash} not found`);
      }
      
      // Create new branch for rollback
      const rollbackBranch = `rollback-${commitHash.substring(0, 8)}-${Date.now()}`;
      execSync(`git checkout -b ${rollbackBranch}`, { stdio: 'inherit' });
      
      // Reset to commit
      execSync(`git reset --hard ${commitHash}`, { stdio: 'inherit' });
      
      this.logAuditEvent('rollback_to_commit', { 
        commitHash, 
        rollbackBranch,
        backup 
      });
      
      console.log(`✅ Rollback completed to commit: ${commitHash}`);
      console.log(`📋 Created rollback branch: ${rollbackBranch}`);
      return true;
    } catch (error) {
      console.error('❌ Error during commit rollback:', error.message);
      return false;
    }
  }

  validateRollback(backupName) {
    try {
      const backupDir = path.join(this.backupPath, backupName);
      const manifestPath = path.join(backupDir, 'manifest.json');
      
      if (!fs.existsSync(manifestPath)) {
        return { valid: false, error: 'Manifest not found' };
      }
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Validate critical files
      const criticalFiles = ['package.json', 'tsconfig.json'];
      const missingFiles = criticalFiles.filter(file => !manifest.files.includes(file));
      
      if (missingFiles.length > 0) {
        return { valid: false, error: `Missing critical files: ${missingFiles.join(', ')}` };
      }
      
      // Run validation checks
      const validations = [];
      
      // Check if package.json is valid JSON
      try {
        const packageJsonPath = path.join(backupDir, 'package.json');
        JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        validations.push('✅ package.json is valid JSON');
      } catch (error) {
        validations.push('❌ package.json is invalid JSON');
      }
      
      // Check TypeScript configuration
      try {
        const tsConfigPath = path.join(backupDir, 'tsconfig.json');
        JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
        validations.push('✅ tsconfig.json is valid JSON');
      } catch (error) {
        validations.push('❌ tsconfig.json is invalid JSON');
      }
      
      return {
        valid: validations.every(v => v.startsWith('✅')),
        validations,
        manifest
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// CLI Interface
const rollbackSystem = new RollbackSystem();

const command = process.argv[2];
const target = process.argv[3];
const description = process.argv[4];

switch (command) {
  case 'backup':
    const backupName = rollbackSystem.createBackup(description || 'Manual backup');
    if (backupName) {
      console.log(`Backup created: ${backupName}`);
    }
    break;
    
  case 'list':
    const backups = rollbackSystem.listBackups();
    console.log('\n📋 Available Backups:');
    backups.forEach(backup => {
      console.log(`  ${backup.name} - ${backup.timestamp}`);
      if (backup.description) {
        console.log(`    ${backup.description}`);
      }
    });
    break;
    
  case 'rollback':
    if (!target) {
      console.error('❌ Please provide a backup name or commit hash');
      process.exit(1);
    }
    
    if (target.length === 40 || target.length === 7) {
      // Git commit hash
      rollbackSystem.rollbackToCommit(target);
    } else {
      // Backup name
      const validation = rollbackSystem.validateRollback(target);
      if (validation.valid) {
        console.log('✅ Backup validation passed');
        validation.validations.forEach(v => console.log(v));
        rollbackSystem.rollbackToBackup(target);
      } else {
        console.error('❌ Backup validation failed:', validation.error);
        if (validation.validations) {
          validation.validations.forEach(v => console.log(v));
        }
      }
    }
    break;
    
  case 'validate':
    if (!target) {
      console.error('❌ Please provide a backup name');
      process.exit(1);
    }
    const validation = rollbackSystem.validateRollback(target);
    console.log(`\n🔍 Validation Results for ${target}:`);
    if (validation.valid) {
      console.log('✅ Backup is valid');
    } else {
      console.log('❌ Backup is invalid:', validation.error);
    }
    if (validation.validations) {
      validation.validations.forEach(v => console.log(v));
    }
    break;
    
  default:
    console.log(`
Rollback System

Usage:
  node scripts/rollback.cjs backup [description]     - Create a backup
  node scripts/rollback.cjs list                     - List available backups
  node scripts/rollback.cjs rollback <target>        - Rollback to backup or commit
  node scripts/rollback.cjs validate <backup>        - Validate a backup

Examples:
  node scripts/rollback.cjs backup "Before major changes"
  node scripts/rollback.cjs list
  node scripts/rollback.cjs rollback backup-2024-01-15T10-30-00-000Z
  node scripts/rollback.cjs rollback abc1234
  node scripts/rollback.cjs validate backup-2024-01-15T10-30-00-000Z
`);
} 