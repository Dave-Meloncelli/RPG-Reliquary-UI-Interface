import type { TaskItem, TaskSource, TaskPriority } from '../types';
import { eventBus } from './eventBus';

const API_BASE_URL = ((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000') + '/api/v1';

interface TaskQueueState {
    tasks: TaskItem[];
}

type Subscriber = (state: TaskQueueState) => void;

class TaskQueueService {
    private state: TaskQueueState = {
        tasks: [],
    };
    private subscribers: Set<Subscriber> = new Set();

    constructor() {
        this.fetchTasks();
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb({ ...this.state }));
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        callback(this.state);
        return () => this.subscribers.delete(callback);
    }
    
    fetchTasks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const tasks: TaskItem[] = await response.json();
            this.state.tasks = tasks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            this.notify();
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    addTask = async (taskData: { source: TaskSource, sourceId: string, title: string, description: string, priority: TaskPriority, appId: string }) => {
        // Prevent duplicate tasks for the same source event
        if (this.state.tasks.some(t => t.sourceId === taskData.sourceId && t.status === 'Pending')) {
            console.log("Duplicate task creation prevented for sourceId:", taskData.sourceId);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                // If the backend returns a 409 Conflict, it's a duplicate.
                if (response.status === 409) {
                    console.log("Duplicate task creation prevented by backend for sourceId:", taskData.sourceId);
                    return;
                }
                throw new Error('Failed to create task');
            }
            const created: TaskItem = await response.json();
            eventBus.publish('task.created', created);
            // Refresh the list from the source of truth
            await this.fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
    
    resolveTask = async (taskId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/resolve`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to resolve task');
            }
            eventBus.publish('task.resolved', { id: taskId });
            await this.fetchTasks();
        } catch (error) {
            console.error("Error resolving task:", error);
        }
    }

    resolveTaskBySourceId = (sourceId: string) => {
        const task = this.state.tasks.find(t => t.sourceId === sourceId && t.status === 'Pending');
        if (task) {
            this.resolveTask(task.id);
        }
    }
}

export const taskQueueService = new TaskQueueService();
