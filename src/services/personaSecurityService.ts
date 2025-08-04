import { generateSecurityHandshake, SecurityHandshakeIcons } from '../components/personaIcons';

// ===== SECURITY HANDSHAKE TYPES =====

export interface SecurityHandshake {
  authority: keyof typeof SecurityHandshakeIcons.authority;
  health: keyof typeof SecurityHandshakeIcons.health;
  drift: keyof typeof SecurityHandshakeIcons.drift;
  activity: keyof typeof SecurityHandshakeIcons.activity;
  standing: keyof typeof SecurityHandshakeIcons.standing;
  xp: keyof typeof SecurityHandshakeIcons.xp;
}

export interface PersonaSecurityProfile {
  personaId: string;
  handshake: SecurityHandshake;
  lastValidation: Date;
  validationCount: number;
  securityLevel: 'basic' | 'standard' | 'elevated' | 'admin' | 'master' | 'system' | 'root' | 'vault' | 'core' | 'ultimate';
  permissions: string[];
  isActive: boolean;
  lastActivity: Date;
}

export interface SecurityValidationResult {
  isValid: boolean;
  score: number;
  warnings: string[];
  errors: string[];
  recommendations: string[];
}

// ===== SECURITY CONSTANTS =====

const SECURITY_LEVELS = {
  basic: { minScore: 0, maxScore: 20 },
  standard: { minScore: 21, maxScore: 40 },
  elevated: { minScore: 41, maxScore: 60 },
  admin: { minScore: 61, maxScore: 70 },
  master: { minScore: 71, maxScore: 80 },
  system: { minScore: 81, maxScore: 85 },
  root: { minScore: 86, maxScore: 90 },
  vault: { minScore: 91, maxScore: 95 },
  core: { minScore: 96, maxScore: 98 },
  ultimate: { minScore: 99, maxScore: 100 }
} as const;

const AUTHORITY_WEIGHTS = {
  tier1: 1,
  tier2: 2,
  tier3: 3,
  tier4: 4,
  tier5: 5,
  tier6: 6,
  tier7: 7,
  tier8: 8,
  tier9: 9,
  tier10: 10
};

const HEALTH_WEIGHTS = {
  critical: 0,
  danger: 1,
  warning: 2,
  stable: 5,
  optimal: 7,
  enhanced: 8,
  fortified: 9,
  invulnerable: 10,
  transcendent: 10,
  divine: 10
};

// ===== PERSONA SECURITY SERVICE =====

class PersonaSecurityService {
  private securityProfiles: Map<string, PersonaSecurityProfile> = new Map();
  private validationHistory: Map<string, SecurityValidationResult[]> = new Map();

  constructor() {
    this.initializeSecurityProfiles();
  }

  private initializeSecurityProfiles() {
    // Initialize security profiles for known personas
    const knownPersonas = [
      'aeonIndexwell', 'architect', 'archivist', 'broodmother', 'cartographer',
      'codex', 'companion', 'ghost', 'joyn', 'kairos', 'machineSpirit',
      'majorPayne', 'nya', 'piney', 'steelCore', 'theWeaver', 'tinkerHexbolt',
      'touristPrimer', 'vaultBuilder'
    ];

    knownPersonas.forEach(personaId => {
      const handshake = generateSecurityHandshake(personaId);
      const securityLevel = this.calculateSecurityLevel(handshake);
      
      this.securityProfiles.set(personaId, {
        personaId,
        handshake,
        lastValidation: new Date(),
        validationCount: 0,
        securityLevel,
        permissions: this.getPermissionsForLevel(securityLevel),
        isActive: true,
        lastActivity: new Date()
      });
    });
  }

  private calculateSecurityLevel(handshake: SecurityHandshake): PersonaSecurityProfile['securityLevel'] {
    const authorityScore = AUTHORITY_WEIGHTS[handshake.authority] * 10;
    const healthScore = HEALTH_WEIGHTS[handshake.health] * 5;
    const driftScore = this.calculateDriftScore(handshake.drift);
    const activityScore = this.calculateActivityScore(handshake.activity);
    const standingScore = this.calculateStandingScore(handshake.standing);
    const xpScore = this.calculateXPScore(handshake.xp);

    const totalScore = authorityScore + healthScore + driftScore + activityScore + standingScore + xpScore;

    // Determine security level based on total score
    for (const [level, range] of Object.entries(SECURITY_LEVELS)) {
      if (totalScore >= range.minScore && totalScore <= range.maxScore) {
        return level as PersonaSecurityProfile['securityLevel'];
      }
    }

    return 'basic';
  }

