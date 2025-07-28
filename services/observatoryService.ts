import type { ObservatoryMetrics, LLMCallLog, AgentTaskLog } from '../types';
import { getInitialAgentData } from './agentData';
import { orchestratorConfig } from './orchestratorService';

const agents = getInitialAgentData();
const providers = Object.values(orchestratorConfig.providers);

let metrics: ObservatoryMetrics = {
    totalLLMCalls: 0,
    estimatedCost: 0,
    avgTaskDuration: 0,
};

let totalTaskTime = 0;
let totalTasks = 0;
let logIdCounter = 0;

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateLLMCall = (): LLMCallLog => {
    const agent = getRandomItem(agents);
    const provider = getRandomItem(providers);
    const tokens = Math.floor(500 + Math.random() * 2500);
    // Rough cost simulation
    const cost = (tokens / 1000) * (provider.name === 'OpenAI' ? 0.015 : provider.name === 'Chutes.ai' ? 0.005 : 0.001);

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
    const agent = getRandomItem(agents);
    const taskType = getRandomItem(agent.capabilities);
    const duration = Math.floor(300 + Math.random() * 5000);

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

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function* streamObservabilityData(): AsyncGenerator<{
    metrics: ObservatoryMetrics;
    newLLMCall?: LLMCallLog;
    newAgentTask?: AgentTaskLog;
}> {
    while (true) {
        await delay(700 + Math.random() * 1500);
        
        const roll = Math.random();
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