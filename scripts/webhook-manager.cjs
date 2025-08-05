#!/usr/bin/env node

/**
 * AZ Interface - Webhook Manager
 * 
 * This system manages automated webhooks for:
 * - Code changes and deployments
 * - Dependency updates
 * - Documentation synchronization
 * - Type checking and validation
 * - Audit reports
 * - Version control integration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chokidar = require('chokidar');

class WebhookManager {
  constructor() {
    this.rootDir = process.cwd();
    this.webhooks = new Map();
    this.watchers = new Map();
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = path.join(this.rootDir, 'webhook-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    // Default configuration
    return {
      enabled: true,
      webhooks: {
        onFileChange: {
          enabled: true,
          patterns: ['src/**/*.{ts,tsx}', 'package.json', 'tsconfig.json'],
          actions: ['type-check', 'audit-imports', 'update-changelog']
        },
        onDependencyUpdate: {
          enabled: true,
          patterns: ['package.json', 'package-lock.json'],
          actions: ['audit-dependencies', 'update-docs']
        },
        onAppAddition: {
          enabled: true,
          patterns: ['src/apps/*.tsx'],
          actions: ['update-registry', 'generate-icon', 'update-docs']
        },
        onServiceAddition: {
          enabled: true,
          patterns: ['src/services/*.ts'],
          actions: ['audit-connections', 'update-types', 'update-docs']
        },
        onDocumentationChange: {
          enabled: true,
          patterns: ['README.md', '*.md'],
          actions: ['validate-links', 'update-index']
        }
      },
      actions: {
        'type-check': {
          command: 'npm run type-check',
          description: 'Run TypeScript type checking'
        },
        'audit-imports': {
          command: 'node scripts/audit-imports.js',
          description: 'Audit import connections'
        },
        'update-changelog': {
          command: 'node scripts/update-changelog.js',
          description: 'Update changelog with recent changes'
        },
        'audit-dependencies': {
          command: 'npm audit',
          description: 'Audit npm dependencies'
        },
        'update-docs': {
          command: 'node scripts/update-docs.js',
          description: 'Update documentation'
        },
        'update-registry': {
          command: 'node scripts/update-app-registry.js',
          description: 'Update app registry'
        },
        'generate-icon': {
          command: 'node scripts/generate-icon.js',
          description: 'Generate icon for new app'
        },
        'audit-connections': {
          command: 'node scripts/audit-service-connections.js',
          description: 'Audit service connections'
        },
        'update-types': {
          command: 'node scripts/update-types.js',
          description: 'Update TypeScript types'
        },
        'validate-links': {
          command: 'node scripts/validate-doc-links.js',
          description: 'Validate documentation links'
        },
        'update-index': {
          command: 'node scripts/update-doc-index.js',
          description: 'Update documentation index'
        }
      }
    };
  }

  async start() {
    console.log('🚀 Starting Webhook Manager...');
    
    if (!this.config.enabled) {
      console.log('⚠️ Webhooks are disabled in configuration');
      return;
    }

    // Register all webhooks
    for (const [name, webhook] of Object.entries(this.config.webhooks)) {
      if (webhook.enabled) {
        await this.registerWebhook(name, webhook);
      }
    }

    console.log('✅ Webhook Manager started successfully');
    console.log(`📡 Active webhooks: ${this.webhooks.size}`);
  }

  async registerWebhook(name, config) {
    console.log(`📡 Registering webhook: ${name}`);
    
    const watcher = chokidar.watch(config.patterns, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', async (filePath) => {
      console.log(`🔄 File changed: ${filePath}`);
      await this.handleFileChange(name, filePath, config.actions);
    });

    watcher.on('add', async (filePath) => {
      console.log(`➕ File added: ${filePath}`);
      await this.handleFileChange(name, filePath, config.actions);
    });

    watcher.on('unlink', async (filePath) => {
      console.log(`➖ File removed: ${filePath}`);
      await this.handleFileChange(name, filePath, config.actions);
    });

    this.watchers.set(name, watcher);
    this.webhooks.set(name, config);
  }

  async handleFileChange(webhookName, filePath, actions) {
    console.log(`🎯 Processing ${webhookName} webhook for ${filePath}`);
    
    const results = [];
    
    for (const action of actions) {
      try {
        const result = await this.executeAction(action, filePath);
        results.push({ action, success: true, result });
      } catch (error) {
        console.error(`❌ Action ${action} failed:`, error.message);
        results.push({ action, success: false, error: error.message });
      }
    }

    // Log results
    await this.logWebhookEvent(webhookName, filePath, actions, results);
    
    // Trigger additional actions based on file type
    await this.triggerContextualActions(filePath, results);
  }

  async executeAction(actionName, filePath) {
    const action = this.config.actions[actionName];
    if (!action) {
      throw new Error(`Unknown action: ${actionName}`);
    }

    console.log(`⚡ Executing action: ${actionName}`);
    
    try {
      const result = execSync(action.command, { 
        encoding: 'utf8',
        cwd: this.rootDir,
        env: { ...process.env, TRIGGERED_FILE: filePath }
      });
      
      return result;
    } catch (error) {
      throw new Error(`Action ${actionName} failed: ${error.message}`);
    }
  }

  async triggerContextualActions(filePath, previousResults) {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);
    
    // Contextual actions based on file type
    if (ext === '.tsx' && fileName.includes('App.tsx')) {
      await this.handleAppFileChange(filePath);
    } else if (ext === '.ts' && filePath.includes('/services/')) {
      await this.handleServiceFileChange(filePath);
    } else if (fileName === 'package.json') {
      await this.handlePackageJsonChange(filePath);
    } else if (ext === '.md') {
      await this.handleDocumentationChange(filePath);
    }
  }

  async handleAppFileChange(filePath) {
    console.log(`📱 Processing app file change: ${filePath}`);
    
    // Check if app is registered in constants
    const appName = path.basename(filePath, '.tsx');
    const constantsPath = path.join(this.rootDir, 'src/constants/constants.tsx');
    
    if (fs.existsSync(constantsPath)) {
      const content = fs.readFileSync(constantsPath, 'utf8');
      if (!content.includes(appName)) {
        console.log(`⚠️ App ${appName} not found in registry, triggering registration`);
        await this.executeAction('update-registry', filePath);
      }
    }
  }

  async handleServiceFileChange(filePath) {
    console.log(`🔌 Processing service file change: ${filePath}`);
    
    // Check for import issues
    const content = fs.readFileSync(filePath, 'utf8');
    const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
    
    if (importMatches) {
      for (const match of importMatches) {
        const importPath = match.match(/from\s+['"]([^'"]+)['"]/)[1];
        if (importPath.startsWith('.')) {
          const resolvedPath = this.resolveImportPath(filePath, importPath);
          if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.ts')) {
            console.log(`⚠️ Import issue detected: ${importPath}`);
            await this.executeAction('audit-connections', filePath);
            break;
          }
        }
      }
    }
  }

  async handlePackageJsonChange(filePath) {
    console.log(`📦 Processing package.json change: ${filePath}`);
    
    // Check for new dependencies
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    
    // Trigger dependency audit
    await this.executeAction('audit-dependencies', filePath);
    
    // Update documentation if dependencies changed
    await this.executeAction('update-docs', filePath);
  }

  async handleDocumentationChange(filePath) {
    console.log(`📚 Processing documentation change: ${filePath}`);
    
    // Validate links in documentation
    await this.executeAction('validate-links', filePath);
    
    // Update documentation index
    await this.executeAction('update-index', filePath);
  }

  async logWebhookEvent(webhookName, filePath, actions, results) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      webhook: webhookName,
      file: filePath,
      actions,
      results,
      success: results.every(r => r.success)
    };

    const logPath = path.join(this.rootDir, 'webhook-logs.json');
    let logs = [];
    
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    
    logs.push(logEntry);
    
    // Keep only last 100 entries
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }
    
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  }

  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    return path.resolve(fromDir, importPath);
  }

  async stop() {
    console.log('🛑 Stopping Webhook Manager...');
    
    for (const [name, watcher] of this.watchers) {
      console.log(`📡 Stopping webhook: ${name}`);
      await watcher.close();
    }
    
    this.watchers.clear();
    this.webhooks.clear();
    
    console.log('✅ Webhook Manager stopped');
  }

  getStatus() {
    return {
      enabled: this.config.enabled,
      activeWebhooks: this.webhooks.size,
      webhooks: Array.from(this.webhooks.keys()),
      config: this.config
    };
  }
}

// CLI interface
if (require.main === module) {
  const manager = new WebhookManager();
  
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down...');
    await manager.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    await manager.stop();
    process.exit(0);
  });
  
  manager.start().catch(console.error);
}

module.exports = WebhookManager; 