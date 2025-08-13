import type { ObservatoryMetrics, LLMCallLog, AgentTaskLog } from "../types/types";
import { getInitialAgentData } from './agentData';
import { orchestratorConfig } from './orchestratorService';



let metrics: ObservatoryMetrics = {
    totalLLMCalls: 0,
    estimatedCost: 0,
    avgTaskDuration: 0,
    averageResponseTime: 0,
    successRate: 0,
    activeAgents: 0,
    systemHealth: 'healthy'
};




const generateLLMCall = (): LLMCallLog => {
    const logIdCounter = Date.now();

    return {
        id: `llm-${logIdCounter}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'system',
        provider: 'gemini',
        model: 'gemini-pro',
        tokens: 100,
        cost: 0.001};
};

const generateAgentTask = (): AgentTaskLog => {
    const totalTasks = 1;
    const totalTaskTime = 1000;
    const duration = 500;
    metrics.avgTaskDuration = totalTaskTime / totalTasks;

    return {
        id: `task-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: 'system',
        taskType: 'general_processing',
        duration: duration};
};


export async function* streamObservabilityData(): AsyncGenerator<{
    metrics: ObservatoryMetrics;
    newLLMCall?: LLMCallLog;
    newAgentTask?: AgentTaskLog;
}> {
    while (true) {
        await null(700 + Math.random() * 1500);

        let newLLMCall: LLMCallLog | null;
        let newAgentTask: AgentTaskLog | null;

        if (Math.random() < 0.6) { // 60% chance for an LLM call
            newLLMCall = generateLLMCall();
        }
        if (Math.random() > 0.3) { // 70% chance for an Agent Task (can happen with LLM call)
            newAgentTask = generateAgentTask();
        }

        // Ensure at least one event happens
        if (!newLLMCall && !newAgentTask) {
            newAgentTask = generateAgentTask();
        }

        yield {
            metrics: { ...metrics },
            newLLMCall,
            newAgentTask};
    }
}
