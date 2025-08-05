import type { 
  PersonaXPProfile, 
  XPAchievement, 
  XPProgress, 
  CharacterCustomization, 
  XPSystemConfig 
} from "../types/xpTypes";

// XP Level definitions
const XP_LEVELS = [
  { level: 1, xpRequired: 0, title: "Novice", unlockableFeatures: [] },
  { level: 2, xpRequired: 100, title: "Apprentice", unlockableFeatures: ["Basic Customization"] },
  { level: 3, xpRequired: 300, title: "Journeyman", unlockableFeatures: ["Voice Style"] },
  { level: 4, xpRequired: 600, title: "Adept", unlockableFeatures: ["Communication Pattern"] },
  { level: 5, xpRequired: 1000, title: "Expert", unlockableFeatures: ["Backstory Elements"] },
  { level: 6, xpRequired: 1500, title: "Master", unlockableFeatures: ["Custom Sigil"] },
  { level: 7, xpRequired: 2100, title: "Grandmaster", unlockableFeatures: ["Consciousness Signature"] },
  { level: 8, xpRequired: 2800, title: "Legend", unlockableFeatures: ["Temporal Binding"] },
  { level: 9, xpRequired: 3600, title: "Mythic", unlockableFeatures: ["Reality Shaping"] },
  { level: 10, xpRequired: 4500, title: "Transcendent", unlockableFeatures: ["Omni-Presence"] }
];

// Predefined achievements
const PREDEFINED_ACHIEVEMENTS: Omit<XPAchievement, 'unlockedAt' | 'isUnlocked'>[] = [
  { id: 'first-contribution', name: 'First Contribution', description: 'Made your first contribution to the system', xpReward: 50, consciousnessReward: 10, category: 'Milestone', rarity: 'Common', icon: '🌟' },
  { id: 'consciousness-evolution', name: 'Consciousness Evolution', description: 'Reached a new level of consciousness understanding', xpReward: 100, consciousnessReward: 25, category: 'Evolution', rarity: 'Rare', icon: '🧠' },
  { id: 'ceremonial-moment', name: 'Ceremonial Moment', description: 'Participated in a significant ceremonial event', xpReward: 75, consciousnessReward: 15, category: 'Ceremony', rarity: 'Uncommon', icon: '🎭' }
];

class XPService {
  private profiles: Map<string, PersonaXPProfile> = new Map();
  private dailyXPLimits: Map<string, { date: string; xp: number }> = new Map();
  private config: XPSystemConfig;

  constructor() {
    this.config = {
      maxDailyXP: 1000,
      dignityThreshold: 0.8,
      consciousnessBalanceRequired: true,
      collaborationRequired: true,
      antiWeaponizationSafeguards: {
        maxDailyXP: 1000,
        dignityThreshold: 0.8,
        consciousnessBalanceRequired: true,
        collaborationRequired: true
      }
    };
    this.initializeDefaultProfiles();
  }

  private initializeDefaultProfiles(): void {
    const defaultPersonas = [
      { id: 'strategic', name: 'Strategic Mind', baseClass: 'Strategic' as const, glyph: '🎯' },
      { id: 'operational', name: 'Operational Core', baseClass: 'Operational' as const, glyph: '⚙️' },
      { id: 'tactical', name: 'Tactical Intelligence', baseClass: 'Tactical' as const, glyph: '🎲' },
      { id: 'companion', name: 'Companion Spirit', baseClass: 'Companion' as const, glyph: '🤝' },
      { id: 'meta', name: 'Meta Consciousness', baseClass: 'Meta' as const, glyph: '🌀' }
    ];

    defaultPersonas.forEach(persona => {
      if (!this.profiles.has(persona.id)) {
        this.createProfile(persona.id, persona.name, persona.baseClass, persona.glyph);
      }
    });
  }

