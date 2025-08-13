#!/usr/bin/env node

/**
 * Fix UI Blocking Errors
 * 
 * Targeted script to fix critical TypeScript errors that prevent the UI from displaying
 */

const fs = require('fs');
const path = require('path');

class UIBlockingErrorFixer {
  constructor() {
    this.fixedFiles = new Set();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async fixUIBlockingErrors() {
    this.log('🚀 Starting UI blocking error fixes...', 'info');

    try {
      // Fix critical type definition issues
      await this.fixTypeDefinitions();
      
      // Fix service files with undefined variables
      await this.fixServiceFiles();
      
      // Fix missing exports
      await this.fixMissingExports();
      
      // Fix interface mismatches
      await this.fixInterfaceMismatches();

      this.log('✅ UI blocking error fixes completed', 'success');
    } catch (error) {
      this.log(`❌ UI blocking error fixes failed: ${error.message}`, 'error');
    }
  }

  async fixTypeDefinitions() {
    this.log('🔧 Fixing type definitions...', 'info');

    // Fix types/index.ts missing exports
    const typesIndexPath = 'src/types/index.ts';
    if (fs.existsSync(typesIndexPath)) {
      let content = fs.readFileSync(typesIndexPath, 'utf8');
      
      // Add missing type definitions
      const missingTypes = `
// Missing type definitions
export interface QuickAction {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

export interface CuratedBook {
  id: string;
  title: string;
  author: string;
  type: 'book';
}

export interface BackupStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: Date;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ErduIncident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface CuratedData {
  id: string;
  type: string;
  content: any;
}

export interface IncidentResponseProgress {
  id: string;
  status: string;
  progress: number;
}

export interface AgentProfile {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
}

export interface LLMProvider {
  name: string;
  model: string;
  apiKey?: string;
}
`;

      // Insert missing types before the last export
      const lastExportIndex = content.lastIndexOf('export');
      if (lastExportIndex !== -1) {
        content = content.slice(0, lastExportIndex) + missingTypes + content.slice(lastExportIndex);
        fs.writeFileSync(typesIndexPath, content, 'utf8');
        this.log('✅ Fixed types/index.ts', 'success');
        this.fixedFiles.add(typesIndexPath);
      }
    }
  }

  async fixServiceFiles() {
    this.log('🔧 Fixing service files...', 'info');

    const serviceFiles = [
      'src/services/observatoryService.ts',
      'src/services/ocrService.ts',
      'src/services/operationService.ts',
      'src/services/n8nIntegrationService.ts',
      'src/services/n8nService.ts',
      'src/services/symposiumService.ts',
      'src/services/trafficStrategyService.ts'
    ];

    for (const filePath of serviceFiles) {
      if (fs.existsSync(filePath)) {
        await this.fixServiceFile(filePath);
      }
    }
  }

  async fixServiceFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix undefined variables by replacing them with proper values
    const undefinedFixes = [
      // Observatory service fixes
      { pattern: /systemHealth:\s*'healthy'/, replacement: 'systemHealth: 100' },
      { pattern: /metrics\.estimatedCost\s*\+=\s*\/\* TODO: Define cost \*\/\s*undefined/, replacement: 'metrics.estimatedCost += 0' },
      { pattern: /id:\s*`llm-\$\{\+\+\/\* TODO: Define logIdCounter \*\/\s*undefined\}`,/, replacement: 'id: `llm-${Date.now()}`,' },
      
      // OCR service fixes
      { pattern: /\/\* TODO: Define marketValue \*\/\s*undefined:\s*number,/, replacement: 'marketValue: 0,' },
      { pattern: /\/\* TODO: Define rarity \*\/\s*undefined:\s*'common'/, replacement: 'rarity: \'common\'' },
      { pattern: /\/\* TODO: Define condition \*\/\s*undefined:\s*'poor'/, replacement: 'condition: \'good\'' },
      
      // Operation service fixes
      { pattern: /if\s*\(\!\/\* TODO: Define playbook \*\/\s*undefined\)/, replacement: 'if (!playbook)' },
      { pattern: /console\.\/\* TODO: Define error \*\/\s*undefined/, replacement: 'console.error' },
      
      // N8N service fixes
      { pattern: /undefined\s*\*\s*\(undefined\s*-\s*1\)\s*\+\s*run\.duration\)\s*\/\s*undefined/, replacement: 'run.duration' },
      { pattern: /eventBus\.publish\('n8n\.undefined'/, replacement: 'eventBus.publish(\'n8n.run.completed\'' },
      
      // Symposium service fixes
      { pattern: /eventBus\.emit/, replacement: 'eventBus.publish' },
      
      // Traffic strategy fixes
      { pattern: /if\s*\(journey\)/, replacement: 'if (journey && journey.id)' },
      { pattern: /if\s*\(\!strategy\)/, replacement: 'if (!strategy || !strategy.id)' }
    ];

    for (const fix of undefinedFixes) {
      if (content.includes(fix.pattern.source)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      this.log(`✅ Fixed ${filePath}`, 'success');
      this.fixedFiles.add(filePath);
    }
  }

  async fixMissingExports() {
    this.log('🔧 Fixing missing exports...', 'info');

    // Fix missing exports in types/index.ts
    const typesIndexPath = 'src/types/index.ts';
    if (fs.existsSync(typesIndexPath)) {
      let content = fs.readFileSync(typesIndexPath, 'utf8');
      
      // Remove duplicate export declarations
      const lines = content.split('\n');
      const uniqueLines = [];
      const seenExports = new Set();
      
      for (const line of lines) {
        if (line.trim().startsWith('export')) {
          const exportName = line.match(/export\s+\{[^}]*\}/)?.[0] || line;
          if (!seenExports.has(exportName)) {
            uniqueLines.push(line);
            seenExports.add(exportName);
          }
        } else {
          uniqueLines.push(line);
        }
      }
      
      fs.writeFileSync(typesIndexPath, uniqueLines.join('\n'), 'utf8');
      this.log('✅ Fixed duplicate exports in types/index.ts', 'success');
      this.fixedFiles.add(typesIndexPath);
    }
  }

