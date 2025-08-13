export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface ComponentEntry {
  name: string;
  path: string;
  dependencies: string[];
  props: PropDefinition[];
  integrationPoints: string[];
  lastUpdated: Date;
  status: "active" | "deprecated" | "experimental";
  exports: string[];
  imports: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ComponentRegistry {
  private components: Map<string, ComponentEntry> = new Map();

  register(component: ComponentEntry): void {
    this.components.set(component.name, component);
  }

  get(name: string): ComponentEntry | undefined {
    return this.components.get(name);
  }

  getAll(): ComponentEntry[] {
    return Array.from(this.components.values());
  }

  getActive(): ComponentEntry[] {
    return this.getAll().filter((component) => component.status === "active");
  }

  getByPath(path: string): ComponentEntry | undefined {
    return this.getAll().find((component) => component.path === path);
  }

  getDependencies(name: string): string[] {
    const component = this.components.get(name);
    return component ? component.dependencies : [];
  }

  getDependents(name: string): string[] {
    return this.getAll()
      .filter((component) => component.dependencies.includes(name))
      .map((component) => component.name);
  }

  getIntegrationPoints(name: string): string[] {
    const component = this.components.get(name);
    return component ? component.integrationPoints : [];
  }

  updateStatus(name: string, status: ComponentEntry["status"]): void {
    const component = this.components.get(name);
    if (component) {
      component.status = status;
      component.lastUpdated = new Date();
    }
  }

  remove(name: string): boolean {
    return this.components.delete(name);
  }

  clear(): void {
    this.components.clear();
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for duplicate names
    const names = this.getAll().map((c) => c.name);
    const duplicates = names.filter(
      (name, index) => names.indexOf(name) !== index,
    );
    if (duplicates.length > 0) {
      errors.push(`Duplicate component names found: ${duplicates.join(", ")}`);
    }

    // Check for missing dependencies
    for (const component of this.getAll()) {
      for (const dep of component.dependencies) {
        if (!this.components.has(dep) && !this.isExternalDependency(dep)) {
          errors.push(`Component ${component.name}: Missing dependency ${dep}`);
        }
      }
    }

    // Check for deprecated components with dependents
    for (const component of this.getAll()) {
      if (component.status === "deprecated") {
        const dependents = this.getDependents(component.name);
        if (dependents.length > 0) {
          warnings.push(
            `Deprecated component ${component.name} has dependents: ${dependents.join(", ")}`,
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private isExternalDependency(dep: string): boolean {
    // Check if dependency is external (not a local component)
    const externalPrefixes = ["@", "react", "lodash", "axios", "moment"];
    return externalPrefixes.some((prefix) => dep.startsWith(prefix));
  }

  toJSON(): Record<string, ComponentEntry> {
    const result: Record<string, ComponentEntry> = {};
    for (const [name, component] of this.components) {
      result[name] = component;
    }
    return result;
  }

  fromJSON(data: Record<string, ComponentEntry>): void {
    this.clear();
    for (const [name, component] of Object.entries(data)) {
      component.lastUpdated = new Date(component.lastUpdated);
      this.components.set(name, component);
    }
  }
}

// Singleton instance
export const componentRegistry = new ComponentRegistry();
