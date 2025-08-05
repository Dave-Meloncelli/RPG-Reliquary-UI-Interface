import type { N8nWorkflow, WorkflowRun, WorkflowInput } from "../types/types";

interface N8nState {
    workflows: N8nWorkflow[];
    runHistory: Record<string, WorkflowRun[]>;
}

type Subscriber = (state: N8nState) => void;

class N8nService {
    private state: N8nState;
    private subscribers: Set<Subscriber> = new Set();
    private runIdCounter = 0;

    constructor() {
        this.state = {
            workflows: [
                { id: 'wf-publish-product', name: 'Publish Product to Shopify', description: 'Full pipeline for taking an analyzed product and creating a live Shopify listing.', status: 'Idle' },
                { id: 'wf-social-media', name: 'Generate Social Media Content', description: 'Takes product info and generates posts for various social platforms.', status: 'Idle' },
                { id: 'wf-create-placeholders', name: 'Create Shopify Placeholders', description: 'Creates draft product listings in Shopify from curated book data.', status: 'Idle' },
            ],
            runHistory: {},
        };
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb(this.state));
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        callback(this.state);
        return () => this.subscribers.delete(callback);
    }

    private setWorkflowStatus(workflowId: string, status: 'Idle' | 'Running') {
        if (workflow) {
            workflow.status = status;
            this.notify();
        }
    }

    private addRunHistory(workflowId: string, run: WorkflowRun) {
        if (!this.state.runHistory[workflowId]) {
            this.state.runHistory[workflowId] = [];
        }
        this.state.runHistory[workflowId].push(run);
        this.notify();
    }
    
    runWorkflow(workflowId: string) {
        this.runWorkflowWithInput(workflowId, undefined);
    }

    runWorkflowWithInput(workflowId: string, input: WorkflowInput | undefined) {
        if (!workflow || workflow.status === 'Running') return;

        this.setWorkflowStatus(workflowId, 'Running');
        
        const run: WorkflowRun = {
            id: `run-${this.runIdCounter++}`,
            timestamp: new Date().toLocaleString(),
            status: 'running',
            durationMs: 0,
            input,
        };
        this.addRunHistory(workflowId, run);
        
        
        // Simulate async work
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate

            run.status = success ? 'Success' : 'Failed';
            run.durationMs = endTime - startTime;
            run.output = success ? { success: true, data: { message: `Workflow ${workflowId} completed.` } } : { success: false, error: 'A simulated error occurred.' };

            this.setWorkflowStatus(workflowId, 'Idle');
            this.notify();
        }, 2000 + Math.random() * 3000);
    }
}

export const n8nService = new N8nService();
