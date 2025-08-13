import type { ControlPanelState } from "../types/types";
import { orchestratorConfig } from './orchestratorService';
import { getInitialAgentData } from './agentData';
import { aiAutonomyService } from './aiAutonomyService';

type Subscriber = (state: ControlPanelState) => void;

class ControlPanelService {
    private state: ControlPanelState;
    private subscribers: Set<Subscriber> = new Set();

    constructor() {
        this.state = this.initializeState();
        this.setupAutonomyServiceIntegration();
    }

    private initializeState(): ControlPanelState {
        const agents = getInitialAgentData();
        const providers = orchestratorConfig.providers;

        const agentMasterStatus = agents.reduce((acc, agent) => {
            acc[agent.id] = 'Online';
            return acc;
        }, {} as Record<string, 'Online' | 'Dormant'>);

        const providerEnabled = Object.keys(providers).reduce((acc, key) => {
            acc[key] = providers[key].enabled;
            return acc;
        }, {} as Record<string, boolean>);

        // Get initial autonomy state from AI autonomy service
        const autonomyState = aiAutonomyService.getState();

        return {
            apiKeys: {
                google: { name: 'Google Gemini', key: 'AIza...•••••••••' },
                openai: { name: 'OpenAI', key: 'sk-t...•••••••••' },
                chutes: { name: 'Chutes.ai', key: 'chu_...•••••••••' },
            },
            orchestrator: {
                monthlyBudget: orchestratorConfig.costOptimization.monthlyBudget,
                providerEnabled,
            },
            agentMasterStatus,
            aiAutonomy: {
                agentAutonomyLevels: autonomyState.agentAutonomyLevels,
                permissionScopes: autonomyState.permissionScopes
            }
        };
    }

    private setupAutonomyServiceIntegration() {
        // Subscribe to AI autonomy service updates
        aiAutonomyService.subscribe((data) => {
            if (data.type === 'autonomy_level_changed' || data.type === 'permission_scope_changed') {
                // Update local state
                const autonomyState = aiAutonomyService.getState();
                this.state.aiAutonomy = {
                    agentAutonomyLevels: autonomyState.agentAutonomyLevels,
                    permissionScopes: autonomyState.permissionScopes
                };
                this.notify();
            }
        });
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb(this.state));
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    getState = (): ControlPanelState => {
        return this.state;
    }

    setAgentMasterStatus = (agentId: string, status: 'Online' | 'Dormant') => {
        if (this.state.agentMasterStatus[agentId] !== undefined) {
            this.state.agentMasterStatus[agentId] = status;
            this.notify();
        }
    }
    
    updateOrchestratorBudget = (budget: number) => {
        this.state.orchestrator.monthlyBudget = budget;
        this.notify();
    }

    setProviderEnabled = (providerKey: string, isEnabled: boolean) => {
        if (this.state.orchestrator.providerEnabled[providerKey] !== undefined) {
            this.state.orchestrator.providerEnabled[providerKey] = isEnabled;
            this.notify();
        }
    }

    // AI Autonomy Management Methods - now delegate to AI autonomy service
    updateAgentAutonomyLevel = (agentId: string, level: string) => {
        aiAutonomyService.setAgentAutonomyLevel(agentId, level, 'Control Panel Update', 'admin');
    }

    updatePermissionScope = (scope: string, enabled: boolean) => {
        aiAutonomyService.setPermissionScope(scope, enabled);
    }

    updatePermissionLevel = (scope: string, level: string) => {
        aiAutonomyService.setPermissionScope(scope, true, level);
    }

    // Get autonomy statistics from AI autonomy service
    getAutonomyStats = () => {
        return aiAutonomyService.getAutonomyStats();
    }

    // Get permission statistics from AI autonomy service
    getPermissionStats = () => {
        return aiAutonomyService.getPermissionStats();
    }

    // Additional methods for comprehensive autonomy management
    getAutonomyAuditLog = (limit: number = 100) => {
        return aiAutonomyService.getAuditLog(limit);
    }

    getAutonomyViolations = (limit: number = 100) => {
        return aiAutonomyService.getViolations(limit);
    }

    resolveAutonomyViolation = (violationId: string, resolution: string) => {
        aiAutonomyService.resolveViolation(violationId, resolution);
    }

    checkAgentPermission = (agentId: string, permission: string) => {
        return aiAutonomyService.checkPermission(agentId, permission);
    }

