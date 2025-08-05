import type { ControlPanelState } from "../types/types";
import { orchestratorConfig } from './orchestratorService';
import { getInitialAgentData } from './agentData';

type Subscriber = (state: ControlPanelState) => void;

class ControlPanelService {
    private state: ControlPanelState;
    private subscribers: Set<Subscriber> = new Set();

    constructor() {
        this.state = this.initializeState();
    }

    private initializeState(): ControlPanelState {

        const agentMasterStatus = agents.reduce((acc, agent) => {
            acc[agent.id] = 'Online';
            return acc;
        }, {} as Record<string, 'Online' | 'Dormant'>);

        const providerEnabled = Object.keys(providers).reduce((acc, key) => {
            acc[key] = providers[key].enabled;
            return acc;
        }, {} as Record<string, boolean>);

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
        };
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
}

// Export a singleton instance
export const controlPanelService = new ControlPanelService();
