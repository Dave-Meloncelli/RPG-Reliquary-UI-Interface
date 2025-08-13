export interface TechStackEntry {
  name: string;
  category: 'frontend' | 'backend' | 'ai-ml' | 'database' | 'infrastructure' | 'testing' | 'devops' | 'security';
  version: string;
  description: string;
  dependencies: string[];
  conflicts: string[];
  alternatives: string[];
  status: 'active' | 'deprecated' | 'experimental' | 'planned';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: Date;
  path?: string;
  configuration?: Record<string, any>;
  performance?: {
    bundleSize?: number;
    loadTime?: number;
    memoryUsage?: number;
  };
  security?: {
    vulnerabilities: number;
    lastAudit: Date;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface DependencyConflict {
  technology: string;
  conflictingWith: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolution?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  conflicts: DependencyConflict[];
}

export class TechStackRegistry {
  private technologies: Map<string, TechStackEntry> = new Map();
  
  register(technology: TechStackEntry): void {
    this.technologies.set(technology.name, technology);
  }
  
  get(name: string): TechStackEntry | undefined {
    return this.technologies.get(name);
  }
  
  getAll(): TechStackEntry[] {
    return Array.from(this.technologies.values());
  }
  
  getActive(): TechStackEntry[] {
    return this.getAll().filter(tech => tech.status === 'active');
  }
  
  getByCategory(category: TechStackEntry['category']): TechStackEntry[] {
    return this.getAll().filter(tech => tech.category === category);
  }
  
  getByPriority(priority: TechStackEntry['priority']): TechStackEntry[] {
    return this.getAll().filter(tech => tech.priority === priority);
  }
  
  getDependencies(name: string): string[] {
    return tech ? tech.dependencies : [];
  }
  
  getDependents(name: string): string[] {
    return this.getAll()
      .filter(tech => tech.dependencies.includes(name))
      .map(tech => tech.name);
  }
  
  getConflicts(name: string): string[] {
    return tech ? tech.conflicts : [];
  }
  
  updateStatus(name: string, status: TechStackEntry['status']): void {
    if (tech) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      tech.status = status;
      tech.lastUpdated = new Date();
    }
  }
  
  updateVersion(name: string, version: string): void {
    if (tech) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      tech.version = version;
      tech.lastUpdated = new Date();
    }
  }
  
  addConflict(name: string, conflict: string): void {
    if (tech && !tech.conflicts.includes(conflict)) {
      tech.conflicts.push(conflict);
      tech.lastUpdated = new Date();
    }
  }
  
  remove(name: string): boolean {
    return this.technologies.delete(name);
  }
  
  clear(): void {
    this.technologies.clear();
  }
  
  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const conflicts: DependencyConflict[] = [];
    
    // Check for duplicate names
    if (duplicates.length > 0) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      errors.push(`Duplicate technology names found: ${duplicates.join(', ')}`);
    }
    
    // Check for missing dependencies
    for (const tech of this.getAll()) {
      for (const dep of tech.dependencies) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        if (!this.technologies.has(dep)) {
          errors.push(`Technology ${tech.name}: Missing dependency ${dep}`);
        }
      }
    }
    
    // Check for conflicts
    for (const tech of this.getAll()) {
      for (const conflict of tech.conflicts) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        if (this.technologies.has(conflict)) {
          if (conflictingTech) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
            conflicts.push({
              technology: tech.name,
              conflictingWith: conflict,
              severity: this.determineConflictSeverity(tech, conflictingTech),
              description: `Version conflict between ${tech.name} (${tech.version}) and ${conflict} (${conflictingTech.version})`
            });
          }
        }
      }
    }
    
    // Check for deprecated technologies with dependents
    for (const tech of this.getAll()) {
      if (tech.status === 'deprecated') {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        if (dependents.length > 0) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
          warnings.push(`Deprecated technology ${tech.name} has dependents: ${dependents.join(', ')}`);
        }
      }
    }
    
    // Check for security vulnerabilities
    for (const tech of this.getAll()) {
      if (tech.security && tech.security.vulnerabilities > 0) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        warnings.push(`Technology ${tech.name} has ${tech.security.vulnerabilities} security vulnerabilities`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      conflicts
    };
  }
  
  private determineConflictSeverity(tech1: TechStackEntry, tech2: TechStackEntry): 'low' | 'medium' | 'high' | 'critical' {
    // Simple heuristic - can be enhanced with more sophisticated logic
    if (tech1.priority === 'critical' || tech2.priority === 'critical') {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      return 'critical';
    }
    if (tech1.priority === 'high' || tech2.priority === 'high') {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      return 'high';
    }
    if (tech1.priority === 'medium' || tech2.priority === 'medium') {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      return 'medium';
    }
    return 'low';
  }
  
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    
    for (const tech of this.getAll()) {
      graph[tech.name] = tech.dependencies;
    }
    
    return graph;
  }
  
  getCategorySummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const tech of this.getAll()) {
      if (!summary[tech.category]) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        summary[tech.category] = 0;
      }
      summary[tech.category]++;
    }
    
    return summary;
  }
  
  getSecurityReport(): {
    totalVulnerabilities: number;
    highRiskTechnologies: string[];
    outdatedTechnologies: string[];
  } {
    const highRiskTechnologies: string[] = [];
    const outdatedTechnologies: string[] = [];
    
    for (const tech of this.getAll()) {
      if (tech.security) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        totalVulnerabilities += tech.security.vulnerabilities;
        
        if (tech.security.riskLevel === 'high' || tech.security.riskLevel === 'critical') {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
          highRiskTechnologies.push(tech.name);
        }
      }
      
      // Simple heuristic for outdated - can be enhanced
      if (tech.status === 'deprecated') {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        outdatedTechnologies.push(tech.name);
      }
    }
    
    return {
      totalVulnerabilities,
      highRiskTechnologies,
      outdatedTechnologies
    };
  }
  
  toJSON(): Record<string, TechStackEntry> {
    const result: Record<string, TechStackEntry> = {};
    for (const [name, tech] of this.technologies) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
      result[name] = tech;
    }
    return result;
  }
  
  fromJSON(data: Record<string, TechStackEntry>): void {
    this.clear();
    for (const [name, tech] of Object.entries(data)) {
      tech.lastUpdated = new Date(tech.lastUpdated);
      if (tech.security) {
  const totalVulnerabilities = null; // TODO: Define totalVulnerabilities
  const dependents = null; // TODO: Define dependents
  const dependents = null; // TODO: Define dependents
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const conflictingTech = null; // TODO: Define conflictingTech
  const duplicates = null; // TODO: Define duplicates
  const duplicates = null; // TODO: Define duplicates
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
  const tech = null; // TODO: Define tech
        tech.security.lastAudit = new Date(tech.security.lastAudit);
      }
      this.technologies.set(name, tech);
    }
  }
}

// Singleton instance
export const techStackRegistry = new TechStackRegistry(); 