    // Get detailed autonomy information
    getAgentAutonomyDetails = (agentId: string) => {
        const level = aiAutonomyService.getAgentAutonomyLevel(agentId);
        const securityProfile = this.getAgentSecurityProfile(agentId);
        
        return {
            agentId,
            autonomyLevel: level,
            securityLevel: securityProfile?.securityLevel || 'basic',
            permissions: this.getAutonomyLevelPermissions(level),
            restrictions: this.getAutonomyLevelRestrictions(level),
            lastActivity: securityProfile?.lastActivity || new Date(),
            isActive: securityProfile?.isActive || false
        };
    }

    private getAgentSecurityProfile(agentId: string) {
        // This would integrate with the persona security service
        // For now, return a basic profile
        return {
            securityLevel: 'standard' as const,
            lastActivity: new Date(),
            isActive: true
        };
    }

    private getAutonomyLevelPermissions(level: string) {
        const levelConfig = {
            restricted: ['read:own_profile', 'view:public_data'],
            supervised: ['read:own_profile', 'view:public_data', 'access:basic_tools', 'read:filtered_data'],
            autonomous: ['read:own_profile', 'view:public_data', 'access:basic_tools', 'access:advanced_tools', 'read:filtered_data', 'write:filtered_data'],
            enhanced: ['read:own_profile', 'view:public_data', 'access:basic_tools', 'access:advanced_tools', 'access:system_tools', 'read:all_data', 'write:all_data']
        };
        return levelConfig[level as keyof typeof levelConfig] || [];
    }

    private getAutonomyLevelRestrictions(level: string) {
        const levelConfig = {
            restricted: ['no_file_access', 'no_network_access', 'no_api_calls', 'no_code_execution'],
            supervised: ['no_system_config', 'no_network_access', 'monitored_api_calls'],
            autonomous: ['no_system_config', 'no_root_access'],
            enhanced: ['no_root_access']
        };
        return levelConfig[level as keyof typeof levelConfig] || [];
    }

    // Bulk operations for autonomy management
    setAllAgentsAutonomyLevel = (level: string, reason?: string) => {
        const agents = getInitialAgentData();
        agents.forEach(agent => {
            aiAutonomyService.setAgentAutonomyLevel(agent.id, level, reason, 'admin');
        });
    }

    disableAllPermissionScopes = () => {
        const scopes = ['file_system', 'network_access', 'api_calls', 'code_execution', 'data_access', 'system_config'];
        scopes.forEach(scope => {
            aiAutonomyService.setPermissionScope(scope, false);
        });
    }

    // Emergency lockdown function
    emergencyLockdown = () => {
        this.setAllAgentsAutonomyLevel('restricted', 'Emergency lockdown initiated');
        this.disableAllPermissionScopes();
        
        // Notify subscribers of emergency action
        this.notify();
    }

    // Get comprehensive system status
    getSystemStatus = () => {
        const autonomyStats = this.getAutonomyStats();
        const permissionStats = this.getPermissionStats();
        const recentViolations = this.getAutonomyViolations(5);
        const recentAuditLog = this.getAutonomyAuditLog(5);

        return {
            autonomy: {
                ...autonomyStats,
                riskLevel: this.calculateRiskLevel(autonomyStats, recentViolations)
            },
            permissions: permissionStats,
            security: {
                activeViolations: recentViolations.filter(v => !v.resolved).length,
                recentActivity: recentAuditLog.length,
                lastViolation: recentViolations[0]?.timestamp || null
            },
            recommendations: this.generateRecommendations(autonomyStats, recentViolations)
        };
    }

    private calculateRiskLevel(autonomyStats: any, violations: any[]) {
        const criticalViolations = violations.filter(v => v.severity === 'critical' && !v.resolved).length;
        const highViolations = violations.filter(v => v.severity === 'high' && !v.resolved).length;
        
        if (criticalViolations > 0) return 'critical';
        if (highViolations > 2) return 'high';
        if (autonomyStats.autonomous > autonomyStats.supervised) return 'medium';
        return 'low';
    }

    private generateRecommendations(autonomyStats: any, violations: any[]) {
        const recommendations = [];
        
        if (violations.filter(v => !v.resolved).length > 5) {
            recommendations.push('Consider implementing stricter autonomy controls due to high violation rate');
        }
        
        if (autonomyStats.autonomous > autonomyStats.supervised * 2) {
            recommendations.push('High number of autonomous agents detected - consider increasing supervision');
        }
        
        if (autonomyStats.restricted === 0) {
            recommendations.push('No restricted agents found - consider implementing tiered autonomy levels');
        }
        
        return recommendations;
    }
}

// Export a singleton instance
export const controlPanelService = new ControlPanelService();
