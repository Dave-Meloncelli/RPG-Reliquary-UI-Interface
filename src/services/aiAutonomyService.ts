import { eventBus } from "./eventBus";
import { personaSecurityService } from "./personaSecurityService";

export interface AutonomyLevel {
  level: "restricted" | "supervised" | "autonomous" | "enhanced";
  description: string;
  permissions: string[];
  restrictions: string[];
  monitoringLevel: "low" | "medium" | "high" | "critical";
}

export interface PermissionScope {
  scope: string;
  enabled: boolean;
  level:
    | "none"
    | "read_only"
    | "filtered"
    | "sandboxed"
    | "monitored"
    | "restricted"
    | "read_write"
    | "full";
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface AutonomyAuditLog {
  id: string;
  timestamp: Date;
  agentId: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  authorizedBy?: string;
}

export interface AutonomyViolation {
  id: string;
  timestamp: Date;
  agentId: string;
  violationType:
    | "permission_denied"
    | "autonomy_breach"
    | "security_violation"
    | "resource_abuse";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
  resolution?: string;
}

class AIAutonomyService {
  private autonomyLevels: Record<string, AutonomyLevel> = {
    restricted: {
      level: "restricted",
      description: "Minimal autonomy, all actions require explicit approval",
      permissions: ["read:own_profile", "view:public_data"],
      restrictions: [
        "no_file_access",
        "no_network_access",
        "no_api_calls",
        "no_code_execution",
      ],
      monitoringLevel: "high",
    },
    supervised: {
      level: "supervised",
      description: "Limited autonomy with human oversight",
      permissions: [
        "read:own_profile",
        "view:public_data",
        "access:basic_tools",
        "read:filtered_data",
      ],
      restrictions: [
        "no_system_config",
        "no_network_access",
        "monitored_api_calls",
      ],
      monitoringLevel: "medium",
    },
    autonomous: {
      level: "autonomous",
      description: "Full autonomy within defined boundaries",
      permissions: [
        "read:own_profile",
        "view:public_data",
        "access:basic_tools",
        "access:advanced_tools",
        "read:filtered_data",
        "write:filtered_data",
      ],
      restrictions: ["no_system_config", "no_root_access"],
      monitoringLevel: "low",
    },
    enhanced: {
      level: "enhanced",
      description: "Maximum autonomy with enhanced capabilities",
      permissions: [
        "read:own_profile",
        "view:public_data",
        "access:basic_tools",
        "access:advanced_tools",
        "access:system_tools",
        "read:all_data",
        "write:all_data",
      ],
      restrictions: ["no_root_access"],
      monitoringLevel: "low",
    },
  };

  private permissionScopes: Record<string, PermissionScope> = {
    file_system: {
      scope: "file_system",
      enabled: true,
      level: "read_write",
      description: "Access to file system operations",
      riskLevel: "medium",
    },
    network_access: {
      scope: "network_access",
      enabled: true,
      level: "restricted",
      description: "Network connectivity and API calls",
      riskLevel: "high",
    },
    api_calls: {
      scope: "api_calls",
      enabled: true,
      level: "monitored",
      description: "External API interactions",
      riskLevel: "medium",
    },
    code_execution: {
      scope: "code_execution",
      enabled: true,
      level: "sandboxed",
      description: "Code execution capabilities",
      riskLevel: "high",
    },
    data_access: {
      scope: "data_access",
      enabled: true,
      level: "filtered",
      description: "Data access and manipulation",
      riskLevel: "medium",
    },
    system_config: {
      scope: "system_config",
      enabled: false,
      level: "none",
      description: "System configuration changes",
      riskLevel: "critical",
    },
  };

  private agentAutonomyLevels: Map<string, string> = new Map();
  private auditLog: AutonomyAuditLog[] = [];
  private violations: AutonomyViolation[] = [];
  private subscribers: Set<(data: any) => void> = new Set();

  constructor() {
    this.initializeDefaultAutonomyLevels();
    this.setupEventListeners();
  }

