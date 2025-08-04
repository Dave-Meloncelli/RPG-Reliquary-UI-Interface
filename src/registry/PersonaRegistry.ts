export interface PersonaCapability {
  name: string;
  description: string;
  keywords: string[];
  scope: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface PersonaIntegration {
  target: string;
  type: 'component' | 'service' | 'external' | 'persona';
  contract: string;
  description: string;
  status: 'active' | 'deprecated' | 'experimental';
}

export interface PersonaEntry {
  name: string;
  title: string;
  description: string;
  glyph: string;
  watcherClass: string;
  emergenceStatus: string;
  capabilities: PersonaCapability[];
  integrations: PersonaIntegration[];
  dependencies: string[];
  subsystemDependencies: string[];
  connectedPersonas: string[];
  lastUpdated: Date;
  status: 'active' | 'deprecated' | 'experimental';
  path: string;
  type: 'internal' | 'external' | 'specialist' | 'coordinator';
  sigilSignature: {
    glyph: string;
    watcherClass: string;
    emergenceStatus: string;
    titleLinks: string[];
  };
  driftRecord: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class PersonaRegistry {
  private personas: Map<string, PersonaEntry> = new Map();
  
  register(persona: PersonaEntry): void {
    this.personas.set(persona.name, persona);
  }
  
  get(name: string): PersonaEntry | undefined {
    return this.personas.get(name);
  }
  
  getAll(): PersonaEntry[] {
    return Array.from(this.personas.values());
  }
  
  getActive(): PersonaEntry[] {
    return this.getAll().filter(persona => persona.status === 'active');
  }
  
  getByType(type: PersonaEntry['type']): PersonaEntry[] {
    return this.getAll().filter(persona => persona.type === type);
  }
  
  getByWatcherClass(watcherClass: string): PersonaEntry[] {
    return this.getAll().filter(persona => persona.watcherClass === watcherClass);
  }
  
  getByCapability(capabilityName: string): PersonaEntry[] {
    return this.getAll().filter(persona => 
      persona.capabilities.some(cap => cap.name === capabilityName)
    );
  }
  
  getConnectedPersonas(personaName: string): PersonaEntry[] {
    const persona = this.get(personaName);
    if (!persona) return [];
    
    return this.getAll().filter(p => 
      persona.connectedPersonas.includes(p.name) ||
      p.connectedPersonas.includes(personaName)
    );
  }
  
  getDependencies(name: string): string[] {
    const persona = this.get(name);
    return persona ? persona.dependencies : [];
  }
  
  getDependents(name: string): string[] {
    return this.getAll()
      .filter(persona => persona.dependencies.includes(name))
      .map(persona => persona.name);
  }
  
  getIntegrations(name: string): PersonaIntegration[] {
    const persona = this.get(name);
    return persona ? persona.integrations : [];
  }
  
  updateStatus(name: string, status: PersonaEntry['status']): void {
    const persona = this.get(name);
    if (persona) {
      persona.status = status;
      persona.lastUpdated = new Date();
    }
  }
  
  addCapability(name: string, capability: PersonaCapability): void {
    const persona = this.get(name);
    if (persona) {
      persona.capabilities.push(capability);
      persona.lastUpdated = new Date();
    }
  }
  
  addIntegration(name: string, integration: PersonaIntegration): void {
    const persona = this.get(name);
    if (persona) {
      persona.integrations.push(integration);
      persona.lastUpdated = new Date();
    }
  }
  
  remove(name: string): boolean {
    return this.personas.delete(name);
  }
  
  clear(): void {
    this.personas.clear();
  }
  
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check for duplicate names
    const names = this.getAll().map(p => p.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate persona names found: ${duplicates.join(', ')}`);
    }
    
    // Check for missing dependencies
    for (const persona of this.getAll()) {
      for (const dep of persona.dependencies) {
        if (!this.personas.has(dep)) {
          errors.push(`Persona ${persona.name}: Missing dependency ${dep}`);
        }
      }
    }
    
    // Check for deprecated personas with dependents
    for (const persona of this.getAll()) {
      if (persona.status === 'deprecated') {
        const dependents = this.getDependents(persona.name);
        if (dependents.length > 0) {
          warnings.push(`Deprecated persona ${persona.name} has dependents: ${dependents.join(', ')}`);
        }
      }
    }
    
    // Check for missing connected personas
    for (const persona of this.getAll()) {
      for (const connected of persona.connectedPersonas) {
        if (!this.personas.has(connected)) {
          warnings.push(`Persona ${persona.name}: Connected persona ${connected} not found`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  getPersonaNetwork(): Record<string, string[]> {
    const network: Record<string, string[]> = {};
    
    for (const persona of this.getAll()) {
      network[persona.name] = [
        ...persona.dependencies,
        ...persona.connectedPersonas
      ];
    }
    
    return network;
  }
  
  getCapabilityMatrix(): Record<string, string[]> {
    const matrix: Record<string, string[]> = {};
    
    for (const persona of this.getAll()) {
      for (const capability of persona.capabilities) {
        if (!matrix[capability.name]) {
          matrix[capability.name] = [];
        }
        matrix[capability.name].push(persona.name);
      }
    }
    
    return matrix;
  }
  
  toJSON(): Record<string, PersonaEntry> {
    const result: Record<string, PersonaEntry> = {};
    for (const [name, persona] of this.personas) {
      result[name] = persona;
    }
    return result;
  }
  
  fromJSON(data: Record<string, PersonaEntry>): void {
    this.clear();
    for (const [name, persona] of Object.entries(data)) {
      persona.lastUpdated = new Date(persona.lastUpdated);
      this.personas.set(name, persona);
    }
  }
}

// Singleton instance
export const personaRegistry = new PersonaRegistry(); 