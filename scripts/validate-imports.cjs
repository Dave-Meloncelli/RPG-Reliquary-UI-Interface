#!/usr/bin/env node

/**
 * Import Path Validator
 * 
 * Enforces relative import paths as per internal/code_style_guide.md
 * Validates that all imports use relative paths (./ or ../) or @/ aliases
 */

const fs = require('fs');
const path = require('path');

class ImportValidator {
  constructor() {
    this.rootDir = process.cwd();
    this.srcDir = path.join(this.rootDir, 'src');
    this.errors = [];
    this.warnings = [];
  }

  validateRelativeImports() {
    console.log('🔗 Validating import paths...');
    
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
      const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
      
      if (!importMatches) return;

      for (const match of importMatches) {
        const importPath = match.match(/from\s+['"]([^'"]+)['"]/)[1];
        this.validateImportPath(filePath, importPath, match);
      }
    } catch (error) {
      this.errors.push(`Failed to read ${filePath}: ${error.message}`);
    }
  }

  validateImportPath(filePath, importPath, fullMatch) {
    const relativePath = path.relative(this.rootDir, filePath);
    
    // Skip node_modules and external packages
    if (importPath.startsWith('@types/') || 
        importPath.startsWith('react') ||
        importPath.startsWith('lucide-react') ||
        importPath.startsWith('@google/') ||
        importPath.startsWith('arktype') ||
        importPath.startsWith('chokidar')) {
      return;
    }

    // Check for non-relative imports
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      this.errors.push({
        file: relativePath,
        import: importPath,
        fullMatch,
        type: 'non-relative'
      });
      return;
    }

    // Validate relative import resolution
    if (importPath.startsWith('.')) {
      this.validateRelativeImportResolution(filePath, importPath, relativePath);
    }

    // Validate @/ alias usage
    if (importPath.startsWith('@/')) {
      this.validateAliasImport(filePath, importPath, relativePath);
    }
  }

  validateRelativeImportResolution(filePath, importPath, relativePath) {
    try {
      const resolvedPath = this.resolveImportPath(filePath, importPath);
      
      // Check if file exists
      if (!fs.existsSync(resolvedPath) && 
          !fs.existsSync(resolvedPath + '.ts') && 
          !fs.existsSync(resolvedPath + '.tsx') &&
          !fs.existsSync(resolvedPath + '/index.ts') &&
          !fs.existsSync(resolvedPath + '/index.tsx')) {
        
        this.errors.push({
          file: relativePath,
          import: importPath,
          resolvedPath: path.relative(this.rootDir, resolvedPath),
          type: 'unresolvable'
        });
      }
    } catch (error) {
      this.errors.push({
        file: relativePath,
        import: importPath,
        error: error.message,
        type: 'resolution-error'
      });
    }
  }

  validateAliasImport(filePath, importPath, relativePath) {
    // Check if @/ alias is properly configured
    const tsconfigPath = path.join(this.rootDir, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath)) {
      this.warnings.push({
        file: relativePath,
        import: importPath,
        message: 'tsconfig.json not found for @/ alias validation'
      });
      return;
    }

    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      const paths = tsconfig.compilerOptions?.paths;
      
      if (!paths || !paths['@/*']) {
        this.errors.push({
          file: relativePath,
          import: importPath,
          type: 'alias-not-configured'
        });
      }
    } catch (error) {
      this.warnings.push({
        file: relativePath,
        import: importPath,
        message: `Failed to validate @/ alias: ${error.message}`
      });
    }
  }

  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    return path.resolve(fromDir, importPath);
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
    console.log('\n📊 Import Validation Results:');
    console.log('=============================');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All imports are valid!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Found ${this.errors.length} import errors:`);
      
      const errorTypes = {};
      this.errors.forEach(error => {
        if (!errorTypes[error.type]) errorTypes[error.type] = 0;
        errorTypes[error.type]++;
        
        console.log(`  📁 ${error.file}`);
        console.log(`     Import: ${error.import}`);
        if (error.resolvedPath) console.log(`     Resolved: ${error.resolvedPath}`);
        if (error.error) console.log(`     Error: ${error.error}`);
        console.log('');
      });

      console.log('Error Summary:');
      Object.entries(errorTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️ Found ${this.warnings.length} warnings:`);
      this.warnings.forEach(warning => {
        console.log(`  📁 ${warning.file}: ${warning.message}`);
      });
    }

    // Exit with error code if there are errors
    if (this.errors.length > 0) {
      console.log('\n❌ Import validation failed. Please fix the errors above.');
      process.exit(1);
    }
  }
}

// Run validation
const validator = new ImportValidator();
validator.validateRelativeImports(); 