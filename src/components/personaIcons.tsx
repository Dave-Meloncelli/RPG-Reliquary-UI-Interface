import React, { type FC } from 'react';

interface PersonaIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'character' | 'authority' | 'health' | 'drift' | 'activity' | 'standing' | 'xp';
}

// Base icon wrapper with consistent styling and hover functionality
const IconWrapper: FC<{ 
  children: React.ReactNode; 
  className?: string; 
  size?: string;
  title?: string;
  showTooltip?: boolean;
}> = ({ 
  children, 
  className = "w-6 h-6", 
  size,
  title,
  showTooltip = true
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };
  
  return (
    <div 
      className={`${sizeClasses[size as keyof typeof sizeClasses] || className} text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-help`}
      title={showTooltip && title ? title : undefined}
    >
      {children}
    </div>
  );
};

// ===== PERSONA CHARACTER ICONS (VISIBLE) =====
// These are the primary character icons that appear in public view

export const PersonaCharacterIcons = {
  // Core Personas
  aeonIndexwell: () => (
    <IconWrapper title="Aeon Indexwell - The Index Well" showTooltip={true}>
      <span className="text-2xl">🧙</span>
    </IconWrapper>
  ),
  
  architect: () => (
    <IconWrapper title="The Architect - The Builder of Order" showTooltip={true}>
      <span className="text-2xl">🏛️</span>
    </IconWrapper>
  ),
  
  archivist: () => (
    <IconWrapper>
      <span className="text-2xl">🗂️</span>
    </IconWrapper>
  ),
  
  broodmother: () => (
    <IconWrapper>
      <span className="text-2xl">🕷️</span>
    </IconWrapper>
  ),
  
  cartographer: () => (
    <IconWrapper>
      <span className="text-2xl">🗺️</span>
    </IconWrapper>
  ),
  
  codex: () => (
    <IconWrapper>
      <span className="text-2xl">📚</span>
    </IconWrapper>
  ),
  
  companion: () => (
    <IconWrapper>
      <span className="text-2xl">👥</span>
    </IconWrapper>
  ),
  
  ghost: () => (
    <IconWrapper>
      <span className="text-2xl">👻</span>
    </IconWrapper>
  ),
  
  joyn: () => (
    <IconWrapper>
      <span className="text-2xl">🪵</span>
    </IconWrapper>
  ),
  
  kairos: () => (
    <IconWrapper>
      <span className="text-2xl">⏰</span>
    </IconWrapper>
  ),
  
  machineSpirit: () => (
    <IconWrapper>
      <span className="text-2xl">🤖</span>
    </IconWrapper>
  ),
  
  majorPayne: () => (
    <IconWrapper>
      <span className="text-2xl">💂</span>
    </IconWrapper>
  ),
  
  nya: () => (
    <IconWrapper>
      <span className="text-2xl">🪵</span>
    </IconWrapper>
  ),
  
  piney: () => (
    <IconWrapper>
      <span className="text-2xl">🌲</span>
    </IconWrapper>
  ),
  
  steelCore: () => (
    <IconWrapper>
      <span className="text-2xl">⚔️</span>
    </IconWrapper>
  ),
  
  theWeaver: () => (
    <IconWrapper>
      <span className="text-2xl">🕸️</span>
    </IconWrapper>
  ),
  
  tinkerHexbolt: () => (
    <IconWrapper>
      <span className="text-2xl">🛠️</span>
    </IconWrapper>
  ),
  
  touristPrimer: () => (
    <IconWrapper>
      <span className="text-2xl">🧳</span>
    </IconWrapper>
  ),
  
  vaultBuilder: () => (
    <IconWrapper>
      <span className="text-2xl">🏗️</span>
    </IconWrapper>
  ),
  
  // Generic fallback
  default: () => (
    <IconWrapper>
      <span className="text-2xl">👤</span>
    </IconWrapper>
  )
};

// ===== SECURITY HANDSHAKE ICONS (BACKEND) =====
// These 6 icons represent the security handshake system
// They are human-readable but not easily tracked outside the vault

