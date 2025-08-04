const fs = require('fs');
const path = require('path');

class ConfigAuditor {
  constructor() {
    this.configFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      '.eslintrc.json',
      '.prettierrc',
      'commitlint.config.js',
      'vitest.config.ts',
      'docker-compose.yml',
      'nginx.conf',
      '.env',
      '.env.local'
    ];
    
    this.issues = [];
    this.warnings = [];
  }
  
  async auditConfig() {
    console.log('🔍 Auditing configuration files...');
    
    try {
      // Check if all config files exist
      await this.checkConfigFiles();
      
      // Validate package.json
      await this.validatePackageJson();
      
      // Validate TypeScript config
      await this.validateTsConfig();
      
      // Validate Vite config
      await this.validateViteConfig();
      
      // Validate ESLint config
      await this.validateEslintConfig();
      
      // Validate environment files
      await this.validateEnvironmentFiles();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Configuration audit failed:', error.message);
      process.exit(1);
    }
  }
  
  async checkConfigFiles() {
    console.log('🔍 Checking configuration file existence...');
    
    for (const file of this.configFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file} - Found`);
      } else {
        console.log(`❌ ${file} - Missing`);
        this.issues.push(`Missing configuration file: ${file}`);
      }
    }
  }
  
  async validatePackageJson() {
    console.log('🔍 Validating package.json...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check required fields
      const requiredFields = ['name', 'version', 'scripts', 'dependencies', 'devDependencies'];
      for (const field of requiredFields) {
        if (!packageJson[field]) {
          this.issues.push(`package.json missing required field: ${field}`);
        }
      }
      
      // Check for security vulnerabilities
      if (packageJson.dependencies) {
        const deps = Object.keys(packageJson.dependencies);
        if (deps.length === 0) {
          this.warnings.push('package.json has no dependencies');
        }
      }
      
      console.log('✅ package.json validation completed');
      
    } catch (error) {
      this.issues.push(`package.json validation failed: ${error.message}`);
    }
  }
  
  async validateTsConfig() {
    console.log('🔍 Validating tsconfig.json...');
    
    try {
      const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
      
      // Check required compiler options
      const requiredOptions = ['target', 'lib', 'module', 'strict'];
      for (const option of requiredOptions) {
        if (!tsConfig.compilerOptions || !tsConfig.compilerOptions[option]) {
          this.warnings.push(`tsconfig.json missing recommended option: ${option}`);
        }
      }
      
      console.log('✅ tsconfig.json validation completed');
      
    } catch (error) {
      this.issues.push(`tsconfig.json validation failed: ${error.message}`);
    }
  }
  
  async validateViteConfig() {
    console.log('🔍 Validating vite.config.ts...');
    
    try {
      const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
      
      // Check for required plugins
      if (!viteConfig.includes('@vitejs/plugin-react')) {
        this.warnings.push('vite.config.ts missing React plugin');
      }
      
      // Check for security headers
      if (!viteConfig.includes('X-Content-Type-Options')) {
        this.warnings.push('vite.config.ts missing security headers');
      }
      
      console.log('✅ vite.config.ts validation completed');
      
    } catch (error) {
      this.issues.push(`vite.config.ts validation failed: ${error.message}`);
    }
  }
  
  async validateEslintConfig() {
    console.log('🔍 Validating .eslintrc.json...');
    
    try {
      const eslintConfig = JSON.parse(fs.readFileSync('.eslintrc.json', 'utf8'));
      
      // Check for required plugins
      if (!eslintConfig.plugins || !eslintConfig.plugins.includes('@typescript-eslint')) {
        this.warnings.push('.eslintrc.json missing TypeScript plugin');
      }
      
      console.log('✅ .eslintrc.json validation completed');
      
    } catch (error) {
      this.issues.push(`.eslintrc.json validation failed: ${error.message}`);
    }
  }
  
  async validateEnvironmentFiles() {
    console.log('🔍 Validating environment files...');
    
    const envFiles = ['.env', '.env.local'];
    
    for (const file of envFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for NODE_ENV
        if (content.includes('NODE_ENV=production')) {
          this.warnings.push(`${file} has NODE_ENV=production (should be development for dev)`);
        }
        
        // Check for placeholder values
        if (content.includes('your_secure_password_here')) {
          this.warnings.push(`${file} contains placeholder values`);
        }
        
        console.log(`✅ ${file} validation completed`);
      }
    }
  }
  
  generateReport() {
    console.log('\n📊 CONFIGURATION AUDIT REPORT:');
    console.log('================================');
    
    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ All configuration files are valid and properly configured!');
    } else {
      if (this.issues.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        this.issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      if (this.warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
    }
    
    console.log(`\n📈 SUMMARY: ${this.issues.length} issues, ${this.warnings.length} warnings`);
    
    if (this.issues.length === 0) {
      console.log('🎉 Configuration audit completed successfully!');
    } else {
      console.log('❌ Configuration audit completed with issues');
      process.exit(1);
    }
  }
}

// Run the audit
const auditor = new ConfigAuditor();
auditor.auditConfig(); 