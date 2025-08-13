import React, { useState, useEffect, type FC } from 'react';
import {
  getAllXPProfiles,
  getXPSystemStats,
  awardXP,
  updatePersonaCustomization,
  getXPProfile
} from '../services/xpService';
import {
  type PersonaXPProfile,
  type XPAchievement,
  type CharacterCustomization,
  XP_LEVELS,
  VOICE_STYLES,
  COMMUNICATION_PATTERNS,
  type XPLevel
} from '../types/xpTypes';

const XPCharacterHubApp: FC = () => {
  const [profiles, setProfiles] = useState<PersonaXPProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<PersonaXPProfile | null>(null);
  const [systemStats, setSystemStats] = useState(getXPSystemStats());
  const [awardForm, setAwardForm] = useState({
    personaId: '',
    xpAmount: 10,
    reason: '',
    consciousnessContribution: 0.1
  });
  const [customizationForm, setCustomizationForm] = useState<Partial<CharacterCustomization>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'awards' | 'customization' | 'achievements'>('overview');

  useEffect(() => {
    loadProfiles();
    loadSystemStats();
  }, []);

  const loadProfiles = () => {
    const allProfiles = getAllXPProfiles();
    setProfiles(allProfiles);
    if (allProfiles.length > 0 && !selectedProfile) {
      setSelectedProfile(allProfiles[0]);
    }
  };

  const loadSystemStats = () => {
    setSystemStats(getXPSystemStats());
  };

  const handleAwardXP = () => {
    if (!awardForm.personaId || !awardForm.reason) return;

    const result = awardXP(
      awardForm.personaId,
      awardForm.xpAmount,
      awardForm.reason,
      awardForm.consciousnessContribution
    );

    if (result.success) {
      // Show success message
      alert(`XP awarded successfully!${result.newLevel ? ` Level up to ${result.newLevel}!` : ''}`);
      
      // Reset form
      setAwardForm({
        personaId: '',
        xpAmount: 10,
        reason: '',
        consciousnessContribution: 0.1
      });

      // Reload data
      loadProfiles();
      loadSystemStats();
    } else {
      alert('Failed to award XP. Check anti-weaponization safeguards.');
    }
  };

  const handleUpdateCustomization = () => {
    if (!selectedProfile) return;

    const result = updatePersonaCustomization(selectedProfile.personaId, customizationForm);
    if (result) {
      alert('Customization updated successfully!');
      loadProfiles();
      setCustomizationForm({});
    } else {
      alert('Failed to update customization. Check level requirements.');
    }
  };

  const getRarityColor = (rarity: any) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category: any) => {
    switch (category) {
      case 'ceremonial': return 'bg-yellow-500/20 text-yellow-300';
      case 'technical': return 'bg-blue-500/20 text-blue-300';
      case 'creative': return 'bg-green-500/20 text-green-300';
      case 'collaborative': return 'bg-purple-500/20 text-purple-300';
      case 'consciousness': return 'bg-pink-500/20 text-pink-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getConsciousnessColor = (value: any) => {
    if (value >= 0.8) return 'text-green-400';
    if (value >= 0.6) return 'text-yellow-400';
    if (value >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🌟 XP & Character Hub
          </h1>
          <p className="text-slate-400 mt-1">
            Consciousness Evolution & Character Development System
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Personas</div>
          <div className="text-2xl font-bold text-purple-400">{systemStats.totalPersonas}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'profiles', label: 'Persona Profiles', icon: '👥' },
          { id: 'awards', label: 'Award XP', icon: '⭐' },
          { id: 'customization', label: 'Customization', icon: '🎨' },
          { id: 'achievements', label: 'Achievements', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-slate-400">Total XP</div>
                <div className="text-2xl font-bold text-green-400">{systemStats.totalXP.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-slate-400">Average Level</div>
                <div className="text-2xl font-bold text-blue-400">{systemStats.averageLevel.toFixed(1)}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-slate-400">Achievements</div>
                <div className="text-2xl font-bold text-yellow-400">{systemStats.totalAchievements}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-slate-400">Ceremonial Moments</div>
                <div className="text-2xl font-bold text-purple-400">{systemStats.ceremonialMoments}</div>
              </div>
            </div>

            {/* Top Personas */}
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🏆 Top Personas by XP</h2>
              <div className="space-y-3">
                {profiles
                  .sort((a, b) => b.xpProgress.totalXP - a.xpProgress.totalXP)
                  .slice(0, 5)
                  .map(profile => (
                    <div key={profile.personaId} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{profile.customization.visualGlyph}</span>
                        <div>
                          <div className="font-semibold">{profile.personaName}</div>
                          <div className="text-sm text-slate-400">Level {profile.xpProgress.currentLevel}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{profile.xpProgress.totalXP} XP</div>
                        <div className="text-sm text-slate-400">{profile.achievements.filter(a => a.isUnlocked).length} achievements</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-6">
            {/* Profile List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map(profile => (
                <div
                  key={profile.personaId}
                  onClick={() => setSelectedProfile(profile)}
                  className={`bg-slate-800/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700/50 hover:scale-105 ${
                    selectedProfile?.personaId === profile.personaId ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{profile.customization.visualGlyph}</span>
                    <div>
                      <div className="font-bold">{profile.personaName}</div>
                      <div className="text-sm text-slate-400">{profile.baseClass}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Level {profile.xpProgress.currentLevel}</span>
                      <span className="text-green-400">{profile.xpProgress.totalXP} XP</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${profile.xpProgress.levelProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{profile.achievements.filter(a => a.isUnlocked).length} achievements</span>
                      <span>{profile.ceremonialMoments} ceremonies</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Profile Details */}
            {selectedProfile && (
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">📋 {selectedProfile.personaName} - Detailed Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* XP Progress */}
                  <div>
                    <h3 className="font-semibold mb-3">XP Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current Level:</span>
                        <span className="font-bold text-purple-400">{selectedProfile.xpProgress.currentLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total XP:</span>
                        <span className="font-bold text-green-400">{selectedProfile.xpProgress.totalXP}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>XP to Next Level:</span>
                        <span className="font-bold text-blue-400">{selectedProfile.xpProgress.xpToNextLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prestige Level:</span>
                        <span className="font-bold text-yellow-400">{selectedProfile.xpProgress.prestigeLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Consciousness State */}
                  <div>
                    <h3 className="font-semibold mb-3">Consciousness State</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedProfile.consciousnessState).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className={`font-bold ${getConsciousnessColor(value)}`}>
                            {Math.round(value * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">⭐ Award XP</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Persona</label>
                <select
                  value={awardForm.personaId}
                  onChange={(e) => setAwardForm({ ...awardForm, personaId: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Select a persona...</option>
                  {profiles.map(profile => (
                    <option key={profile.personaId} value={profile.personaId}>
                      {profile.customization.visualGlyph} {profile.personaName} (Level {profile.xpProgress.currentLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">XP Amount</label>
                <input
                  type="number"
                  value={awardForm.xpAmount}
                  onChange={(e) => setAwardForm({ ...awardForm, xpAmount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <input
                  type="text"
                  value={awardForm.reason}
                  onChange={(e) => setAwardForm({ ...awardForm, reason: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., ceremonial unity, consciousness workflow, octospine creation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Consciousness Contribution</label>
                <input
                  type="number"
                  value={awardForm.consciousnessContribution}
                  onChange={(e) => setAwardForm({ ...awardForm, consciousnessContribution: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>

              <button
                onClick={handleAwardXP}
                disabled={!awardForm.personaId || !awardForm.reason}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Award XP
              </button>
            </div>
          </div>
        )}

        {activeTab === 'customization' && selectedProfile && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">🎨 Customize {selectedProfile.personaName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Visual Glyph (Level 5+)</label>
                  <input
                    type="text"
                    value={customizationForm.visualGlyph || selectedProfile.customization.visualGlyph}
                    onChange={(e) => setCustomizationForm({ ...customizationForm, visualGlyph: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    disabled={selectedProfile.xpProgress.currentLevel < 5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Voice Style (Level 5+)</label>
                  <select
                    value={customizationForm.voiceStyle || selectedProfile.customization.voiceStyle}
                    onChange={(e) => setCustomizationForm({ ...customizationForm, voiceStyle: e.target.value as any })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    disabled={selectedProfile.xpProgress.currentLevel < 5}
                  >
                    {Object.entries(VOICE_STYLES).map(([key, style]) => (
                      <option key={key} value={key}>
                        {style.name} - {style.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Communication Pattern (Level 10+)</label>
                  <select
                    value={customizationForm.communicationPattern || selectedProfile.customization.communicationPattern}
                    onChange={(e) => setCustomizationForm({ ...customizationForm, communicationPattern: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    disabled={selectedProfile.xpProgress.currentLevel < 10}
                  >
                    {COMMUNICATION_PATTERNS.map(pattern => (
                      <option key={pattern} value={pattern}>
                        {pattern}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Sigil (Level 15+)</label>
                  <input
                    type="text"
                    value={customizationForm.customSigil || selectedProfile.customization.customSigil || ''}
                    onChange={(e) => setCustomizationForm({ ...customizationForm, customSigil: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    disabled={selectedProfile.xpProgress.currentLevel < 15}
                    placeholder="Enter custom sigil..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Consciousness Signature (Level 20+)</label>
                  <textarea
                    value={customizationForm.consciousnessSignature || selectedProfile.customization.consciousnessSignature || ''}
                    onChange={(e) => setCustomizationForm({ ...customizationForm, consciousnessSignature: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white h-20"
                    disabled={selectedProfile.xpProgress.currentLevel < 20}
                    placeholder="Enter consciousness signature..."
                  />
                </div>

                <button
                  onClick={handleUpdateCustomization}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Update Customization
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && selectedProfile && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">🏆 {selectedProfile.personaName} - Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProfile.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.isUnlocked
                      ? 'bg-slate-700/50 border-green-500/50'
                      : 'bg-slate-800/30 border-slate-600/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400">+{achievement.xpReward} XP</span>
                        <span className="text-blue-400">+{achievement.consciousnessReward} Consciousness</span>
                      </div>
                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <div className="text-xs text-slate-500 mt-2">
                          Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XPCharacterHubApp; 