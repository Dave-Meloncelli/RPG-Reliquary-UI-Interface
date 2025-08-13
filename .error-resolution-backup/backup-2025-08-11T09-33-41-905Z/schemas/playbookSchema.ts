import { type } from 'arktype';

// Schema for Playbook based on types.ts
export const playbookStepSchema = type({
    name: 'string',
    agentId: 'string',
    prompt: 'string',
});

export const playbookSchema = type({
    id: 'string',
    name: 'string',
    description: 'string',
    steps: playbookStepSchema.array(),
});

export type Playbook = typeof playbookSchema.infer;