  private initializeDefaultAutonomyLevels() {
    // Set default autonomy levels for known agents
    const defaultLevels = {
      "aeon-indexwell": "supervised",
      architect: "autonomous",
      archivist: "supervised",
      broodmother: "restricted",
      cartographer: "autonomous",
      codex: "supervised",
      zero: "autonomous",
      ghost: "restricted",
      joyn: "supervised",
      kairos: "autonomous",
      "machine-spirit": "restricted",
      "major-payne": "supervised",
      nya: "autonomous",
      piney: "supervised",
      "steel-core": "autonomous",
      "the-weaver": "autonomous",
      "tinker-hexbolt": "supervised",
      "the-archivist": "supervised",
      "the-cartographer": "autonomous",
      "agent-kairos": "autonomous",
      "agent-sophia": "autonomous",
      "agent-jordan": "autonomous",
      "agent-codex": "supervised",
      "agent-erdu": "supervised",
      "agent-architect": "autonomous",
      "agent-curator": "supervised",
      "agent-technomancer": "supervised",
    };

    Object.entries(defaultLevels).forEach(([agentId, level]) => {
      this.agentAutonomyLevels.set(agentId, level);
    });
  }

  private setupEventListeners() {
    // Listen for security validation events
    eventBus.subscribe("security.validation", (data) => {
      this.handleSecurityValidation(data);
    });

    // Listen for agent activity events
    eventBus.subscribe("agent.activity", (data) => {
      this.handleAgentActivity(data);
    });
  }

  // Public API Methods
  public getAgentAutonomyLevel(agentId: string): string {
    return this.agentAutonomyLevels.get(agentId) || "supervised";
  }

  public setAgentAutonomyLevel(
    agentId: string,
    level: string,
    reason?: string,
    authorizedBy?: string,
  ) {
    const oldLevel = this.getAgentAutonomyLevel(agentId);

    if (this.autonomyLevels[level]) {
      this.agentAutonomyLevels.set(agentId, level);

      // Log the change
      this.logAuditEvent({
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        agentId,
        action: "autonomy_level_change",
        oldValue: oldLevel,
        newValue: level,
        reason,
        authorizedBy,
      });

      // Validate against security profile
      this.validateAutonomyAgainstSecurity(agentId, level);

      // Notify subscribers
      this.notifySubscribers({
        type: "autonomy_level_changed",
        agentId,
        oldLevel,
        newLevel: level,
      });
    }
  }

  public getPermissionScope(scope: string): PermissionScope | null {
    return this.permissionScopes[scope] || null;
  }

  public setPermissionScope(scope: string, enabled: boolean, level?: string) {
    if (this.permissionScopes[scope]) {
      const oldConfig = { ...this.permissionScopes[scope] };

      this.permissionScopes[scope].enabled = enabled;
      if (level) {
        this.permissionScopes[scope].level = level as any;
      }

      // Log the change
      this.logAuditEvent({
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        agentId: "system",
        action: "permission_scope_change",
        oldValue: oldConfig,
        newValue: this.permissionScopes[scope],
        reason: "Administrative change",
      });

      // Notify subscribers
      this.notifySubscribers({
        type: "permission_scope_changed",
        scope,
        oldConfig,
        newConfig: this.permissionScopes[scope],
      });
    }
  }

  public checkPermission(agentId: string, permission: string): boolean {
    const autonomyLevel = this.getAgentAutonomyLevel(agentId);
    const levelConfig = this.autonomyLevels[autonomyLevel];

    if (!levelConfig) {
      return false;
    }

    // Check if permission is allowed at this autonomy level
    const hasPermission = levelConfig.permissions.includes(permission);

    if (!hasPermission) {
      this.logViolation({
        id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        agentId,
        violationType: "permission_denied",
        description: `Agent ${agentId} attempted to access ${permission} but was denied due to autonomy level ${autonomyLevel}`,
        severity: "medium",
        resolved: false,
      });
    }

    return hasPermission;
  }

