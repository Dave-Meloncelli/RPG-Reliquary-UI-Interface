import type { AgentProfile, TaskItem, TaskPriority, TaskSource } from "../types/types";
import { getInitialAgentData } from './agentData';
import { orchestratorConfig } from './orchestratorService';

export interface ConcurrentTask {
  id: string;
  agentId: string;
  taskType: string;
  description: string;
  priority: TaskPriority;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  result?: any;
  error?: string;
  dependencies?: string[];
  estimatedDuration: number; // in milliseconds
}

export interface AgentWorkload {
  agentId: string;
  currentTasks: ConcurrentTask[];
  maxConcurrentTasks: number;
  currentLoad: number; // 0-1 scale
  capabilities: string[];
  preferredTaskTypes: string[];
}

export interface ConcurrentAgentConfig {
  maxGlobalConcurrency: number;
  maxPerAgentConcurrency: number;
  taskQueueSize: number;
  enableLoadBalancing: boolean;
  enableTaskPrioritization: boolean;
  enableDependencyResolution: boolean;
}

class ConcurrentAgentService {
  private tasks: Map<string, ConcurrentTask> = new Map();
  private agentWorkloads: Map<string, AgentWorkload> = new Map();
  private taskQueue: ConcurrentTask[] = [];
  private runningTasks: Set<string> = new Set();
  private config: ConcurrentAgentConfig;
  private agents: AgentProfile[];

  constructor(config: Partial<ConcurrentAgentConfig> = {}) {
    this.config = {
      maxGlobalConcurrency: 10,
      maxPerAgentConcurrency: 3,
      taskQueueSize: 100,
      enableLoadBalancing: true,
      enableTaskPrioritization: true,
      enableDependencyResolution: true,
      ...config
    };
    
    this.agents = getInitialAgentData();
    this.initializeAgentWorkloads();
  }

  private initializeAgentWorkloads() {
    this.agents.forEach(agent => {
      this.agentWorkloads.set(agent.id, {
        agentId: agent.id,
        currentTasks: [],
        maxConcurrentTasks: this.config.maxPerAgentConcurrency,
        currentLoad: 0,
        capabilities: agent.capabilities,
        preferredTaskTypes: this.getPreferredTaskTypes(agent)
      });
    });
  }

  private getPreferredTaskTypes(agent: AgentProfile): string[] {
    // Map agent capabilities to task types
    const capabilityToTaskMap: Record<string, string[]> = {
      'Data Analysis': ['data_analysis', 'pattern_recognition', 'predictive_modeling'],
      'Content Creation': ['content_generation', 'writing', 'editing'],
      'System Monitoring': ['monitoring', 'diagnostics', 'forensics'],
      'Decision Making': ['decision_analysis', 'strategy', 'planning'],
      'Communication': ['communication', 'coordination', 'facilitation'],
      'Technical': ['technical_analysis', 'infrastructure', 'development']
    };

    return agent.capabilities.flatMap(cap => capabilityToTaskMap[cap] || []);
  }

  public async submitTask(task: Omit<ConcurrentTask, 'id' | 'status'>): Promise<string> {
    const fullTask: ConcurrentTask = {
      ...task,
      id: taskId,
      status: 'pending'
    };

    this.tasks.set(taskId, fullTask);
    this.taskQueue.push(fullTask);
    
    // Sort queue by priority if enabled
    if (this.config.enableTaskPrioritization) {
      this.sortTaskQueue();
    }

    // Try to start the task immediately
    this.processTaskQueue();
    
    return taskId;
  }

  private sortTaskQueue() {
    this.taskQueue.sort((a, b) => {
      if (priorityDiff !== 0) return priorityDiff;
      return (a.startTime?.getTime() || 0) - (b.startTime?.getTime() || 0);
    });
  }

  private async processTaskQueue() {
    while (this.taskQueue.length > 0 && this.runningTasks.size < this.config.maxGlobalConcurrency) {
      if (!task) break;

      // Check dependencies
      if (this.config.enableDependencyResolution && task.dependencies) {
        const unmetDependencies = task.dependencies.filter(depId => {
          return !depTask || depTask.status !== 'completed';
        });
        
        if (unmetDependencies.length > 0) {
          // Put task back in queue
          this.taskQueue.unshift(task);
          break;
        }
      }

      // Find best agent for the task
      if (!bestAgent) {
        // No suitable agent available, put task back in queue
        this.taskQueue.unshift(task);
        break;
      }

      // Start the task
      await this.startTask(task, bestAgent);
    }
  }

