/**
 * Concurrent Agent Service
 *
 * Clean implementation for concurrent agent task management
 */

export interface ConcurrentTask {
  id: string;
  type: string;
  priority: number;
  status: "pending" | "running" | "completed" | "failed";
  agentId: string;
  estimatedDuration: number;
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentWorkload {
  agentId: string;
  currentTasks: number;
  maxConcurrent: number;
  averageTaskTime: number;
  lastActivity: Date;
}

export class ConcurrentAgentService {
  private tasks: Map<string, ConcurrentTask> = new Map();
  private runningTasks: Set<string> = new Set();
  private maxConcurrentTasks: number = 5;
  private taskQueue: string[] = [];

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrentTasks = maxConcurrent;
  }

  /**
   * Add a new task to the queue
   */
  async addTask(
    task: Omit<ConcurrentTask, "id" | "status" | "createdAt">,
  ): Promise<string> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newTask: ConcurrentTask = {
      ...task,
      id: taskId,
      status: "pending",
      createdAt: new Date(),
    };

    this.tasks.set(taskId, newTask);
    this.taskQueue.push(taskId);

    this.log(`Task added: ${taskId} (${task.type})`, "info");
    this.processQueue();

    return taskId;
  }

  /**
   * Process the task queue
   */
  private async processQueue(): Promise<void> {
    while (
      this.runningTasks.size < this.maxConcurrentTasks &&
      this.taskQueue.length > 0
    ) {
      const taskId = this.taskQueue.shift();
      if (taskId) {
        await this.startTask(taskId);
      }
    }
  }

  /**
   * Start a task
   */
  private async startTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== "pending") return;

    task.status = "running";
    task.startedAt = new Date();
    this.runningTasks.add(taskId);

    this.log(`Task started: ${taskId}`, "info");

    // Execute the task
    this.executeTask(task)
      .then(() => {
        this.completeTask(taskId);
      })
      .catch((error) => {
        this.failTask(taskId, error.message);
      });
  }

  /**
   * Execute a task
   */
  private async executeTask(task: ConcurrentTask): Promise<any> {
    const executionTime = Math.min(task.estimatedDuration, 5000); // Cap at 5 seconds for demo

    await new Promise((resolve) => setTimeout(resolve, executionTime));

    // Simulate task execution based on type
    switch (task.type) {
      case "data_analysis":
        return {
          analysis: "Sample analysis result",
          insights: ["Insight 1", "Insight 2"],
        };

      case "content_generation":
        return { content: "Generated content sample", wordCount: 150 };

      case "monitoring":
        return { status: "healthy", alerts: [] };

      case "decision_analysis":
        return { decision: "proceed", confidence: 0.85 };

      default:
        return { result: "Task completed successfully" };
    }
  }

  /**
   * Complete a task
   */
  private completeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "completed";
    task.completedAt = new Date();
    this.runningTasks.delete(taskId);

    this.log(`Task completed: ${taskId}`, "success");
    this.processQueue();
  }

  /**
   * Fail a task
   */
  private failTask(taskId: string, error: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "failed";
    task.error = error;
    task.completedAt = new Date();
    this.runningTasks.delete(taskId);

    this.log(`Task failed: ${taskId} - ${error}`, "error");
    this.processQueue();
  }

  /**
   * Get task status
   */
  public getTaskStatus(taskId: string): ConcurrentTask | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * Get all tasks
   */
  public getAllTasks(): ConcurrentTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get agent workloads
   */
  public getAgentWorkloads(): AgentWorkload[] {
    const workloads = new Map<string, AgentWorkload>();

    for (const task of this.tasks.values()) {
      if (!workloads.has(task.agentId)) {
        workloads.set(task.agentId, {
          agentId: task.agentId,
          currentTasks: 0,
          maxConcurrent: 3,
          averageTaskTime: 0,
          lastActivity: task.createdAt,
        });
      }

      const workload = workloads.get(task.agentId)!;
      if (task.status === "running") {
        workload.currentTasks++;
      }

      if (task.completedAt && task.startedAt) {
        const taskTime = task.completedAt.getTime() - task.startedAt.getTime();
        workload.averageTaskTime = (workload.averageTaskTime + taskTime) / 2;
      }

      if (task.startedAt && task.startedAt > workload.lastActivity) {
        workload.lastActivity = task.startedAt;
      }
    }

    return Array.from(workloads.values());
  }

  /**
   * Get system status
   */
  public getSystemStatus() {
    const totalTasks = this.tasks.size;
    const runningTasks = this.runningTasks.size;
    const pendingTasks = this.taskQueue.length;
    const completedTasks = Array.from(this.tasks.values()).filter(
      (t) => t.status === "completed",
    ).length;
    const failedTasks = Array.from(this.tasks.values()).filter(
      (t) => t.status === "failed",
    ).length;

    return {
      totalTasks,
      runningTasks,
      pendingTasks,
      completedTasks,
      failedTasks,
      maxConcurrent: this.maxConcurrentTasks,
      utilization: (runningTasks / this.maxConcurrentTasks) * 100,
    };
  }

  /**
   * Cancel a task
   */
  public cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== "pending") return false;

    // Remove from queue
    const queueIndex = this.taskQueue.indexOf(taskId);
    if (queueIndex !== -1) {
      this.taskQueue.splice(queueIndex, 1);
    }

    task.status = "failed";
    task.error = "Task cancelled";
    task.completedAt = new Date();

    this.log(`Task cancelled: ${taskId}`, "warning");
    return true;
  }

  /**
   * Clear completed tasks
   */
  public clearCompletedTasks(): number {
    let clearedCount = 0;

    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === "completed" || task.status === "failed") {
        this.tasks.delete(taskId);
        clearedCount++;
      }
    }

    this.log(`Cleared ${clearedCount} completed/failed tasks`, "info");
    return clearedCount;
  }

  private log(message: string, level: string): void {
    console.log(`[ConcurrentAgentService] ${level.toUpperCase()}: ${message}`);
  }
}

export const concurrentAgentService = new ConcurrentAgentService();

// Standalone function exports for backward compatibility
export const submitConcurrentTask = (
  task: Omit<ConcurrentTask, "id" | "status" | "createdAt">,
) => {
  return concurrentAgentService.addTask(task);
};

export const getConcurrentTasks = () => {
  return Array.from(concurrentAgentService["tasks"].values());
};

export const getConcurrentSystemStatus = () => {
  return concurrentAgentService.getSystemStatus();
};