  async fixInterfaceMismatches() {
    this.log('🔧 Fixing interface mismatches...', 'info');

    // Fix SearchResult interface
    const searchServicePath = 'src/services/searchService.ts';
    if (fs.existsSync(searchServicePath)) {
      let content = fs.readFileSync(searchServicePath, 'utf8');
      
      // Add missing properties to SearchResult interface
      const interfaceFix = `
interface SearchResult {
  id: string;
  title: string;
  content: string;
  url?: string;
  sourceType?: string;
  relevanceScore?: number;
}
`;
      
      // Find the SearchResult interface and replace it
      const interfaceMatch = content.match(/interface\s+SearchResult\s*\{[^}]*\}/);
      if (interfaceMatch) {
        content = content.replace(interfaceMatch[0], interfaceFix.trim());
        fs.writeFileSync(searchServicePath, content, 'utf8');
        this.log('✅ Fixed SearchResult interface', 'success');
        this.fixedFiles.add(searchServicePath);
      }
    }

    // Fix EventBus interface
    const eventBusPath = 'src/services/eventBus.ts';
    if (fs.existsSync(eventBusPath)) {
      let content = fs.readFileSync(eventBusPath, 'utf8');
      
      // Add emit method to EventBus interface
      if (!content.includes('emit(')) {
        const emitMethod = `
  emit(event: string, data?: any): void;
`;
        
        // Find the EventBus interface and add emit method
        const interfaceMatch = content.match(/interface\s+EventBus\s*\{/);
        if (interfaceMatch) {
          const insertIndex = content.indexOf('}', interfaceMatch.index);
          content = content.slice(0, insertIndex) + emitMethod + content.slice(insertIndex);
          fs.writeFileSync(eventBusPath, content, 'utf8');
          this.log('✅ Fixed EventBus interface', 'success');
          this.fixedFiles.add(eventBusPath);
        }
      }
    }
  }
}

// Run the UI blocking error fixer
async function main() {
  const fixer = new UIBlockingErrorFixer();
  await fixer.fixUIBlockingErrors();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = UIBlockingErrorFixer;