  private findBestAgentForTask(task: ConcurrentTask): AgentWorkload | null {
    const availableAgents = Array.from(this.agentWorkloads.values())
      .filter(workload => workload.currentTasks.length < workload.maxConcurrentTasks);

    if (availableAgents.length === 0) return null;

    // Score agents based on capabilities and current load
    const scoredAgents = availableAgents.map(agent => {
      
      // Capability match
      if (capabilityMatch) score += 10;
      
      // Load balancing
      if (this.config.enableLoadBalancing) {
        score += (1 - agent.currentLoad) * 5;
      }
      
      // Current workload
      score += (agent.maxConcurrentTasks - agent.currentTasks.length) * 2;
      
      return { agent, score };
    });

    // Return the best scoring agent
    scoredAgents.sort((a, b) => b.score - a.score);
    return scoredAgents[0]?.agent || null;
  }

  private async startTask(task: ConcurrentTask, agent: AgentWorkload) {
    task.status = 'running';
    task.startTime = new Date();
    this.runningTasks.add(task.id);
    
    // Update agent workload
    agent.currentTasks.push(task);
    agent.currentLoad = agent.currentTasks.length / agent.maxConcurrentTasks;
    
    // Execute the task
    this.executeTask(task, agent).finally(() => {
      this.completeTask(task, agent);
    });
  }

  private async executeTask(task: ConcurrentTask, agent: AgentWorkload) {
    try {
      // Simulate task execution based on task type
      
      task.status = 'completed';
      task.result = result;
      task.endTime = new Date();
      
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.endTime = new Date();
    }
  }

  private async executeTaskByType(task: ConcurrentTask, agent: AgentWorkload): Promise<any> {
    // Simulate different task types
    const executionTime = Math.min(task.estimatedDuration, 5000); // Cap at 5 seconds for demo
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    switch (task.taskType) {
      case 'data_analysis':
        return { analysis: 'Data analysis completed', insights: ['Insight 1', 'Insight 2'] };
      case 'content_generation':
        return { content: 'Generated content', wordCount: 150 };
      case 'monitoring':
        return { status: 'System monitored', alerts: [] };
      case 'decision_analysis':
        return { decision: 'Decision made', confidence: 0.85 };
      default:
        return { result: 'Task completed successfully' };
    }
  }

  private completeTask(task: ConcurrentTask, agent: AgentWorkload) {
    this.runningTasks.delete(task.id);
    
    // Update agent workload
    if (taskIndex !== -1) {
      agent.currentTasks.splice(taskIndex, 1);
      agent.currentLoad = agent.currentTasks.length / agent.maxConcurrentTasks;
    }
    
    // Process next tasks in queue
    this.processTaskQueue();
  }

  public getTaskStatus(taskId: string): ConcurrentTask | null {
    return this.tasks.get(taskId) || null;
  }

  public getAllTasks(): ConcurrentTask[] {
    return Array.from(this.tasks.values());
  }

  public getAgentWorkloads(): AgentWorkload[] {
    return Array.from(this.agentWorkloads.values());
  }

  public getSystemStatus() {
    return {
      totalTasks: this.tasks.size,
      runningTasks: this.runningTasks.size,
      queuedTasks: this.taskQueue.length,
      maxConcurrency: this.config.maxGlobalConcurrency,
      agentWorkloads: this.getAgentWorkloads()
    };
  }

  public cancelTask(taskId: string): boolean {
    if (!task || task.status !== 'pending') return false;
    
    if (queueIndex !== -1) {
      this.taskQueue.splice(queueIndex, 1);
      this.tasks.delete(taskId);
      return true;
    }
    
    return false;
  }
}

// Singleton instance
export const concurrentAgentService = new ConcurrentAgentService();

// Example usage functions
export const submitConcurrentTask = async (
  agentId: string,
  taskType: string,
  description: string,
  priority: TaskPriority = 'Medium',
  estimatedDuration: number = 3000
): Promise<string> => {
  return concurrentAgentService.submitTask({
    agentId,
    taskType,
    description,
    priority,
    estimatedDuration
  });
};

export const getConcurrentSystemStatus = () => {
  return concurrentAgentService.getSystemStatus();
};

export const getConcurrentTasks = () => {
  return concurrentAgentService.getAllTasks();
}; 