export interface ContractDefinition {
  input: ContractParameter[];
  output: ContractParameter;
  errorHandling: ErrorHandlingDefinition;
  timeout?: number;
  retries?: number;
}

export interface ContractParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value: any;
  message: string;
}

export interface ErrorHandlingDefinition {
  retryable: boolean;
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  errorCodes: Record<string, string>;
}

export interface IntegrationEntry {
  name: string;
  source: string;
  target: string;
  type: 'component-service' | 'service-external' | 'component-component' | 'service-service';
  contract: ContractDefinition;
  lastUpdated: Date;
  status: 'active' | 'deprecated' | 'experimental';
  description?: string;
  performance?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  maxResponseTime: number;
  errorRate: number;
  throughput: number;
  lastMeasured: Date;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class IntegrationRegistry {
  private integrations: Map<string, IntegrationEntry> = new Map();
  
  register(integration: IntegrationEntry): void {
    this.integrations.set(integration.name, integration);
  }
  
  get(name: string): IntegrationEntry | undefined {
    return this.integrations.get(name);
  }
  
  getAll(): IntegrationEntry[] {
    return Array.from(this.integrations.values());
  }
  
  getActive(): IntegrationEntry[] {
    return this.getAll().filter(integration => integration.status === 'active');
  }
  
  getByType(type: IntegrationEntry['type']): IntegrationEntry[] {
    return this.getAll().filter(integration => integration.type === type);
  }
  
  getBySource(source: string): IntegrationEntry[] {
    return this.getAll().filter(integration => integration.source === source);
  }
  
  getByTarget(target: string): IntegrationEntry[] {
    return this.getAll().filter(integration => integration.target === target);
  }
  
  getByComponent(componentName: string): IntegrationEntry[] {
    return this.getAll().filter(integration => 
      integration.source === componentName || integration.target === componentName
    );
  }
  
  getByService(serviceName: string): IntegrationEntry[] {
    return this.getAll().filter(integration => 
      integration.source === serviceName || integration.target === serviceName
    );
  }
  
  updateStatus(name: string, status: IntegrationEntry['status']): void {
    const integration = this.get(name);
    if (integration) {
      integration.status = status;
      integration.lastUpdated = new Date();
    }
  }
  
  updatePerformance(name: string, metrics: PerformanceMetrics): void {
    const integration = this.get(name);
    if (integration) {
      integration.performance = metrics;
      integration.lastUpdated = new Date();
    }
  }
  
  remove(name: string): boolean {
    return this.integrations.delete(name);
  }
  
  clear(): void {
    this.integrations.clear();
  }
  
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for duplicate names
    const names = this.getAll().map(i => i.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate integration names found: ${duplicates.join(', ')}`);
    }
    
    // Check for circular dependencies
    const circular = this.detectCircularDependencies();
    if (circular.length > 0) {
      errors.push(`Circular dependencies detected: ${circular.join(', ')}`);
    }
    
    // Check for deprecated integrations
    for (const integration of this.getAll()) {
      if (integration.status === 'deprecated') {
        warnings.push(`Integration ${integration.name} is deprecated`);
      }
    }
    
    // Check for performance issues
    for (const integration of this.getAll()) {
      if (integration.performance) {
        if (integration.performance.errorRate > 0.05) {
          warnings.push(`Integration ${integration.name} has high error rate: ${integration.performance.errorRate * 100}%`);
        }
        if (integration.performance.averageResponseTime > 1000) {
          warnings.push(`Integration ${integration.name} has slow response time: ${integration.performance.averageResponseTime}ms`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private detectCircularDependencies(): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const circular: string[] = [];
    
    const dfs = (integrationName: string, path: string[] = []): boolean => {
      if (recursionStack.has(integrationName)) {
        const cycle = [...path.slice(path.indexOf(integrationName)), integrationName];
        circular.push(cycle.join(' -> '));
        return true;
      }
      
      if (visited.has(integrationName)) {
        return false;
      }
      
      visited.add(integrationName);
      recursionStack.add(integrationName);
      
      const integration = this.get(integrationName);
      if (integration) {
        const dependents = this.getByTarget(integration.source);
        for (const dependent of dependents) {
          if (dfs(dependent.name, [...path, integrationName])) {
            return true;
          }
        }
      }
      
      recursionStack.delete(integrationName);
      return false;
    };
    
    for (const integration of this.getAll()) {
      if (!visited.has(integration.name)) {
        dfs(integration.name);
      }
    }
    
    return circular;
  }
  
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    
    for (const integration of this.getAll()) {
      if (!graph[integration.source]) {
        graph[integration.source] = [];
      }
      graph[integration.source].push(integration.target);
    }
    
    return graph;
  }
  
  getReverseDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    
    for (const integration of this.getAll()) {
      if (!graph[integration.target]) {
        graph[integration.target] = [];
      }
      graph[integration.target].push(integration.source);
    }
    
    return graph;
  }
  
  toJSON(): Record<string, IntegrationEntry> {
    const result: Record<string, IntegrationEntry> = {};
    for (const [name, integration] of this.integrations) {
      result[name] = integration;
    }
    return result;
  }
  
  fromJSON(data: Record<string, IntegrationEntry>): void {
    this.clear();
    for (const [name, integration] of Object.entries(data)) {
      integration.lastUpdated = new Date(integration.lastUpdated);
      if (integration.performance) {
        integration.performance.lastMeasured = new Date(integration.performance.lastMeasured);
      }
      this.integrations.set(name, integration);
    }
  }
}

// Singleton instance
export const integrationRegistry = new IntegrationRegistry(); 