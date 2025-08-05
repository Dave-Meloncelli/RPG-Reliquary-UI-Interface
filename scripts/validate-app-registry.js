#!/usr/bin/env node

/**
 * App Registry Validator
 * 
 * Validates that all apps in the registry have corresponding component files
 * Ensures naming conventions are consistent
 */

const fs = require('fs');
const path = require('path');

class AppRegistryValidator {
  constructor() {
    this.rootDir = process.cwd();
    this.constantsPath = path.join(this.rootDir, 'src/constants/constants.tsx');
    this.appsDir = path.join(this.rootDir, 'src/apps');
    this.errors = [];
    this.warnings = [];
  }

  validateAppRegistry() {
    console.log('📱 Validating app registry...');
    
    if (!fs.existsSync(this.constantsPath)) {
      this.errors.push('App registry file not found: src/constants/constants.tsx');
      this.reportResults();
      return;
    }

    if (!fs.existsSync(this.appsDir)) {
      this.errors.push('Apps directory not found: src/apps');
      this.reportResults();
      return;
    }

    const registeredApps = this.getRegisteredApps();
    const appFiles = this.getAppFiles();
    
    console.log(`📋 Found ${registeredApps.length} registered apps`);
    console.log(`📁 Found ${appFiles.length} app component files`);

    this.validateAppFiles(registeredApps, appFiles);
    this.validateAppRegistry(registeredApps, appFiles);
    this.validateNamingConventions(registeredApps, appFiles);
    this.validateAppIcons(registeredApps);

    this.reportResults();
  }

  getRegisteredApps() {
    try {
      const content = fs.readFileSync(this.constantsPath, 'utf8');
      const appMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
      
      if (!appMatches) return [];
      
      return appMatches.map(match => {
        const appId = match.match(/['"]([^'"]+)['"]/)[1];
        return {
          id: appId,
          expectedFile: this.kebabToPascal(appId) + 'App.tsx',
          expectedPath: path.join(this.appsDir, this.kebabToPascal(appId) + 'App.tsx')
        };
      });
    } catch (error) {
      this.errors.push(`Failed to read app registry: ${error.message}`);
      return [];
    }
  }

  getAppFiles() {
    try {
      const files = fs.readdirSync(this.appsDir)
        .filter(file => file.endsWith('App.tsx'))
        .map(file => ({
          name: file,
          path: path.join(this.appsDir, file),
          appId: this.pascalToKebab(file.replace('App.tsx', ''))
        }));
      
      return files;
    } catch (error) {
      this.errors.push(`Failed to read apps directory: ${error.message}`);
      return [];
    }
  }

  validateAppFiles(registeredApps, appFiles) {
    // Check if each registered app has a corresponding file
    for (const app of registeredApps) {
      const fileExists = appFiles.some(file => file.name === app.expectedFile);
      
      if (!fileExists) {
        this.errors.push({
          type: 'missing-app-file',
          appId: app.id,
          expectedFile: app.expectedFile,
          message: `App ${app.id} registered but file ${app.expectedFile} not found`
        });
      }
    }

    // Check if each app file is registered
    for (const file of appFiles) {
      const isRegistered = registeredApps.some(app => app.id === file.appId);
      
      if (!isRegistered) {
        this.warnings.push({
          type: 'unregistered-app-file',
          file: file.name,
          appId: file.appId,
          message: `App file ${file.name} exists but not registered in constants`
        });
      }
    }
  }

  validateAppRegistry(registeredApps, appFiles) {
    // Check for duplicate app IDs
    const appIds = registeredApps.map(app => app.id);
    const duplicates = appIds.filter((id, index) => appIds.indexOf(id) !== index);
    
    if (duplicates.length > 0) {
      this.errors.push({
        type: 'duplicate-app-ids',
        duplicates,
        message: `Duplicate app IDs found: ${duplicates.join(', ')}`
      });
    }

    // Check for duplicate file names
    const fileNames = appFiles.map(file => file.name);
    const duplicateFiles = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
    
    if (duplicateFiles.length > 0) {
      this.errors.push({
        type: 'duplicate-app-files',
        duplicates: duplicateFiles,
        message: `Duplicate app files found: ${duplicateFiles.join(', ')}`
      });
    }
  }

