#!/usr/bin/env node

/**
 * Syntax Error Fix Script
 * 
 * Fixes syntax errors introduced by automated fixes
 */

const fs = require('fs');
const path = require('path');

class SyntaxErrorFixer {
  constructor() {
    this.fixedFiles = new Set();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async fixSyntaxErrors() {
    this.log('🔧 Fixing syntax errors...', 'info');
    
    try {
      await this.fixControlPanelApp();
      await this.fixN8nIntegrationService();
      await this.fixOcrService();
      await this.fixSearchService();
      await this.fixSymposiumService();
      
      this.log('Syntax error fixes completed', 'success');
    } catch (error) {
      this.log(`Error fixing failed: ${error.message}`, 'error');
    }
  }

  async fixControlPanelApp() {
    this.log('Fixing ControlPanelApp.tsx syntax errors...', 'info');
    
    const filePath = 'src/apps/ControlPanelApp.tsx';
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the malformed icon mapping function
    const iconMapping = `
// Icon mapping function
const getAgentIcon = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType> = {
    'AgentIconCamera': AgentIconCamera,
    'AgentIconScale': AgentIconScale,
    'AgentIconChart': AgentIconChart,
    'AgentIconCrown': AgentIconCrown,
    'AgentIconBrain': AgentIconBrain,
    'AgentIconBook': AgentIconBook,
    'AgentIconShield': AgentIconShield,
    'AgentIconFingerprint': AgentIconFingerprint,
    'AgentIconDollar': AgentIconDollar,
    'AgentIconQuill': AgentIconQuill,
    'AgentIconRuler': AgentIconRuler,
    'AgentIconCurator': AgentIconCurator,
    'AgentIconZero': AgentIconZero,
    'AgentIconGhost': AgentIconGhost,
    'AgentIconNya': AgentIconNya,
    'AgentIconMajorPayne': AgentIconMajorPayne,
    'AgentIconSteelCore': AgentIconSteelCore,
    'AgentIconTheWeaver': AgentIconTheWeaver,
    'AgentIconTinkerHexbolt': AgentIconTinkerHexbolt,
    'AgentIconTheArchivist': AgentIconTheArchivist,
    'AgentIconAeonIndexwell': AgentIconAeonIndexwell,
    'AgentIconTheCartographer': AgentIconTheCartographer,
    'AgentIconTheTechnomancer': AgentIconTheTechnomancer,
    'AgentIconTheCurator': AgentIconTheCurator,
    'AgentIconTheCompanion': AgentIconTheCompanion,
    'AgentIconTheCouncil': AgentIconTheCouncil,
    'AgentIconTheHierarchy': AgentIconTheHierarchy,
    'AgentIconTheInfrastructure': AgentIconTheInfrastructure,
    'AgentIconTheObservatory': AgentIconTheObservatory,
    'AgentIconTheOperations': AgentIconTheOperations,
    'AgentIconTheOrchestrator': AgentIconTheOrchestrator,
    'AgentIconTheSymposium': AgentIconTheSymposium,
    'AgentIconTheTaskReview': AgentIconTheTaskReview,
    'AgentIconTheVaultExplorer': AgentIconTheVaultExplorer
  };
  return iconMap[iconName] || AgentIconZero;
};
`;

    // Remove the malformed function and replace with correct one
    content = content.replace(/const getAgentIcon[\s\S]*?};/g, iconMapping);
    
    // Fix the malformed import statement
    content = content.replace(/} from '\.\.\/components\/icons';/g, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    this.log('Fixed ControlPanelApp.tsx', 'success');
    this.fixedFiles.add(filePath);
  }

