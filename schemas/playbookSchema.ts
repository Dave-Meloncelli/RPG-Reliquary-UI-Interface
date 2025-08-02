import { ark } from './arktype';

// Schema for Playbook based on types.ts
export const playbookStepSchema = ark({
    name: 'string',
    agentId: 'string',
    prompt: 'string',
});

export const playbookSchema = ark({
    id: 'string',
    name: 'string',
    description: 'string',
    steps: [playbookStepSchema, '[]'],
}).json;

export type Playbook = typeof playbookSchema.infer;