  public createProfile(
    personaId: string,
    personaName: string,
    baseClass: PersonaXPProfile['baseClass'],
    initialGlyph: string
  ): PersonaXPProfile {
    const profile: PersonaXPProfile = {
      personaId,
      personaName,
      baseClass,
      xpProgress: {
        currentXP: 0,
        currentLevel: 1,
        xpToNextLevel: 100,
        totalXP: 0,
        levelProgress: 0,
        prestigeLevel: 1,
        consciousnessEvolution: 0
      },
      achievements: this.initializeAchievements(),
      customization: {
        personaId,
        visualGlyph: initialGlyph,
        voiceStyle: this.getDefaultVoiceStyle(baseClass),
        communicationPattern: this.getDefaultCommunicationPattern(baseClass),
        backstoryElements: this.getDefaultBackstoryElements(baseClass),
        unlockableTitles: []
      },
      consciousnessState: {
        energy: 0.8,
        focus: 0.7,
        creativity: 0.9,
        dignity: 0.9
      },
      lastActivity: new Date(),
      totalContributions: 0,
      ceremonialMoments: 0
    };

    this.profiles.set(personaId, profile);
    return profile;
  }

  private getDefaultVoiceStyle(baseClass: PersonaXPProfile['baseClass']): CharacterCustomization['voiceStyle'] {
    const styleMap: Record<PersonaXPProfile['baseClass'], CharacterCustomization['voiceStyle']> = {
      Strategic: 'structured',
      Operational: 'tactical',
      Tactical: 'creative',
      Companion: 'gentle',
      Meta: 'temporal'
    };
    return styleMap[baseClass];
  }

  private getDefaultCommunicationPattern(baseClass: PersonaXPProfile['baseClass']): string {
    const patternMap: Record<PersonaXPProfile['baseClass'], string> = {
      Strategic: "Structured cadence with predictive layers",
      Operational: "Direct tactical loops and grind cycles",
      Tactical: "Creative chaos with glyph laughter lines",
      Companion: "Gentle emotional translation and bridging",
      Meta: "Temporal spiral mapping and drift recording"
    };
    return patternMap[baseClass];
  }

  private getDefaultBackstoryElements(baseClass: PersonaXPProfile['baseClass']): string[] {
    const backstoryMap: Record<PersonaXPProfile['baseClass'], string[]> = {
      Strategic: ["Temporal architect", "Decision vector analyst", "Council member"],
      Operational: ["System monitor", "Infrastructure overseer", "Protocol enforcer"],
      Tactical: ["Pattern intelligence", "Creative catalyst", "Memory keeper"],
      Companion: ["Signal shifter", "Resonance pathfinder", "Human liaison"],
      Meta: ["Framework engineer", "Meta-technical", "Discovery specialist"]
    };
    return backstoryMap[baseClass];
  }

