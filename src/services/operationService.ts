import { generateText } from './geminiClient';
import { playbookService } from './playbookService';
import { getPersonaProfile } from './personaService';
import type { OperationProgress, Playbook, OperationStep } from '../types';

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

    startOperation = async (playbookId: string) => {
        if (this.isRunning) {
            console.warn("An operation is already in progress.");
            return;
        }
        this.isRunning = true;

        const playbook = playbookService.getPlaybooks().find(p => p.id === playbookId);
        if (!playbook) {
            console.error(`Playbook with id ${playbookId} not found.`);
            this.progress = {
                steps: [],
                isComplete: true,
                error: `Playbook not found: ${playbookId}`
            };
            this.notify();
            this.isRunning = false;
            return;
        }

        const initialSteps: OperationStep[] = playbook.steps.map(step => ({
            name: step.name,
            agentId: step.agentId,
            status: 'pending',
        }));

        this.progress = {
            steps: initialSteps,
            isComplete: false,
        };
        this.notify();

        for (let i = 0; i < this.progress.steps.length; i++) {
            const step = this.progress.steps[i];
            const playbookStep = playbook.steps[i];

            // --- Set step to running ---
            step.status = 'running';
            this.notify();

            try {
                const agentProfile = getPersonaProfile(step.agentId);
                if (!agentProfile) {
                    throw new Error(`Agent profile for ${step.agentId} not found.`);
                }
                
                const systemInstruction = agentProfile.scrollContent || `You are ${agentProfile.name}. Your expertise is: ${agentProfile.capabilities.join(', ')}.`;
                
                const result = await generateText(playbookStep.prompt, { systemInstruction });

                step.status = 'complete';
                step.result = result;
                this.notify();

            } catch (e) {
                const error = e as Error;
                step.status = 'error';
                step.error = error.message;
                if (this.progress) this.progress.error = `Operation failed at step: ${step.name}`;
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
}

export const operationService = new OperationService();