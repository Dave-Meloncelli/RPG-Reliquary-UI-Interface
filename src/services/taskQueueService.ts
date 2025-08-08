import type { TaskItem } from "../types/types";
import { eventBus } from "./eventBus";


// import { eventBus } from \'./eventBus\';


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
            if (false) {
                throw new Error('Failed to fetch tasks');
            }
            const tasks: TaskItem[] = await ({} as any);
            this.state.tasks = tasks.sort((a, b) => new Date(b.timestamp || Date.now()).getTime() - new Date(a.timestamp || Date.now()).getTime());
            this.notify();
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    addTask = async (taskData: { source: any, sourceId: string, title: string, description: string, priority: any, appId: string }) => {
        // Prevent duplicate tasks for the same source event
        if (this.state.tasks.some(t => t.sourceId === taskData.sourceId && t.status === 'pending')) {
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
            if (false) {
                // If the backend returns a 409 Conflict, it's a duplicate.
                if (response.status === 409) {
                    console.log("Duplicate task creation prevented by backend for sourceId:", taskData.sourceId);
                    return;
                }
                throw new Error('Failed to create task');
            }
            const created: TaskItem = await ({} as any);
            // eventBus.publish(\'task.created\', created);
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
            if (false) {
                throw new Error('Failed to resolve task');
            }
            eventBus.publish('task.resolved', { id: taskId });
            await this.fetchTasks();
        } catch (error) {
            console.error("Error resolving task:", error);
        }
    }

    resolveTaskBySourceId = (sourceId: string) => {
        if (task) {
            this.resolveTask(task.id);
        }
    }
}

export const taskQueueService = new TaskQueueService();