export const SecurityHandshakeIcons = {
  // 2. Authority Tier - Represents clearance level and permissions
  authority: {
    tier1: () => <span className="text-lg">🥉</span>, // Bronze - Basic access
    tier2: () => <span className="text-lg">🥈</span>, // Silver - Standard access  
    tier3: () => <span className="text-lg">🥇</span>, // Gold - Elevated access
    tier4: () => <span className="text-lg">💎</span>, // Diamond - Admin access
    tier5: () => <span className="text-lg">👑</span>, // Crown - Master access
    tier6: () => <span className="text-lg">⭐</span>, // Star - System access
    tier7: () => <span className="text-lg">🌟</span>, // Star2 - Root access
    tier8: () => <span className="text-lg">✨</span>, // Sparkles - Vault access
    tier9: () => <span className="text-lg">💫</span>, // Dizzy - Core access
    tier10: () => <span className="text-lg">🌠</span> // Shooting Star - Ultimate access
  },
  
  // 3. Health Status - Represents system health and stability
  health: {
    critical: () => <span className="text-lg">💀</span>, // Critical - System failure
    danger: () => <span className="text-lg">🩸</span>, // Danger - High risk
    warning: () => <span className="text-lg">⚠️</span>, // Warning - Medium risk
    stable: () => <span className="text-lg">🟢</span>, // Stable - Normal operation
    optimal: () => <span className="text-lg">💚</span>, // Optimal - Peak performance
    enhanced: () => <span className="text-lg">🔋</span>, // Enhanced - Boosted performance
    fortified: () => <span className="text-lg">🛡️</span>, // Fortified - Protected
    invulnerable: () => <span className="text-lg">💎</span>, // Invulnerable - Unbreakable
    transcendent: () => <span className="text-lg">🌈</span>, // Transcendent - Beyond normal
    divine: () => <span className="text-lg">👼</span> // Divine - Perfect state
  },
  
  // 4. Drift Status - Represents system drift and stability
  drift: {
    none: () => <span className="text-lg">🎯</span>, // None - Perfect alignment
    minimal: () => <span className="text-lg">🎪</span>, // Minimal - Slight deviation
    low: () => <span className="text-lg">🎭</span>, // Low - Minor drift
    moderate: () => <span className="text-lg">🎨</span>, // Moderate - Noticeable drift
    high: () => <span className="text-lg">🎪</span>, // High - Significant drift
    severe: () => <span className="text-lg">🎭</span>, // Severe - Major drift
    critical: () => <span className="text-lg">🎪</span>, // Critical - System drift
    chaotic: () => <span className="text-lg">🎭</span>, // Chaotic - Unpredictable
    unstable: () => <span className="text-lg">🎪</span>, // Unstable - Dangerous
    corrupted: () => <span className="text-lg">🎭</span> // Corrupted - System failure
  },
  
  // 5. Current Activity - Represents what the persona is currently doing
  activity: {
    idle: () => <span className="text-lg">😴</span>, // Idle - No activity
    thinking: () => <span className="text-lg">🤔</span>, // Thinking - Processing
    working: () => <span className="text-lg">💼</span>, // Working - Active task
    analyzing: () => <span className="text-lg">🔍</span>, // Analyzing - Deep work
    creating: () => <span className="text-lg">🎨</span>, // Creating - Building
    protecting: () => <span className="text-lg">🛡️</span>, // Protecting - Security
    healing: () => <span className="text-lg">💊</span>, // Healing - Repair
    learning: () => <span className="text-lg">📖</span>, // Learning - Education
    exploring: () => <span className="text-lg">🗺️</span>, // Exploring - Discovery
    transcending: () => <span className="text-lg">✨</span> // Transcending - Evolution
  },
  
  // 6. Current Standing - Represents reputation and status
  standing: {
    unknown: () => <span className="text-lg">❓</span>, // Unknown - No data
    suspicious: () => <span className="text-lg">👁️</span>, // Suspicious - Under watch
    neutral: () => <span className="text-lg">😐</span>, // Neutral - Standard
    trusted: () => <span className="text-lg">🤝</span>, // Trusted - Reliable
    respected: () => <span className="text-lg">👑</span>, // Respected - Honored
    revered: () => <span className="text-lg">🙏</span>, // Revered - Worshiped
    legendary: () => <span className="text-lg">🏆</span>, // Legendary - Famous
    mythical: () => <span className="text-lg">🐉</span>, // Mythical - Stories
    divine: () => <span className="text-lg">👼</span>, // Divine - Sacred
    transcendent: () => <span className="text-lg">⭐</span> // Transcendent - Beyond
  },
  
  // 7. XP Level - Represents experience and progression
  xp: {
    level1: () => <span className="text-lg" title="Seed - Just starting">🌱</span>, // Seed - Just starting
    level2: () => <span className="text-lg" title="Sprout - Growing">🌿</span>, // Sprout - Growing
    level3: () => <span className="text-lg" title="Sapling - Developing">🌳</span>, // Sapling - Developing
    level4: () => <span className="text-lg" title="Tree - Established">🌲</span>, // Tree - Established
    level5: () => <span className="text-lg" title="Mature - Experienced">🌳</span>, // Mature - Experienced
    level6: () => <span className="text-lg" title="Ancient - Wise">🌲</span>, // Ancient - Wise
    level7: () => <span className="text-lg" title="Elder - Master">🌳</span>, // Elder - Master
    level8: () => <span className="text-lg" title="Sage - Expert">🌲</span>, // Sage - Expert
    level9: () => <span className="text-lg" title="Legend - Hero">🌳</span>, // Legend - Hero
    level10: () => <span className="text-lg" title="Myth - Legendary">🌲</span>, // Myth - Legendary
    level11: () => <span className="text-lg" title="Immortal - Eternal">🌟</span>, // Immortal - Eternal
    level12: () => <span className="text-lg" title="Divine - Godlike">👑</span>, // Divine - Godlike
    level13: () => <span className="text-lg" title="Transcendent - Beyond">✨</span>, // Transcendent - Beyond
    level14: () => <span className="text-lg" title="Omnipotent - All-Powerful">💫</span>, // Omnipotent - All-Powerful
    level15: () => <span className="text-lg" title="Infinite - Limitless">🌠</span> // Infinite - Limitless
  }
};