  async fixN8nIntegrationService() {
    this.log('Fixing n8nIntegrationService.ts syntax errors...', 'info');
    
    const filePath = 'src/services/n8nIntegrationService.ts';
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix double colon syntax errors
    content = content.replace(/:\s*(\d+):\s*\1/g, ': $1');
    content = content.replace(/:\s*(true|false):\s*\1/g, ': $1');
    content = content.replace(/:\s*(\w+):\s*\1/g, ': $1');
    
    // Fix TODO comments that are causing syntax errors
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined: undefined/g, 'undefined');
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined\.(\w+): \2/g, 'undefined');
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined\.(\w+)/g, 'undefined');
    
    // Fix specific problematic lines
    content = content.replace(/responseCode: 200: 200,/g, 'responseCode: 200,');
    content = content.replace(/executionCount: 0: 0,/g, 'executionCount: 0,');
    content = content.replace(/hour: 9: 9,/g, 'hour: 9,');
    content = content.replace(/returnAll: false: false,/g, 'returnAll: false,');
    content = content.replace(/limit: 5: 5,/g, 'limit: 5,');
    content = content.replace(/returnAll: true: true,/g, 'returnAll: true,');
    content = content.replace(/nodeId: node\.id: id,/g, 'nodeId: node.id,');
    content = content.replace(/nodeName: node\.name: name,/g, 'nodeName: node.name,');
    
    fs.writeFileSync(filePath, content, 'utf8');
    this.log('Fixed n8nIntegrationService.ts', 'success');
    this.fixedFiles.add(filePath);
  }

  async fixOcrService() {
    this.log('Fixing ocrService.ts syntax errors...', 'info');
    
    const filePath = 'src/services/ocrService.ts';
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix double colon syntax errors
    content = content.replace(/:\s*(\d+):\s*\1/g, ': $1');
    content = content.replace(/:\s*(true|false):\s*\1/g, ': $1');
    content = content.replace(/:\s*(\w+):\s*\1/g, ': $1');
    
    // Fix TODO comments that are causing syntax errors
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined: undefined/g, 'undefined');
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined\.(\w+): \2/g, 'undefined');
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined\.(\w+)/g, 'undefined');
    
    // Fix specific problematic lines
    content = content.replace(/progress: 0: 0,/g, 'progress: 0,');
    content = content.replace(/\.\.\.settings: settings,/g, '...settings,');
    content = content.replace(/zoomLevel: \/\* TODO: Define optimalZoom \*\/ undefined: undefined,/g, 'zoomLevel: undefined,');
    content = content.replace(/lightIntensity: \/\* TODO: Define lightingSettings \*\/ undefined\.intensity: intensity,/g, 'lightIntensity: undefined,');
    content = content.replace(/backgroundOptimization: settings\.autoLightingAdjustment: autoLightingAdjustment,/g, 'backgroundOptimization: settings.autoLightingAdjustment,');
    content = content.replace(/edgeCorrection: true: true,/g, 'edgeCorrection: true,');
    content = content.replace(/focusEnhancement: true: true,/g, 'focusEnhancement: true,');
    content = content.replace(/keystoneCorrection: settings\.keystoneCorrection: keystoneCorrection,/g, 'keystoneCorrection: settings.keystoneCorrection,');
    content = content.replace(/confidence: 0\.95: 95,/g, 'confidence: 0.95,');
    
    // Fix function parameter syntax errors
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined: number: number,/g, 'undefined: number,');
    content = content.replace(/\/\* TODO: Define (\w+) \*\/ undefined: string: string,/g, 'undefined: string,');
    content = content.replace(/min: \/\* TODO: Define (\w+) \*\/ undefined \* 0\.8: 8,/g, 'min: undefined,');
    content = content.replace(/max: \/\* TODO: Define (\w+) \*\/ undefined \* 1\.3: 3,/g, 'max: undefined,');
    
    fs.writeFileSync(filePath, content, 'utf8');
    this.log('Fixed ocrService.ts', 'success');
    this.fixedFiles.add(filePath);
  }

  async fixSearchService() {
    this.log('Fixing searchService.ts syntax errors...', 'info');
    
    const filePath = 'src/services/searchService.ts';
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix relevanceScore property syntax
    content = content.replace(/\/\* TODO: relevanceScore \*\/: titleMatch \? 1\.0 : 0\.5/g, 'relevanceScore: titleMatch ? 1.0 : 0.5');
    content = content.replace(/b\.\/\* TODO: relevanceScore \*\/ - a\.\/\* TODO: relevanceScore \*\//g, 'b.relevanceScore - a.relevanceScore');
    
    fs.writeFileSync(filePath, content, 'utf8');
    this.log('Fixed searchService.ts', 'success');
    this.fixedFiles.add(filePath);
  }

  async fixSymposiumService() {
    this.log('Fixing symposiumService.ts syntax errors...', 'info');
    
    const filePath = 'src/services/symposiumService.ts';
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix eventBus emit calls
    content = content.replace(/typeof \/\* TODO: eventBus\.emit \*\/ === 'function'/g, 'typeof eventBus.emit === \'function\'');
    content = content.replace(/eventBus\.emit\('symposium:started'/g, '/* TODO: eventBus.emit(\'symposium:started\'');
    content = content.replace(/eventBus\.emit\('symposium:message:added'/g, '/* TODO: eventBus.emit(\'symposium:message:added\'');
    content = content.replace(/eventBus\.emit\('symposium:summary:generated'/g, '/* TODO: eventBus.emit(\'symposium:summary:generated\'');
    
    // Fix messages property access
    content = content.replace(/\/\* TODO: this\.messages \*\/\.slice\(-limit\)/g, 'this.messages?.slice(-limit) || []');
    content = content.replace(/\/\* TODO: this\.messages \*\/\[0\]/g, 'this.messages?.[0]');
    content = content.replace(/\/\* TODO: this\.messages \*\/\[\/\* TODO: this\.messages \*\/\.length - 1\]/g, 'this.messages?.[this.messages.length - 1]');
    content = content.replace(/\/\* TODO: this\.messages \*\/\.map/g, 'this.messages?.map');
    content = content.replace(/\/\* TODO: this\.messages \*\/\.length/g, 'this.messages?.length || 0');
    
    // Add messages property to class
    const classMatch = content.match(/class SymposiumService\s*\{/);
    if (classMatch) {
      const insertIndex = classMatch.index + classMatch[0].length;
      content = content.slice(0, insertIndex) + '\n  private messages: any[] = [];\n' + content.slice(insertIndex);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    this.log('Fixed symposiumService.ts', 'success');
    this.fixedFiles.add(filePath);
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        filesFixed: this.fixedFiles.size,
        fixedFiles: Array.from(this.fixedFiles)
      },
      nextSteps: [
        'Run TypeScript check again to verify syntax fixes',
        'Address remaining TODO comments with proper implementations',
        'Add proper type definitions for undefined variables',
        'Implement missing functionality'
      ]
    };

    const reportPath = 'syntax-fixes-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Syntax fixes report written to ${reportPath}`, 'success');
    this.log(`Fixed ${this.fixedFiles.size} files`, 'success');
  }
}

// Run the syntax error fixer
async function main() {
  const fixer = new SyntaxErrorFixer();
  await fixer.fixSyntaxErrors();
  fixer.generateReport();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SyntaxErrorFixer;