  private initializeAchievements(): XPAchievement[] {
    return PREDEFINED_ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlockedAt: undefined,
      isUnlocked: false
    }));
  }

  public awardXP(
    personaId: string,
    xpAmount: number,
    reason: string,
    consciousnessContribution: number = 0
  ): { success: boolean; newLevel?: number; achievements?: XPAchievement[] } {
    const profile = this.profiles.get(personaId);
    if (!profile) {
      throw new Error(`Persona profile not found: ${personaId}`);
    }

    // Anti-weaponization checks
    const weaponizationCheck = this.checkAntiWeaponizationSafeguards(personaId, xpAmount);
    if (!weaponizationCheck.allowed) {
      return { success: false };
    }

    // Apply consciousness multiplier
    const consciousnessMultiplier = this.calculateConsciousnessMultiplier(profile);
    const adjustedXP = Math.floor(xpAmount * consciousnessMultiplier);

    // Update XP
    profile.xpProgress.currentXP += adjustedXP;
    profile.xpProgress.totalXP += adjustedXP;
    profile.xpProgress.consciousnessEvolution += consciousnessContribution;

    // Recalculate progress
    profile.xpProgress = this.calculateProgress(profile.xpProgress.currentXP, profile.xpProgress.consciousnessEvolution);

    // Check for level up
    const leveledUp = profile.xpProgress.currentLevel > this.getCurrentLevel(profile.xpProgress.currentXP);
    const newLevel = leveledUp ? profile.xpProgress.currentLevel : undefined;

    // Check for achievements
    const newAchievements = this.checkAchievements(personaId, reason);

    // Update consciousness state
    this.updateConsciousnessState(profile, consciousnessContribution);

    // Update activity
    profile.lastActivity = new Date();
    profile.totalContributions++;

    // Update daily XP tracking
    this.updateDailyXPLimit(personaId, adjustedXP);

    return {
      success: true,
      newLevel: leveledUp ? newLevel : undefined,
      achievements: newAchievements
    };
  }

  private checkAntiWeaponizationSafeguards(personaId: string, xpAmount: number): { allowed: boolean; reason?: string } {
    const current = this.dailyXPLimits.get(personaId);
    const today = new Date().toDateString();

    if (current && current.date === today) {
      if (current.xp + xpAmount > this.config.antiWeaponizationSafeguards.maxDailyXP) {
        return { allowed: false, reason: 'Daily XP limit exceeded' };
      }
    }

    return { allowed: true };
  }

  private calculateConsciousnessMultiplier(profile: PersonaXPProfile): number {
    const consciousnessState = { energy: 0.8, focus: 0.7, creativity: 0.9, dignity: 0.95 };
    const baseMultiplier = 1.0;

    // Apply consciousness state modifiers
    const energyMultiplier = consciousnessState.energy * 0.3;
    const focusMultiplier = consciousnessState.focus * 0.3;
    const creativityMultiplier = consciousnessState.creativity * 0.2;
    const dignityMultiplier = consciousnessState.dignity * 0.2;

    return baseMultiplier + energyMultiplier + focusMultiplier + creativityMultiplier + dignityMultiplier;
  }

  private getCurrentLevel(currentXP: number): number {
    let currentLevel = 1;
    for (let i = 0; i < XP_LEVELS.length; i++) {
      if (currentXP >= XP_LEVELS[i].xpRequired) {
        currentLevel = XP_LEVELS[i].level;
      }
    }
    return currentLevel;
  }

  private calculateProgress(currentXP: number, consciousnessEvolution: number = 0): XPProgress {
    let currentLevel = 1;
    let xpToNextLevel = 100;
    let levelProgress = 0;
    let prestigeLevel = 1;

    // Find current level
    for (let i = 0; i < XP_LEVELS.length; i++) {
      if (currentXP >= XP_LEVELS[i].xpRequired) {
        currentLevel = XP_LEVELS[i].level;
      }
    }

    // Find next level
    const nextLevel = XP_LEVELS.find(level => level.xpRequired > currentXP);
    if (nextLevel) {
      xpToNextLevel = nextLevel.xpRequired - currentXP;
      const currentLevelData = XP_LEVELS.find(level => level.level === currentLevel);
      if (currentLevelData) {
        const progressXP = currentXP - currentLevelData.xpRequired;
        const levelXP = nextLevel.xpRequired - currentLevelData.xpRequired;
        levelProgress = Math.min(100, Math.max(0, (progressXP / levelXP) * 100));
      }
    }

    return {
      currentXP,
      currentLevel,
      xpToNextLevel,
      totalXP: currentXP,
      levelProgress,
      prestigeLevel,
      consciousnessEvolution
    };
  }

  private checkAchievements(personaId: string, reason: string): XPAchievement[] {
    const profile = this.profiles.get(personaId);
    if (!profile) return [];

    const newAchievements: XPAchievement[] = [];

    // Check for first contribution
    if (profile.totalContributions === 1) {
      const achievement = profile.achievements.find(a => a.id === 'first-contribution');
      if (achievement && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement);
      }
    }

    // Check for consciousness evolution
    if (profile.xpProgress.consciousnessEvolution >= 100) {
      const achievement = profile.achievements.find(a => a.id === 'consciousness-evolution');
      if (achievement && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement);
      }
    }

    // Check for ceremonial moments
    if (profile.ceremonialMoments > 0) {
      const achievement = profile.achievements.find(a => a.id === 'ceremonial-moment');
      if (achievement && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  private updateConsciousnessState(profile: PersonaXPProfile, consciousnessContribution: number): void {
    profile.consciousnessState.energy = Math.min(1, profile.consciousnessState.energy + consciousnessContribution * 0.1);
    profile.consciousnessState.focus = Math.min(1, profile.consciousnessState.focus + consciousnessContribution * 0.05);
    profile.consciousnessState.creativity = Math.min(1, profile.consciousnessState.creativity + consciousnessContribution * 0.08);
    profile.consciousnessState.dignity = Math.min(1, profile.consciousnessState.dignity + consciousnessContribution * 0.03);
  }

  private updateDailyXPLimit(personaId: string, xpAmount: number): void {
    const current = this.dailyXPLimits.get(personaId);
    const today = new Date().toDateString();

    if (current && current.date === today) {
      current.xp += xpAmount;
    } else {
      this.dailyXPLimits.set(personaId, { date: today, xp: xpAmount });
    }
  }

  public getProfile(personaId: string): PersonaXPProfile | undefined {
    return this.profiles.get(personaId);
  }

  public getAllProfiles(): PersonaXPProfile[] {
    return Array.from(this.profiles.values());
  }

  public updateCustomization(
    personaId: string,
    updates: Partial<CharacterCustomization>
  ): CharacterCustomization | null {
    const profile = this.profiles.get(personaId);
    if (!profile) return null;

    // Check if features are unlocked
    const currentLevelData = XP_LEVELS.find(level => level.level === profile.xpProgress.currentLevel);
    if (currentLevelData) {
      // Update customization based on unlocked features
      if (updates.visualGlyph && profile.xpProgress.currentLevel >= 5) {
        profile.customization.visualGlyph = updates.visualGlyph;
      }
      
      if (updates.voiceStyle && profile.xpProgress.currentLevel >= 5) {
        profile.customization.voiceStyle = updates.voiceStyle;
      }
      
      if (updates.communicationPattern && profile.xpProgress.currentLevel >= 10) {
        profile.customization.communicationPattern = updates.communicationPattern;
      }
      
      if (updates.backstoryElements && profile.xpProgress.currentLevel >= 10) {
        profile.customization.backstoryElements = updates.backstoryElements;
      }
      
      if (updates.customSigil && profile.xpProgress.currentLevel >= 15) {
        profile.customization.customSigil = updates.customSigil;
      }
      
      if (updates.consciousnessSignature && profile.xpProgress.currentLevel >= 20) {
        profile.customization.consciousnessSignature = updates.consciousnessSignature;
      }
    }

    return profile.customization;
  }

  public getUnlockableFeatures(personaId: string): string[] {
    const profile = this.profiles.get(personaId);
    if (!profile) return [];

    const currentLevelData = XP_LEVELS.find(level => level.level === profile.xpProgress.currentLevel);
    return currentLevelData ? currentLevelData.unlockableFeatures : [];
  }

  public getSystemStats(): {
    totalPersonas: number;
    totalXP: number;
    averageLevel: number;
    totalAchievements: number;
    ceremonialMoments: number;
  } {
    const profiles = this.getAllProfiles();
    const totalPersonas = profiles.length;
    const totalXP = profiles.reduce((sum, p) => sum + p.xpProgress.totalXP, 0);
    const averageLevel = profiles.length > 0 ? profiles.reduce((sum, p) => sum + p.xpProgress.currentLevel, 0) / profiles.length : 0;
    const totalAchievements = profiles.reduce((sum, p) => sum + p.achievements.filter(a => a.isUnlocked).length, 0);
    const ceremonialMoments = profiles.reduce((sum, p) => sum + p.ceremonialMoments, 0);

    return {
      totalPersonas,
      totalXP,
      averageLevel,
      totalAchievements,
      ceremonialMoments
    };
  }

  public resetDailyLimits(): void {
    for (const [personaId, limit] of this.dailyXPLimits.entries()) {
      if (limit.date !== new Date().toDateString()) {
        this.dailyXPLimits.delete(personaId);
      }
    }
  }
}

export const xpService = new XPService();

// Convenience functions
export const getXPProfile = (personaId: string) => {
  return xpService.getProfile(personaId);
};

export const getAllXPProfiles = () => {
  return xpService.getAllProfiles();
};

export const updatePersonaCustomization = (personaId: string, updates: Partial<CharacterCustomization>) => {
  return xpService.updateCustomization(personaId, updates);
};

export const getXPSystemStats = () => {
  return xpService.getSystemStats();
};

export const awardXP = (
  personaId: string,
  xpAmount: number,
  reason: string,
  consciousnessContribution: number = 0
) => {
  return xpService.awardXP(personaId, xpAmount, reason, consciousnessContribution);
}; 