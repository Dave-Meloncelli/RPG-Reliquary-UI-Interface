import { ark } from './arktype';

// Schema for CodexRule based on types.ts
export const codexRuleSchema = ark({
    id: 'string',
    category: "'Core Directive'|'Ethical Constraint'|'Operational Protocol'",
    title: 'string',
    content: 'string',
    ratified: 'string', // Could be more specific with regex, e.g., /^\d{4}-\d{2}-\d{2}$/
    ratifyingBody: 'string',
}).json;

export type CodexRule = typeof codexRuleSchema.infer;
