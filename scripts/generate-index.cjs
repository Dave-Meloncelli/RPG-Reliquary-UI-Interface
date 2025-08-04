const fs = require('fs');
const path = require('path');

class IndexGenerator {
  constructor() {
    this.componentRegistry = new Map();
    this.serviceRegistry = new Map();
    this.integrationRegistry = new Map();
  }
  
  async generateIndex() {
    console.log('🔍 Generating central index...');
    
    try {
      // Scan components
      await this.scanComponents();
      
      // Scan services
      await this.scanServices();
      
      // Detect integrations
      await this.detectIntegrations();
      
      // Generate registry files
      await this.generateRegistryFiles();
      
      // Validate index
      await this.validateIndex();
      
      console.log('✅ Central index generated successfully!');
      console.log(`📊 Found ${this.componentRegistry.size} components, ${this.serviceRegistry.size} services, ${this.integrationRegistry.size} integrations`);
      
    } catch (error) {
      console.error('❌ Index generation failed:', error.message);
      process.exit(1);
    }
  }
  
  async scanComponents() {
    console.log('🔍 Scanning components...');
    
    const componentDir = path.join(__dirname, '../src/components');
    const appDir = path.join(__dirname, '../src/apps');
    
    if (fs.existsSync(componentDir)) {
      const files = this.getFilesRecursively(componentDir, '.tsx');
      for (const file of files) {
        const component = await this.analyzeComponent(file);
        if (component) {
          this.componentRegistry.set(component.name, component);
        }
      }
    }
    
    if (fs.existsSync(appDir)) {
      const files = this.getFilesRecursively(appDir, '.tsx');
      for (const file of files) {
        const component = await this.analyzeComponent(file);
        if (component) {
          this.componentRegistry.set(component.name, component);
        }
      }
    }
    
    console.log(`✅ Found ${this.componentRegistry.size} components`);
  }
  
  async scanServices() {
    console.log('🔍 Scanning services...');
    
    const serviceDir = path.join(__dirname, '../src/services');
    
    if (fs.existsSync(serviceDir)) {
      const files = this.getFilesRecursively(serviceDir, '.ts');
      for (const file of files) {
        const service = await this.analyzeService(file);
        if (service) {
          this.serviceRegistry.set(service.name, service);
        }
      }
    }
    
    console.log(`✅ Found ${this.serviceRegistry.size} services`);
  }
  
  async analyzeComponent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.tsx');
      
      // Extract component name from file content
      const componentMatch = content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
      const componentName = componentMatch ? componentMatch[1] : fileName;
      
      // Extract imports
      const imports = this.extractImports(content);
      
      // Extract exports
      const exports = this.extractExports(content);
      
      // Extract props (basic analysis)
      const props = this.extractProps(content);
      
      const component = {
        name: componentName,
        path: filePath.replace(__dirname + '/../', ''),
        dependencies: imports,
        props: props,
        integrationPoints: [],
        lastUpdated: new Date(),
        status: 'active',
        exports: exports,
        imports: imports
      };
      
