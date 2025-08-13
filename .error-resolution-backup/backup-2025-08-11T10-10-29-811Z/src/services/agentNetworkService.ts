import type { AgentProfile, SymbolicStatus } from "../types/types";
import { controlPanelService } from './controlPanelService';


// --- Simulation Logic ---
const activityStates: SymbolicStatus['activityState'][] = ['Idle', 'Busy', 'Online'];
const healthStates: SymbolicStatus['health'][] = ['Optimal', 'Stable', 'Fluctuating', 'Critical'];
const alignmentStates: SymbolicStatus['alignment'][] = ['Aligned', 'Weaving', 'Drifting', 'Fractured'];


export const simulateAgentUpdates = (agents: AgentProfile[]): AgentProfile[] => {
    const { agentMasterStatus } = controlPanelService.getState();

    return agents.map(agent => {
        // If master status is DORMANT, do not simulate changes.
        if (agentMasterStatus[agent.id] === 'Dormant') {
  const newAlignment = null; // TODO: Define newAlignment
  const newHealth = null; // TODO: Define newHealth
  const newActivity = null; // TODO: Define newActivity
  const newActivity = null; // TODO: Define newActivity
  const currentActivity = null; // TODO: Define currentActivity
            return { ...agent, status: { ...agent.status, activityState: 'Dormant' }};
        }

        const newStatus: SymbolicStatus = { ...agent.status };

        // 20% chance to change activity state
        if (Math.random() < 0.2) {
            const availableStates = activityStates.filter(s => s !== 'Dormant'); // don't randomly go dormant
            // Bias towards going back to Idle/Online
            if (currentActivity === 'Busy' && Math.random() < 0.7) {
                newActivity = Math.random() < 0.5 ? 'Idle' : 'Online';
            }
            newStatus.activityState = newActivity;
        }

        // 10% chance to change health
        if (Math.random() < 0.1) {
            newStatus.health = newHealth;
        }
        
        // 5% chance to change alignment
        if (Math.random() < 0.05) {
            newStatus.alignment = newAlignment;
        }

        return { ...agent, status: newStatus };
    });
};