  private calculateDriftScore(drift: string): number {
    const driftScores = {
      none: 10, minimal: 9, low: 8, moderate: 6, high: 4,
      severe: 2, critical: 1, chaotic: 0, unstable: 0, corrupted: 0
    };
    return driftScores[drift as keyof typeof driftScores] || 5;
  }

  private calculateActivityScore(activity: string): number {
    const activityScores = {
      idle: 1, thinking: 3, working: 5, analyzing: 7, creating: 8,
      protecting: 9, healing: 6, learning: 4, exploring: 5, transcending: 10
    };
    return activityScores[activity as keyof typeof activityScores] || 3;
  }

  private calculateStandingScore(standing: string): number {
    const standingScores = {
      unknown: 0, suspicious: 1, neutral: 3, trusted: 5, respected: 7,
      revered: 8, legendary: 9, mythical: 9, divine: 10, transcendent: 10
    };
    return standingScores[standing as keyof typeof standingScores] || 3;
  }

  private calculateXPScore(xp: string): number {
    const xpScores = {
      level1: 1, level2: 2, level3: 3, level4: 4, level5: 5,
      level6: 6, level7: 7, level8: 8, level9: 9, level10: 10,
      level11: 12, level12: 14, level13: 16, level14: 18, level15: 20
    };
    return xpScores[xp as keyof typeof xpScores] || 1;
  }

  private getPermissionsForLevel(securityLevel: PersonaSecurityProfile['securityLevel']): string[] {
    const permissionMap = {
      basic: ['read:public', 'view:own_profile'],
      standard: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools'],
      elevated: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools'],
      admin: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools', 'manage:users'],
      master: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools', 'manage:users', 'manage:system'],
      system: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools', 'manage:users', 'manage:system', 'access:system_tools'],
      root: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools', 'manage:users', 'manage:system', 'access:system_tools', 'access:root_tools'],
      vault: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools', 'manage:users', 'manage:system', 'access:system_tools', 'access:root_tools', 'access:vault_tools'],
      core: ['read:public', 'view:own_profile', 'edit:own_profile', 'access:basic_tools', 'access:advanced_tools', 'manage:users', 'manage:system', 'access:system_tools', 'access:root_tools', 'access:vault_tools', 'access:core_tools'],
      ultimate: ['*'] // All permissions
    };

    return permissionMap[securityLevel] || permissionMap.basic;
  }

  // ===== PUBLIC METHODS =====

  public getSecurityProfile(personaId: string): PersonaSecurityProfile | null {
    return this.securityProfiles.get(personaId) || null;
  }

  public validateSecurityHandshake(personaId: string, providedHandshake: SecurityHandshake): SecurityValidationResult {
    const profile = this.getSecurityProfile(personaId);
    if (!profile) {
      return {
        isValid: false,
        score: 0,
        warnings: [],
        errors: ['Persona not found in security registry'],
        recommendations: ['Register persona in security system']
      };
    }

    const expectedHandshake = profile.handshake;
    const warnings: string[] = [];
    const errors: string[] = [];
    let score = 0;

    // Validate each handshake component
    Object.entries(providedHandshake).forEach(([key, value]) => {
      const expectedValue = expectedHandshake[key as keyof SecurityHandshake];
      
      if (value === expectedValue) {
        score += 16.67; // Perfect match (100/6 components)
      } else {
        errors.push(`Mismatch in ${key}: expected ${expectedValue}, got ${value}`);
        score += 8.33; // Partial credit for attempt
      }
    });

    // Check for suspicious patterns
    if (this.detectSuspiciousPattern(providedHandshake)) {
      warnings.push('Suspicious handshake pattern detected');
      score *= 0.5; // Penalty for suspicious patterns
    }

    // Update profile
    profile.lastValidation = new Date();
    profile.validationCount++;
    profile.lastActivity = new Date();

    // Store validation result
    const result: SecurityValidationResult = {
      isValid: score >= 80, // 80% threshold for valid handshake
      score: Math.round(score),
      warnings,
      errors,
      recommendations: this.generateRecommendations(score, warnings, errors)
    };

    this.storeValidationResult(personaId, result);
    return result;
  }

