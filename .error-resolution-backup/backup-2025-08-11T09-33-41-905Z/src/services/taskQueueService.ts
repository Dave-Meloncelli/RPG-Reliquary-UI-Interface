import { eventBus } from './eventBus';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    tags: string[];
    metadata?: Record<string, any>;
}

export interface TaskQueue {
    id: string;
    name: string;
    description: string;
    tasks: Task[];
    priority: 'low' | 'medium' | 'high';
    maxConcurrent: number;
    status: 'active' | 'paused' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

class TaskQueueService {
    private queues: Map<string, TaskQueue> = new Map();
    private tasks: Map<string, Task> = new Map();
    private processingTasks: Set<string> = new Set();
    private eventBus: any;

    constructor(eventBus: any) {
        this.eventBus = eventBus;
    }

    async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        const task: Task = {
            ...taskData,
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.tasks.set(task.id, task);

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                throw new Error(`Failed to create task: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }

        this.eventBus.emit('task:created', { task });
        return task;
    }

    async resolveTask(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        task.status = 'completed';
        task.updatedAt = new Date();

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/resolve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to resolve task: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error resolving task:', error);
        }

        this.eventBus.emit('task:resolved', { task });
    }

    async processNextTask(queueId: string): Promise<Task | null> {
        const queue = this.queues.get(queueId);
        if (!queue) {
            throw new Error(`Queue ${queueId} not found`);
        }

        const pendingTasks = queue.tasks.filter(task =>
            task.status === 'pending' && !this.processingTasks.has(task.id)
        );

        if (pendingTasks.length === 0) {
            return null;
        }

        // Sort by priority and creation date
        const nextTask = pendingTasks.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return a.createdAt.getTime() - b.createdAt.getTime();
        })[0];

        if (nextTask) {
            this.processingTasks.add(nextTask.id);
            nextTask.status = 'in_progress';
            nextTask.updatedAt = new Date();

            this.eventBus.emit('task:started', { task: nextTask });
        }

        return nextTask;
    }

    async completeTask(taskId: string): Promise<void> {
        const task = this.tasks.get(taskId);
        if (task) {
            await this.resolveTask(task.id);
        }

        this.processingTasks.delete(taskId);
    }

    getTask(taskId: string): Task | undefined {
        return this.tasks.get(taskId);
    }

    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    getTasksByStatus(status: Task['status']): Task[] {
        return this.getAllTasks().filter(task => task.status === status);
    }

    getTasksByPriority(priority: Task['priority']): Task[] {
        return this.getAllTasks().filter(task => task.priority === priority);
    }

    createQueue(queueData: Omit<TaskQueue, 'id' | 'createdAt' | 'updatedAt'>): TaskQueue {
        const queue: TaskQueue = {
            ...queueData,
            id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.queues.set(queue.id, queue);
        this.eventBus.emit('queue:created', { queue });
        return queue;
    }

    getQueue(queueId: string): TaskQueue | undefined {
        return this.queues.get(queueId);
    }

    getAllQueues(): TaskQueue[] {
        return Array.from(this.queues.values());
    }

    addTaskToQueue(queueId: string, taskId: string): void {
        const queue = this.queues.get(queueId);
        const task = this.tasks.get(taskId);

        if (!queue || !task) {
            throw new Error(`Queue ${queueId} or Task ${taskId} not found`);
        }

        queue.tasks.push(task);
        queue.updatedAt = new Date();
        this.eventBus.emit('task:added_to_queue', { queue, task });
    }

    removeTaskFromQueue(queueId: string, taskId: string): void {
        const queue = this.queues.get(queueId);
        if (!queue) {
            throw new Error(`Queue ${queueId} not found`);
        }

        queue.tasks = queue.tasks.filter(task => task.id !== taskId);
        queue.updatedAt = new Date();
        this.eventBus.emit('task:removed_from_queue', { queue, taskId });
    }

    getQueueStats(queueId: string): {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        failed: number;
    } {
        const queue = this.queues.get(queueId);
        if (!queue) {
            throw new Error(`Queue ${queueId} not found`);
        }

        const stats = {
            total: queue.tasks.length,
            pending: queue.tasks.filter(t => t.status === 'pending').length,
            inProgress: queue.tasks.filter(t => t.status === 'in_progress').length,
            completed: queue.tasks.filter(t => t.status === 'completed').length,
            failed: queue.tasks.filter(t => t.status === 'failed').length,
        };

        return stats;
    }
}

// Create instance for named export compatibility
const taskQueueService = new TaskQueueService(eventBus);

export default TaskQueueService;
export { taskQueueService };
