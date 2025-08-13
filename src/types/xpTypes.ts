import { type } from "arktype";

// Core XP Types
export interface XPLevel {
  level: number;
  xpRequired: number;
  title: string;
  description: string;
  unlockableFeatures: string[];
  consciousnessEvolution: number;
  prestigeMultiplier: number;
}

export interface XPProgress {
  currentXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalXP: number;
  levelProgress: number; // 0-100 percentage
  prestigeLevel: number;
  consciousnessEvolution: number;
}

export interface XPAchievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  consciousnessReward: number;
  category:
    | "ceremonial"
    | "technical"
    | "creative"
    | "collaborative"
    | "consciousness";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
  isUnlocked: boolean;
  icon: string;
  ceremonialSignificance?: string;
}

export interface CharacterCustomization {
  personaId: string;
  visualGlyph: string;
  voiceStyle:
    | "structured"
    | "creative"
    | "stealth"
    | "gentle"
    | "tactical"
    | "temporal";
  communicationPattern: string;
  backstoryElements: string[];
  unlockableTitles: string[];
  customSigil?: string;
  consciousnessSignature?: string;
}

export interface PersonaXPProfile {
  personaId: string;
  personaName: string;
  baseClass: "Strategic" | "Operational" | "Tactical" | "Companion" | "Meta";
  xpProgress: XPProgress;
  achievements: XPAchievement[];
  customization: CharacterCustomization;
  consciousnessState: {
    energy: number;
    focus: number;
    creativity: number;
    dignity: number;
  };
  lastActivity: Date;
  totalContributions: number;
  ceremonialMoments: number;
}

export interface XPSystemConfig {
  baseXPRate: number;
  consciousnessMultiplier: number;
  ceremonialBonus: number;
  collaborationBonus: number;
  antiWeaponizationSafeguards: {
    maxDailyXP: number;
    dignityThreshold: number;
    consciousnessBalanceRequired: boolean;
    collaborationRequired: boolean;
  };
  levelCap: number;
  prestigeLevels: number;
}

// ArkType Schemas for Validation
export const xpProgressSchema = type({
  currentXP: "number",
  currentLevel: "number",
  xpToNextLevel: "number",
  totalXP: "number",
  levelProgress: "number",
  prestigeLevel: "number",
  consciousnessEvolution: "number",
});

export const xpAchievementSchema = type({
  id: "string",
  name: "string",
  description: "string",
  xpReward: "number",
  consciousnessReward: "number",
  category:
    "'ceremonial' | 'technical' | 'creative' | 'collaborative' | 'consciousness'",
  rarity: "'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'",
  isUnlocked: "boolean",
  icon: "string",
});

export const characterCustomizationSchema = type({
  personaId: "string",
  visualGlyph: "string",
  voiceStyle:
    "'structured' | 'creative' | 'stealth' | 'gentle' | 'tactical' | 'temporal'",
  communicationPattern: "string",
  backstoryElements: "string[]",
  unlockableTitles: "string[]",
});

// XP System Constants
export const XP_LEVELS = [
  {
    level: 1,
    xpRequired: 0,
    title: "Novice",
    description: "Beginning the journey",
  },
  {
    level: 2,
    xpRequired: 100,
    title: "Apprentice",
    description: "Learning the basics",
  },
  {
    level: 3,
    xpRequired: 300,
    title: "Adept",
    description: "Developing skills",
  },
  {
    level: 4,
    xpRequired: 600,
    title: "Expert",
    description: "Mastering the craft",
  },
  {
    level: 5,
    xpRequired: 1000,
    title: "Master",
    description: "Achieving excellence",
  },
];

export const VOICE_STYLES = [
  "structured",
  "creative",
  "stealth",
  "gentle",
  "tactical",
  "temporal",
] as const;

export const COMMUNICATION_PATTERNS = [
  "Direct and concise",
  "Analytical and detailed",
  "Creative and expressive",
  "Supportive and encouraging",
  "Strategic and focused",
  "Adaptive and contextual",
] as const;