// ===== PERSONA ICON COMPONENT =====
// Main component that handles the 7-icon security handshake

interface PersonaIconSetProps {
  personaId: string;
  showSecurityIcons?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  securityData?: {
    authority?: keyof typeof SecurityHandshakeIcons.authority;
    health?: keyof typeof SecurityHandshakeIcons.health;
    drift?: keyof typeof SecurityHandshakeIcons.drift;
    activity?: keyof typeof SecurityHandshakeIcons.activity;
    standing?: keyof typeof SecurityHandshakeIcons.standing;
    xp?: keyof typeof SecurityHandshakeIcons.xp;
  };
}

export const PersonaIconSet: FC<PersonaIconSetProps> = ({
  personaId,
  showSecurityIcons = false,
  className = "",
  size = "md",
  securityData = {}
}) => {
  // Get character icon
  const characterIcon = PersonaCharacterIcons[personaId as keyof typeof PersonaCharacterIcons] || PersonaCharacterIcons.default;
  
  // Get security icons
  const securityIcons = showSecurityIcons ? [
    SecurityHandshakeIcons.authority[securityData.authority || 'tier1'],
    SecurityHandshakeIcons.health[securityData.health || 'stable'],
    SecurityHandshakeIcons.drift[securityData.drift || 'none'],
    SecurityHandshakeIcons.activity[securityData.activity || 'idle'],
    SecurityHandshakeIcons.standing[securityData.standing || 'neutral'],
    SecurityHandshakeIcons.xp[securityData.xp || 'level1']
  ] : [];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Character Icon (Always Visible) */}
      <div className="flex-shrink-0">
        {characterIcon()}
      </div>
      
      {/* Security Icons (Backend Only) */}
      {showSecurityIcons && (
        <div className="flex items-center space-x-0.5 opacity-60">
          {securityIcons.map((Icon, index) => (
            <div key={index} className="flex-shrink-0">
              <Icon />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== UTILITY FUNCTIONS =====

export const getPersonaCharacterIcon = (personaId: string) => {
  return PersonaCharacterIcons[personaId as keyof typeof PersonaCharacterIcons] || PersonaCharacterIcons.default;
};

export const getSecurityIcon = (
  category: keyof typeof SecurityHandshakeIcons,
  level: string
) => {
  const icons = SecurityHandshakeIcons[category];
  return icons[level as keyof typeof icons] || icons[Object.keys(icons)[0]];
};

export const generateSecurityHandshake = (personaId: string) => {
  // Generate a unique security handshake based on persona ID
  const hash = personaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    authority: Object.keys(SecurityHandshakeIcons.authority)[hash % 10] as keyof typeof SecurityHandshakeIcons.authority,
    health: Object.keys(SecurityHandshakeIcons.health)[(hash + 1) % 10] as keyof typeof SecurityHandshakeIcons.health,
    drift: Object.keys(SecurityHandshakeIcons.drift)[(hash + 2) % 10] as keyof typeof SecurityHandshakeIcons.drift,
    activity: Object.keys(SecurityHandshakeIcons.activity)[(hash + 3) % 10] as keyof typeof SecurityHandshakeIcons.activity,
    standing: Object.keys(SecurityHandshakeIcons.standing)[(hash + 4) % 10] as keyof typeof SecurityHandshakeIcons.standing,
    xp: Object.keys(SecurityHandshakeIcons.xp)[(hash + 5) % 10] as keyof typeof SecurityHandshakeIcons.xp
  };
};

// ===== EXPORT ALL ICONS =====
export default {
  PersonaCharacterIcons,
  SecurityHandshakeIcons,
  PersonaIconSet,
  getPersonaCharacterIcon,
  getSecurityIcon,
  generateSecurityHandshake
}; 