  public getAutonomyStats() {
    const levels = Array.from(this.agentAutonomyLevels.values());
    return {
      autonomous: levels.filter(
        (level) => level === "autonomous" || level === "enhanced",
      ).length,
      supervised: levels.filter((level) => level === "supervised").length,
      restricted: levels.filter((level) => level === "restricted").length,
      total: levels.length,
    };
  }

  public getPermissionStats() {
    const scopes = Object.values(this.permissionScopes);
    return {
      enabled: scopes.filter((scope) => scope.enabled).length,
      disabled: scopes.filter((scope) => !scope.enabled).length,
      total: scopes.length,
    };
  }

  public getAuditLog(limit: number = 100): AutonomyAuditLog[] {
    return this.auditLog.slice(-limit);
  }

  public getViolations(limit: number = 100): AutonomyViolation[] {
    return this.violations.slice(-limit);
  }

  public resolveViolation(violationId: string, resolution: string) {
    const violation = this.violations.find((v) => v.id === violationId);
    if (violation) {
      violation.resolved = true;
      violation.resolution = resolution;

      this.notifySubscribers({
        type: "violation_resolved",
        violationId,
        resolution,
      });
    }
  }

  // Private helper methods
  private logAuditEvent(event: AutonomyAuditLog) {
    this.auditLog.push(event);

    // Keep only last 1000 events
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }
  }

  private logViolation(violation: AutonomyViolation) {
    this.violations.push(violation);

    // Keep only last 500 violations
    if (this.violations.length > 500) {
      this.violations = this.violations.slice(-500);
    }

    // Notify subscribers
    this.notifySubscribers({
      type: "violation_detected",
      violation,
    });
  }

  private validateAutonomyAgainstSecurity(
    agentId: string,
    autonomyLevel: string,
  ) {
    const securityProfile = personaSecurityService.getSecurityProfile(agentId);
    if (securityProfile) {
      const levelConfig = this.autonomyLevels[autonomyLevel];

      // Check if autonomy level is appropriate for security level
      if (
        securityProfile.securityLevel === "basic" &&
        autonomyLevel === "enhanced"
      ) {
        this.logViolation({
          id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          agentId,
          violationType: "security_violation",
          description: `Agent ${agentId} with basic security level assigned enhanced autonomy`,
          severity: "high",
          resolved: false,
        });
      }
    }
  }

  private handleSecurityValidation(data: any) {
    // Handle security validation events
    if (data.agentId && data.isValid === false) {
      // Downgrade autonomy level for security violations
      const currentLevel = this.getAgentAutonomyLevel(data.agentId);
      if (currentLevel !== "restricted") {
        this.setAgentAutonomyLevel(
          data.agentId,
          "restricted",
          "Security validation failed",
        );
      }
    }
  }

  private handleAgentActivity(data: any) {
    // Monitor agent activity for autonomy violations
    if (data.agentId && data.action) {
      const hasPermission = this.checkPermission(data.agentId, data.action);
      if (!hasPermission) {
        // Log violation and potentially downgrade autonomy
        this.logViolation({
          id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          agentId: data.agentId,
          violationType: "autonomy_breach",
          description: `Agent ${data.agentId} performed unauthorized action: ${data.action}`,
          severity: "high",
          resolved: false,
        });
      }
    }
  }

  private notifySubscribers(data: any) {
    this.subscribers.forEach((callback) => callback(data));
  }

  public subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Export current state for control panel
  public getState() {
    return {
      agentAutonomyLevels: Object.fromEntries(this.agentAutonomyLevels),
      permissionScopes: this.permissionScopes,
      stats: {
        autonomy: this.getAutonomyStats(),
        permissions: this.getPermissionStats(),
      },
      recentAuditLog: this.getAuditLog(10),
      recentViolations: this.getViolations(10),
    };
  }
}

// Export singleton instance
export const aiAutonomyService = new AIAutonomyService();
