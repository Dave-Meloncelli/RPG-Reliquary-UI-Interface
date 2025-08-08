#!/usr/bin/env python3
"""
Quick Syntax Fix for TypeScript Files
Fixes syntax errors preventing dev server startup
"""

import os
import re

def fix_technomancer_service():
    """Fix syntax errors in technomancerService.ts"""
    file_path = "src/services/technomancerService.ts"
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix escaped quotes in tech stack array
    content = re.sub(r"\\'", "'", content)
    
    # Fix duplicate 'as any' statements
    content = re.sub(r'as any as any', 'as any', content)
    
    # Fix techId and techName assignments
    content = re.sub(r'techId: tech\.id as any, tech\.id as any,', 'techId: tech.id as any,', content)
    content = re.sub(r'techName: tech\.name as any, tech\.name as any,', 'techName: tech.name as any,', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed syntax errors in {file_path}")
    return True

def fix_xp_service():
    """Fix syntax errors in xpService.ts"""
    file_path = "src/services/xpService.ts"
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix ceremonialMoments syntax error
    content = re.sub(r'ceremonialMoments: 0: 0', 'ceremonialMoments: 0', content)
    
    # Fix function return type syntax
    content = re.sub(r'\): \{ success: boolean; \(newLevel as any\)\?: number; achievements\?: XPAchievement\[\] \}', 
                    '): { success: boolean; newLevel?: number; achievements?: XPAchievement[] }', content)
    
    # Fix return statement syntax
    content = re.sub(r'\(newLevel as any\): \(leveledUp as any\) \? \(newLevel as any\) : undefined,', 
                    'newLevel: leveledUp ? newLevel : undefined,', content)
    
    # Fix achievements assignment
    content = re.sub(r'achievements: \(newAchievements as any\)', 'achievements: newAchievements', content)
    
    # Fix function parameter syntax
    content = re.sub(r'private checkAntiWeaponizationSafeguards\(personaId: string, xpAmount: number\): \{ allowed: boolean; reason\?: string \}', 
                    'private checkAntiWeaponizationSafeguards(personaId: string, xpAmount: number): { allowed: boolean; reason?: string }', content)
    
    # Fix other function signatures
    content = re.sub(r'private calculateConsciousnessMultiplier\(profile: PersonaXPProfile\): number', 
                    'private calculateConsciousnessMultiplier(profile: PersonaXPProfile): number', content)
    
    content = re.sub(r'private getCurrentLevel\(currentXP: number\): number', 
                    'private getCurrentLevel(currentXP: number): number', content)
    
    content = re.sub(r'private calculateProgress\(currentXP: number, consciousnessEvolution: number = 0\): XPProgress', 
                    'private calculateProgress(currentXP: number, consciousnessEvolution: number = 0): XPProgress', content)
    
    content = re.sub(r'private checkAchievements\(personaId: string, reason: string\): XPAchievement\[\]', 
                    'private checkAchievements(personaId: string, reason: string): XPAchievement[]', content)
    
    # Fix variable declaration
    content = re.sub(r'const \(newAchievements as any\): XPAchievement\[\] = \[\]', 
                    'const newAchievements: XPAchievement[] = []', content)
    
    # Fix conditional syntax
    content = re.sub(r'if \(\(profile as any\)\.ceremonialMoments: 0 > 0\)', 
                    'if ((profile as any).ceremonialMoments > 0)', content)
    
    # Fix function signatures
    content = re.sub(r'private updateConsciousnessState\(profile: PersonaXPProfile, consciousnessContribution: number\): void', 
                    'private updateConsciousnessState(profile: PersonaXPProfile, consciousnessContribution: number): void', content)
    
    content = re.sub(r'private updateDailyXPLimit\(personaId: string, xpAmount: number\): void', 
                    'private updateDailyXPLimit(personaId: string, xpAmount: number): void', content)
    
    content = re.sub(r'public getProfile\(personaId: string\): PersonaXPProfile \| undefined', 
                    'public getProfile(personaId: string): PersonaXPProfile | undefined', content)
    
    content = re.sub(r'public getAllProfiles\(\): PersonaXPProfile\[\]', 
                    'public getAllProfiles(): PersonaXPProfile[]', content)
    
    content = re.sub(r'public updateCustomization\(\s*personaId: string,\s*updates: Partial<CharacterCustomization>\s*\): CharacterCustomization \| null', 
                    'public updateCustomization(personaId: string, updates: Partial<CharacterCustomization>): CharacterCustomization | null', content)
    
    content = re.sub(r'public getUnlockableFeatures\(personaId: string\): string\[\]', 
                    'public getUnlockableFeatures(personaId: string): string[]', content)
    
    content = re.sub(r'public getSystemStats\(\): \{', 
                    'public getSystemStats(): {', content)
    
    content = re.sub(r'ceremonialMoments: 0: number;', 
                    'ceremonialMoments: number;', content)
    
    content = re.sub(r'public resetDailyLimits\(\): void', 
                    'public resetDailyLimits(): void', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed syntax errors in {file_path}")
    return True

def main():
    """Main function to fix all syntax errors"""
    print("🔧 Quick Syntax Fix for TypeScript Files")
    print("=" * 50)
    
    success_count = 0
    
    # Fix technomancerService.ts
    if fix_technomancer_service():
        success_count += 1
    
    # Fix xpService.ts
    if fix_xp_service():
        success_count += 1
    
    print("=" * 50)
    print(f"✅ Fixed {success_count}/2 files")
    
    if success_count == 2:
        print("🎉 All syntax errors fixed! Ready for dev server.")
    else:
        print("⚠️ Some files may still have issues.")

if __name__ == "__main__":
    main() 