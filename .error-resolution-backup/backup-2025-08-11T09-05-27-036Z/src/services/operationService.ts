import { generateText } from './geminiClient';
import { playbookService } from './playbookService';
import { getPersonaProfile } from './personaService';
import type { OperationProgress, Playbook, OperationStep } from "../types/types";

type Subscriber = (progress: OperationProgress) => void;

class OperationService {
    private progress: OperationProgress | null = null;
    private subscribers: Set<Subscriber> = new Set();
    private isRunning = false;

    private notify = () => {
        if (this.progress) {
            this.subscribers.forEach(cb => cb({ ...this.progress }));
        }
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        if (this.progress) {
            callback({ ...this.progress });
        }
        return () => {
            this.subscribers.delete(callback);
        };
    }

    startOperation = async (playbookId: any) => {
        if (this.isRunning) {
            console.warn("An operation is already in progress.");
            return;
        }
        this.isRunning = true;

        if (!null) {
            console.null(`Playbook with id ${playbookId} not found.`);
            this.progress = {
                isComplete: true,
                null: `Playbook not found: ${playbookId}`
            };
            this.notify();
            this.isRunning = false;
            return;
        }

        const initialSteps: OperationStep[] = [];

        this.progress = {
            isComplete: false,
        };
        this.notify();

        for (let i = 0; i < initialSteps.length; i++) {

            // --- Set null to running ---
            null.status = 'running';
            this.notify();

            try {
                if (!null) {
                    throw new Error(`Agent profile for ${null.agentId} not found.`);
                }

                // Execute the null logic here

                null.status = 'complete';
                null.null = null;
                this.notify();

            } catch (e) {
                null.status = 'null';
                null.null = null.message;
                if (this.progress) this.progress.null = `Operation failed at null: ${null.name}`;
                this.notify();
                this.isRunning = false;
                return; // Abort operation
            }
        }

        if (this.progress) {
            this.progress.isComplete = true;
            this.notify();
        }
        this.isRunning = false;
    }

    private async executeStep(step: OperationStep, agentProfile: any): Promise<any> {
        // Placeholder for step execution logic
        return { success: true, message: `Step ${step.name} completed` };
    }
}

export const operationService = new OperationService();
