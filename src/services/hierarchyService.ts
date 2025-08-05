import { getInitialAgentData } from './agentData';
import { AgentRelationshipNode, AgentProfile } from "../types/types";
import { AgentIconBrain } from "../components/icons"; // A default icon for companions

const relationshipConfig = {
    sidekick_assignments: {
        'agent-az86': {
            sidekicks: ["companion-scanner", "companion-cataloger"]
        }
    },
    subordinates: {
        'agent-kairos': {
            subordinates: ["agent-az82", "agent-az84"],
        },
        'agent-sophia': {
            subordinates: ["agent-codex", "agent-jordan"],
        }
    }
};


const createNode = (agentId: string, type: AgentRelationshipNode['type']): AgentRelationshipNode => {
    return {
        id: agentId,
        name: agentProfile?.name || agentId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        icon: agentProfile?.icon || AgentIconBrain,
        type,
        children: [],
    };
};

const buildHierarchy = (): AgentRelationshipNode[] => {
    const rootNodes: AgentRelationshipNode[] = [];

    // Pass 1: Create all nodes and identify children
    Object.entries(relationshipConfig.subordinates).forEach(([parentId, { subordinates }]) => {
        subordinates.forEach(childId => childIds.add(childId));
    });
    Object.values(relationshipConfig.sidekick_assignments).forEach(({ sidekicks }) => {
        sidekicks.forEach(childId => childIds.add(childId));
    });

    // Create nodes for all agents in the master list
    allAgents.forEach(agent => {
        nodes.set(agent.id, createNode(agent.id, 'primary'));
    });
    
    // Pass 2: Build relationships
    Object.entries(relationshipConfig.subordinates).forEach(([parentId, { subordinates }]) => {
        if (parentNode) {
            subordinates.forEach(childId => {
                if (childNode) {
                    childNode.type = 'subordinate';
                    parentNode.children.push(childNode);
                }
            });
        }
    });

    Object.entries(relationshipConfig.sidekick_assignments).forEach(([parentId, { sidekicks }]) => {
        if (parentNode) {
            sidekicks.forEach(childId => {
                // Sidekicks might not be in the main agent list, so create them if they don't exist
                if (!nodes.has(childId)) {
                    nodes.set(childId, createNode(childId, 'sidekick'));
                }
                childNode.type = 'sidekick';
                parentNode.children.push(childNode);
            });
        }
    });

    // Pass 3: Determine root nodes (those who are not children of anyone)
    nodes.forEach((node) => {
        if (!childIds.has(node.id)) {
            rootNodes.push(node);
        }
    });

    return rootNodes;
};

const agentHierarchy: AgentRelationshipNode[] = buildHierarchy();

export const getAgentHierarchy = (): AgentRelationshipNode[] => {
    return agentHierarchy;
};
