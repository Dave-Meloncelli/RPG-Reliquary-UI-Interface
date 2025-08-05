export interface ApiDefinition {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  parameters: ParameterDefinition[];
  responseType: string;
  description?: string;
}

export interface ParameterDefinition {
  name: string;
  type: string;
  required: boolean;
  location: 'query' | 'body' | 'path' | 'header';
  description?: string;
}

export interface ServiceEntry {
  name: string;
  path: string;
  api: ApiDefinition[];
  dependencies: string[];
  integrationPoints: string[];
  lastUpdated: Date;
  status: 'active' | 'deprecated' | 'experimental';
  exports: string[];
  imports: string[];
  type: 'internal' | 'external' | 'third-party';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ServiceRegistry {
  private services: Map<string, ServiceEntry> = new Map();
  
  register(service: ServiceEntry): void {
    this.services.set(service.name, service);
  }
  
  get(name: string): ServiceEntry | undefined {
    return this.services.get(name);
  }
  
  getAll(): ServiceEntry[] {
    return Array.from(this.services.values());
  }
  
  getActive(): ServiceEntry[] {
    return this.getAll().filter(service => service.status === 'active');
  }
  
  getByPath(path: string): ServiceEntry | undefined {
    return this.getAll().find(service => service.path === path);
  }
  
  getByType(type: ServiceEntry['type']): ServiceEntry[] {
    return this.getAll().filter(service => service.type === type);
  }
  
  getDependencies(name: string): string[] {
    return service ? service.dependencies : [];
  }
  
  getDependents(name: string): string[] {
    return this.getAll()
      .filter(service => service.dependencies.includes(name))
      .map(service => service.name);
  }
  
  getIntegrationPoints(name: string): string[] {
    return service ? service.integrationPoints : [];
  }
  
  getApiEndpoints(name: string): ApiDefinition[] {
    return service ? service.api : [];
  }
  
  updateStatus(name: string, status: ServiceEntry['status']): void {
    if (service) {
      service.status = status;
      service.lastUpdated = new Date();
    }
  }
  
  addApiEndpoint(name: string, api: ApiDefinition): void {
    if (service) {
      service.api.push(api);
      service.lastUpdated = new Date();
    }
  }
  
  remove(name: string): boolean {
    return this.services.delete(name);
  }
  
  clear(): void {
    this.services.clear();
  }
  
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for duplicate names
    if (duplicates.length > 0) {
      errors.push(`Duplicate service names found: ${duplicates.join(', ')}`);
    }
    
    // Check for missing dependencies
    for (const service of this.getAll()) {
      for (const dep of service.dependencies) {
        if (!this.services.has(dep) && !this.isExternalDependency(dep)) {
          errors.push(`Service ${service.name}: Missing dependency ${dep}`);
        }
      }
    }
    
    // Check for deprecated services with dependents
    for (const service of this.getAll()) {
      if (service.status === 'deprecated') {
        if (dependents.length > 0) {
          warnings.push(`Deprecated service ${service.name} has dependents: ${dependents.join(', ')}`);
        }
      }
    }
    
    // Check for duplicate API endpoints
    for (const service of this.getAll()) {
      if (duplicates.length > 0) {
        errors.push(`Service ${service.name}: Duplicate API endpoints found: ${duplicates.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private isExternalDependency(dep: string): boolean {
    // Check if dependency is external (not a local service)
    return externalPrefixes.some(prefix => dep.startsWith(prefix));
  }
  
  toJSON(): Record<string, ServiceEntry> {
    const result: Record<string, ServiceEntry> = {};
    for (const [name, service] of this.services) {
      result[name] = service;
    }
    return result;
  }
  
  fromJSON(data: Record<string, ServiceEntry>): void {
    this.clear();
    for (const [name, service] of Object.entries(data)) {
      service.lastUpdated = new Date(service.lastUpdated);
      this.services.set(name, service);
    }
  }
}

// Singleton instance
export const serviceRegistry = new ServiceRegistry(); 