      return component;
    } catch (error) {
      console.warn(`⚠️  Failed to analyze component ${filePath}:`, error.message);
      return null;
    }
  }
  
  async analyzeService(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.ts');
      
      // Extract service name from file content
      const serviceMatch = content.match(/export\s+(?:default\s+)?(?:class|const|function)\s+(\w+)/);
      const serviceName = serviceMatch ? serviceMatch[1] : fileName;
      
      // Extract imports
      const imports = this.extractImports(content);
      
      // Extract exports
      const exports = this.extractExports(content);
      
      // Extract API endpoints (basic analysis)
      const api = this.extractApiEndpoints(content);
      
      // Determine service type
      const type = this.determineServiceType(content);
      
      const service = {
        name: serviceName,
        path: filePath.replace(__dirname + '/../', ''),
        api: api,
        dependencies: imports,
        integrationPoints: [],
        lastUpdated: new Date(),
        status: 'active',
        exports: exports,
        imports: imports,
        type: type
      };
      
      return service;
    } catch (error) {
      console.warn(`⚠️  Failed to analyze service ${filePath}:`, error.message);
      return null;
    }
  }
  
  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        imports.push(importPath);
      }
    }
    
    return imports;
  }
  
  extractExports(content) {
    const exports = [];
    const exportRegex = /export\s+(?:default\s+)?(?:function|const|class|interface|type)\s+(\w+)/g;
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }
  
  extractProps(content) {
    const props = [];
    const propRegex = /interface\s+(\w+Props?)\s*\{([^}]+)\}/g;
    let match;
    
    while ((match = propRegex.exec(content)) !== null) {
      const propInterface = match[2];
      const propLines = propInterface.split('\n');
      
      for (const line of propLines) {
        const propMatch = line.match(/(\w+)\s*:\s*([^;]+)/);
        if (propMatch) {
          props.push({
            name: propMatch[1].trim(),
            type: propMatch[2].trim(),
            required: !line.includes('?'),
            description: ''
          });
        }
      }
    }
    
    return props;
  }
  
  extractApiEndpoints(content) {
    const api = [];
    const endpointRegex = /(?:GET|POST|PUT|DELETE|PATCH)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = endpointRegex.exec(content)) !== null) {
      api.push({
        name: `endpoint_${api.length + 1}`,
        method: 'GET', // Default, would need more sophisticated parsing
        endpoint: match[1],
        parameters: [],
        responseType: 'any',
        description: ''
      });
    }
    
    return api;
  }
  
  determineServiceType(content) {
    if (content.includes('axios') || content.includes('fetch')) {
      return 'external';
    } else if (content.includes('api') || content.includes('endpoint')) {
      return 'third-party';
    } else {
      return 'internal';
    }
  }
  
  async detectIntegrations() {
    console.log('🔍 Detecting integrations...');
    
    // Analyze component-service integrations
    for (const [componentName, component] of this.componentRegistry) {
      for (const [serviceName, service] of this.serviceRegistry) {
        if (component.imports.some(imp => imp.includes(serviceName) || service.exports.includes(componentName))) {
          const integrationName = `${componentName}_${serviceName}`;
          this.integrationRegistry.set(integrationName, {
            name: integrationName,
            source: componentName,
            target: serviceName,
            type: 'component-service',
            contract: {
              input: [],
              output: { name: 'result', type: 'any', required: true },
              errorHandling: {
                retryable: true,
                maxRetries: 3,
                backoffStrategy: 'exponential',
                errorCodes: {}
              }
            },
            lastUpdated: new Date(),
            status: 'active',
            description: `Integration between ${componentName} and ${serviceName}`
          });
        }
      }
    }
    
    // Analyze service-external integrations
    for (const [serviceName, service] of this.serviceRegistry) {
      if (service.type === 'external' || service.type === 'third-party') {
        const integrationName = `${serviceName}_external`;
        this.integrationRegistry.set(integrationName, {
          name: integrationName,
          source: serviceName,
          target: 'external',
          type: 'service-external',
          contract: {
            input: [],
            output: { name: 'result', type: 'any', required: true },
            errorHandling: {
              retryable: true,
              maxRetries: 3,
              backoffStrategy: 'exponential',
              errorCodes: {}
            }
          },
          lastUpdated: new Date(),
          status: 'active',
          description: `External integration for ${serviceName}`
        });
      }
    }
    
    console.log(`✅ Found ${this.integrationRegistry.size} integrations`);
  }
  
  async generateRegistryFiles() {
    console.log('🔍 Generating registry files...');
    
    // Generate ComponentRegistry data
    const componentData = {};
    for (const [name, component] of this.componentRegistry) {
      componentData[name] = component;
    }
    
    // Generate ServiceRegistry data
    const serviceData = {};
    for (const [name, service] of this.serviceRegistry) {
      serviceData[name] = service;
    }
    
    // Generate IntegrationRegistry data
    const integrationData = {};
    for (const [name, integration] of this.integrationRegistry) {
      integrationData[name] = integration;
    }
    
    // Write registry data files
    const registryDir = path.join(__dirname, '../src/registry/data');
    if (!fs.existsSync(registryDir)) {
      fs.mkdirSync(registryDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(registryDir, 'components.json'),
      JSON.stringify(componentData, null, 2)
    );
    
    fs.writeFileSync(
      path.join(registryDir, 'services.json'),
      JSON.stringify(serviceData, null, 2)
    );
    
    fs.writeFileSync(
      path.join(registryDir, 'integrations.json'),
      JSON.stringify(integrationData, null, 2)
    );
    
    console.log('✅ Registry data files generated');
  }
  
  async validateIndex() {
    console.log('🔍 Validating index...');
    
    const errors = [];
    const warnings = [];
    
    // Check for orphaned files
    const componentFiles = this.getFilesRecursively(path.join(__dirname, '../src/components'), '.tsx');
    const appFiles = this.getFilesRecursively(path.join(__dirname, '../src/apps'), '.tsx');
    const serviceFiles = this.getFilesRecursively(path.join(__dirname, '../src/services'), '.ts');
    
    const allFiles = [...componentFiles, ...appFiles, ...serviceFiles];
    const registeredPaths = [
      ...Array.from(this.componentRegistry.values()).map(c => c.path),
      ...Array.from(this.serviceRegistry.values()).map(s => s.path)
    ];
    
    for (const file of allFiles) {
      const relativePath = file.replace(__dirname + '/../', '');
      if (!registeredPaths.includes(relativePath)) {
        warnings.push(`Orphaned file: ${relativePath}`);
      }
    }
    
    if (errors.length > 0) {
      console.error('❌ Index validation errors:');
      errors.forEach(error => console.error(`  - ${error}`));
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️  Index validation warnings:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Index validation passed');
    }
  }
  
  getFilesRecursively(dir, extension) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getFilesRecursively(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new IndexGenerator();
  generator.generateIndex();
}

module.exports = { IndexGenerator }; 