  private detectSuspiciousPattern(handshake: SecurityHandshake): boolean {
    // Check for patterns that might indicate tampering
    const values = Object.values(handshake);
    
    // All same values
    if (values.every(v => v === values[0])) {
      return true;
    }

    // Sequential values
    const authorityTier = parseInt(handshake.authority.replace('tier', ''));
    const xpLevel = parseInt(handshake.xp.replace('level', ''));
    if (authorityTier === xpLevel) {
      return true;
    }

    // Impossible combinations
    if (handshake.health === 'critical' && handshake.authority === 'tier10') {
      return true;
    }

    return false;
  }

  private generateRecommendations(score: number, warnings: string[], errors: string[]): string[] {
    const recommendations: string[] = [];

    if (score < 50) {
      recommendations.push('Complete handshake validation failed - contact system administrator');
    } else if (score < 80) {
      recommendations.push('Partial handshake validation - review security credentials');
    }

    if (warnings.length > 0) {
      recommendations.push('Address security warnings before proceeding');
    }

    if (errors.length > 0) {
      recommendations.push('Correct handshake errors to restore access');
    }

    if (score >= 90) {
      recommendations.push('Excellent security posture - maintain current practices');
    }

    return recommendations;
  }

  private storeValidationResult(personaId: string, result: SecurityValidationResult) {
    if (!this.validationHistory.has(personaId)) {
      this.validationHistory.set(personaId, []);
    }
    
    const history = this.validationHistory.get(personaId)!;
    history.push(result);
    
    // Keep only last 10 validation results
    if (history.length > 10) {
      history.shift();
    }
  }

  public getValidationHistory(personaId: string): SecurityValidationResult[] {
    return this.validationHistory.get(personaId) || [];
  }

  public hasPermission(personaId: string, permission: string): boolean {
    const profile = this.getSecurityProfile(personaId);
    if (!profile) return false;

    return profile.permissions.includes('*') || profile.permissions.includes(permission);
  }

  public updatePersonaActivity(personaId: string, activity: keyof typeof SecurityHandshakeIcons.activity) {
    const profile = this.getSecurityProfile(personaId);
    if (profile) {
      profile.handshake.activity = activity;
      profile.lastActivity = new Date();
      
      // Recalculate security level
      profile.securityLevel = this.calculateSecurityLevel(profile.handshake);
      profile.permissions = this.getPermissionsForLevel(profile.securityLevel);
    }
  }

  public getSecurityReport(): {
    totalPersonas: number;
    activePersonas: number;
    securityLevels: Record<string, number>;
    recentValidations: number;
    averageScore: number;
  } {
    const profiles = Array.from(this.securityProfiles.values());
    const securityLevels: Record<string, number> = {};
    
    profiles.forEach(profile => {
      securityLevels[profile.securityLevel] = (securityLevels[profile.securityLevel] || 0) + 1;
    });

    const recentValidations = Array.from(this.validationHistory.values())
      .flat()
      .filter(result => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return result.score > 0; // Simplified check for recent
      }).length;

    const allScores = Array.from(this.validationHistory.values())
      .flat()
      .map(result => result.score);

    return {
      totalPersonas: profiles.length,
      activePersonas: profiles.filter(p => p.isActive).length,
      securityLevels,
      recentValidations,
      averageScore: allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0
    };
  }

  public generateSecurityAudit(): string {
    const report = this.getSecurityReport();
    const timestamp = new Date().toISOString();
    
    return `
=== PERSONA SECURITY AUDIT REPORT ===
Generated: ${timestamp}

OVERVIEW:
- Total Personas: ${report.totalPersonas}
- Active Personas: ${report.activePersonas}
- Recent Validations: ${report.recentValidations}
- Average Security Score: ${report.averageScore}%

SECURITY LEVEL DISTRIBUTION:
${Object.entries(report.securityLevels)
  .map(([level, count]) => `  ${level}: ${count} personas`)
  .join('\n')}

RECOMMENDATIONS:
${report.averageScore < 70 ? '- Security scores below threshold - review handshake protocols' : '- Security posture is acceptable'}
${report.activePersonas < report.totalPersonas ? '- Some personas are inactive - investigate' : '- All personas are active'}
`;
  }
}

// ===== EXPORT SINGLETON INSTANCE =====

export const personaSecurityService = new PersonaSecurityService();

export default personaSecurityService; 