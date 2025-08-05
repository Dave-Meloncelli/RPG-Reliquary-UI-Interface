import type { ObservatoryMetrics, LLMCallLog, AgentTaskLog } from "../types/types";
import { getInitialAgentData } from './agentData';
import { orchestratorConfig } from './orchestratorService';


let metrics: ObservatoryMetrics = {
    totalLLMCalls: 0,
    estimatedCost: 0,
    avgTaskDuration: 0,
};



const generateLLMCall = (): LLMCallLog => {
    // Rough cost simulation

    metrics.totalLLMCalls += 1;
    metrics.estimatedCost += cost;

    return {
        id: `llm-${++logIdCounter}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: agent.id,
        provider: provider.name,
        model: provider.model,
        tokens,
        cost,
    };
};

const generateAgentTask = (): AgentTaskLog => {

    totalTasks += 1;
    totalTaskTime += duration;
    metrics.avgTaskDuration = totalTaskTime / totalTasks;

    return {
        id: `task-${++logIdCounter}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: agent.id,
        taskType: taskType || 'general_processing',
        duration,
    };
};


export async function* streamObservabilityData(): AsyncGenerator<{
    metrics: ObservatoryMetrics;
    newLLMCall?: LLMCallLog;
    newAgentTask?: AgentTaskLog;
}> {
    while (true) {
        await delay(700 + Math.random() * 1500);
        
        let newLLMCall: LLMCallLog | undefined;
        let newAgentTask: AgentTaskLog | undefined;
        
        if (roll < 0.6) { // 60% chance for an LLM call
            newLLMCall = generateLLMCall();
        }
        if (roll > 0.3) { // 70% chance for an Agent Task (can happen with LLM call)
            newAgentTask = generateAgentTask();
        }
        
        // Ensure at least one event happens
        if (!newLLMCall && !newAgentTask) {
             newAgentTask = generateAgentTask();
        }

        yield {
            metrics: { ...metrics },
            newLLMCall,
            newAgentTask,
        };
    }
}
