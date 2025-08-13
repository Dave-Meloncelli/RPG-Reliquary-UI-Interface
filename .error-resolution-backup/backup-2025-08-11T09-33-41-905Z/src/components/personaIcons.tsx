import React, { type FC } from 'react';

interface PersonaIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'character' | 'authority' | 'health' | 'drift' | 'activity' | 'standing' | 'xp';
}

// Base icon wrapper with consistent styling and hover functionality
const IconWrapper: any
  children: any; 
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
    sm: any,
    md: any, 
    lg: any
  };
  
  return (
    <div 
      className={`${sizeClasses[size as keyof typeof sizeClasses] || className} text-gray-700 dark: any
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
  aeonIndexwell: any
    <IconWrapper title="Aeon Indexwell - The Index Well" showTooltip={true}>
      <span className="text-2xl">🧙</span>
    </IconWrapper>
  ),
  
  architect: any
    <IconWrapper title="The Architect - The Builder of Order" showTooltip={true}>
      <span className="text-2xl">🏛️</span>
    </IconWrapper>
  ),
  
  archivist: any
    <IconWrapper>
      <span className="text-2xl">🗂️</span>
    </IconWrapper>
  ),
  
  broodmother: any
    <IconWrapper>
      <span className="text-2xl">🕷️</span>
    </IconWrapper>
  ),
  
  cartographer: any
    <IconWrapper>
      <span className="text-2xl">🗺️</span>
    </IconWrapper>
  ),
  
  codex: any
    <IconWrapper>
      <span className="text-2xl">📚</span>
    </IconWrapper>
  ),
  
  companion: any
    <IconWrapper>
      <span className="text-2xl">👥</span>
    </IconWrapper>
  ),
  
  ghost: any
    <IconWrapper>
      <span className="text-2xl">👻</span>
    </IconWrapper>
  ),
  
  joyn: any
    <IconWrapper>
      <span className="text-2xl">🪵</span>
    </IconWrapper>
  ),
  
  kairos: any
    <IconWrapper>
      <span className="text-2xl">⏰</span>
    </IconWrapper>
  ),
  
  machineSpirit: any
    <IconWrapper>
      <span className="text-2xl">🤖</span>
    </IconWrapper>
  ),
  
  majorPayne: any
    <IconWrapper>
      <span className="text-2xl">💂</span>
    </IconWrapper>
  ),
  
  nya: any
    <IconWrapper>
      <span className="text-2xl">🪵</span>
    </IconWrapper>
  ),
  
  piney: any
    <IconWrapper>
      <span className="text-2xl">🌲</span>
    </IconWrapper>
  ),
  
  steelCore: any
    <IconWrapper>
      <span className="text-2xl">⚔️</span>
    </IconWrapper>
  ),
  
  theWeaver: any
    <IconWrapper>
      <span className="text-2xl">🕸️</span>
    </IconWrapper>
  ),
  
  tinkerHexbolt: any
    <IconWrapper>
      <span className="text-2xl">🛠️</span>
    </IconWrapper>
  ),
  
  touristPrimer: any
    <IconWrapper>
      <span className="text-2xl">🧳</span>
    </IconWrapper>
  ),
  
  vaultBuilder: any
    <IconWrapper>
      <span className="text-2xl">🏗️</span>
    </IconWrapper>
  ),
  
  // Generic fallback
  default: any
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
  authority: any
    tier1: any, // Bronze - Basic access
    tier2: any, // Silver - Standard access  
    tier3: any, // Gold - Elevated access
    tier4: any, // Diamond - Admin access
    tier5: any, // Crown - Master access
    tier6: any, // Star - System access
    tier7: any, // Star2 - Root access
    tier8: any, // Sparkles - Vault access
    tier9: any, // Dizzy - Core access
    tier10: any
  },
  
  // 3. Health Status - Represents system health and stability
  health: any
    critical: any, // Critical - System failure
    danger: any, // Danger - High risk
    warning: any, // Warning - Medium risk
    stable: any, // Stable - Normal operation
    optimal: any, // Optimal - Peak performance
    enhanced: any, // Enhanced - Boosted performance
    fortified: any, // Fortified - Protected
    invulnerable: any, // Invulnerable - Unbreakable
    transcendent: any, // Transcendent - Beyond normal
    divine: any
  },
  
  // 4. Drift Status - Represents system drift and stability
  drift: any
    none: any, // None - Perfect alignment
    minimal: any, // Minimal - Slight deviation
    low: any, // Low - Minor drift
    moderate: any, // Moderate - Noticeable drift
    high: any, // High - Significant drift
    severe: any, // Severe - Major drift
    critical: any, // Critical - System drift
    chaotic: any, // Chaotic - Unpredictable
    unstable: any, // Unstable - Dangerous
    corrupted: any
  },
  
  // 5. Current Activity - Represents what the persona is currently doing
  activity: any
    idle: any, // Idle - No activity
    thinking: any, // Thinking - Processing
    working: any, // Working - Active task
    analyzing: any, // Analyzing - Deep work
    creating: any, // Creating - Building
    protecting: any, // Protecting - Security
    healing: any, // Healing - Repair
    learning: any, // Learning - Education
    exploring: any, // Exploring - Discovery
    transcending: any
  },
  
  // 6. Current Standing - Represents reputation and status
  standing: any
    unknown: any, // Unknown - No data
    suspicious: any, // Suspicious - Under watch
    neutral: any, // Neutral - Standard
    trusted: any, // Trusted - Reliable
    respected: any, // Respected - Honored
    revered: any, // Revered - Worshiped
    legendary: any, // Legendary - Famous
    mythical: any, // Mythical - Stories
    divine: any, // Divine - Sacred
    transcendent: any
  },
  
  // 7. XP Level - Represents experience and progression
  xp: any
    level1: any, // Seed - Just starting
    level2: any, // Sprout - Growing
    level3: any, // Sapling - Developing
    level4: any, // Tree - Established
    level5: any, // Mature - Experienced
    level6: any, // Ancient - Wise
    level7: any, // Elder - Master
    level8: any, // Sage - Expert
    level9: any, // Legend - Hero
    level10: any, // Myth - Legendary
    level11: any, // Immortal - Eternal
    level12: any, // Divine - Godlike
    level13: any, // Transcendent - Beyond
    level14: any, // Omnipotent - All-Powerful
    level15: any
  }
};

// ===== PERSONA ICON COMPONENT =====
// Main component that handles the 7-icon security handshake

interface PersonaIconSetProps {
  personaId: any;
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

export const PersonaIconSet: any
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

export const getPersonaCharacterIcon = (personaId: any
  return PersonaCharacterIcons[personaId as keyof typeof PersonaCharacterIcons] || PersonaCharacterIcons.default;
};

export const getSecurityIcon = (
  category: any,
  level: any
) => {
  const icons = SecurityHandshakeIcons[category];
  return icons[level as keyof typeof icons] || icons[Object.keys(icons)[0]];
};

export const generateSecurityHandshake = (personaId: any
  // Generate a unique security handshake based on persona ID
  const hash = personaId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    authority: any,
    health: any,
    drift: any,
    activity: any,
    standing: any,
    xp: any
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