  validateNamingConventions(registeredApps, appFiles) {
    // Check app ID naming conventions (should be kebab-case)
    for (const app of registeredApps) {
      if (!this.isValidKebabCase(app.id)) {
        this.warnings.push({
          type: 'invalid-app-id-format',
          appId: app.id,
          message: `App ID should be kebab-case: ${app.id}`
        });
      }
    }

    // Check file naming conventions (should be PascalCase + App.tsx)
    for (const file of appFiles) {
      const componentName = file.name.replace('App.tsx', '');
      if (!this.isValidPascalCase(componentName)) {
        this.warnings.push({
          type: 'invalid-file-name-format',
          file: file.name,
          componentName,
          message: `Component name should be PascalCase: ${componentName}`
        });
      }
    }
  }

  validateAppIcons(registeredApps) {
    try {
      const content = fs.readFileSync(this.constantsPath, 'utf8');
      
      for (const app of registeredApps) {
        // Check if app has an icon defined
        const iconPattern = new RegExp(`id:\\s*['"]${app.id}['"][\\s\\S]*?icon:\\s*([^,}\\s]+)`, 'g');
        const iconMatch = content.match(iconPattern);
        
        if (!iconMatch) {
          this.warnings.push({
            type: 'missing-app-icon',
            appId: app.id,
            message: `App ${app.id} has no icon defined`
          });
        }
      }
    } catch (error) {
      this.warnings.push({
        type: 'icon-validation-error',
        message: `Failed to validate app icons: ${error.message}`
      });
    }
  }

  isValidKebabCase(str) {
    return /^[a-z][a-z0-9-]*[a-z0-9]$/.test(str);
  }

  isValidPascalCase(str) {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }

  kebabToPascal(str) {
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
  }

  pascalToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  reportResults() {
    console.log('\n📊 App Registry Validation Results:');
    console.log('===================================');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ App registry is synchronized!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Found ${this.errors.length} registry errors:`);
      
      const errorTypes = {};
      this.errors.forEach(error => {
        if (typeof error === 'string') {
          console.log(`  ❌ ${error}`);
        } else {
          if (!errorTypes[error.type]) errorTypes[error.type] = 0;
          errorTypes[error.type]++;
          
          console.log(`  📱 ${error.appId || error.file || 'Unknown'}`);
          console.log(`     Type: ${error.type}`);
          console.log(`     Message: ${error.message}`);
          if (error.expectedFile) console.log(`     Expected: ${error.expectedFile}`);
          console.log('');
        }
      });

      if (Object.keys(errorTypes).length > 0) {
        console.log('Error Summary:');
        Object.entries(errorTypes).forEach(([type, count]) => {
          console.log(`  - ${type}: ${count}`);
        });
      }
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️ Found ${this.warnings.length} registry warnings:`);
      
      const warningTypes = {};
      this.warnings.forEach(warning => {
        if (!warningTypes[warning.type]) warningTypes[warning.type] = 0;
        warningTypes[warning.type]++;
        
        console.log(`  📱 ${warning.appId || warning.file || 'Unknown'}`);
        console.log(`     Type: ${warning.type}`);
        console.log(`     Message: ${warning.message}`);
        if (warning.expectedFile) console.log(`     Expected: ${warning.expectedFile}`);
        console.log('');
      });

      console.log('Warning Summary:');
      Object.entries(warningTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    }

    // Exit with error code if there are errors
    if (this.errors.length > 0) {
      console.log('\n❌ App registry validation failed. Please fix the errors above.');
      process.exit(1);
    }
  }
}

// Run validation
const validator = new AppRegistryValidator();
validator.validateAppRegistry(); 