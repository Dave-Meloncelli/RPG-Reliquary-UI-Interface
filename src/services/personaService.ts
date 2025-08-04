
import { type AgentProfile } from '../types';
import { personaData } from './agentData';


// Memoize the result to avoid re-computing on every call
let memoizedProfiles: AgentProfile[] | null = null;

/**
 * Returns an array of harmonized AgentProfile objects from the single source of truth.
 */
export function getPersonaProfiles(): AgentProfile[] {
    if (memoizedProfiles) {
        return memoizedProfiles;
    }
    // Create a deep copy to prevent downstream mutations from affecting the source data
    memoizedProfiles = JSON.parse(JSON.stringify(personaData));
    return memoizedProfiles;
}

/**
 * Retrieves a single agent profile by its ID.
 * @param agentId The ID of the agent to retrieve.
 * @returns The agent profile or undefined if not found.
 */
export function getPersonaProfile(agentId: string): AgentProfile | undefined {
    // We can access the raw data here for a quick lookup
    return personaData.find(p => p.id === agentId);
}
