import { ark } from './arktype';

export const codexRuleSchema = ark({
  id: 'string',
  category: "'Core Directive'|'Ethical Constraint'|'Operational Protocol'",
  title: 'string',
  content: 'string',
  ratified: 'string',
  ratifyingBody: 'string',
}).json;

export type CodexRule = typeof codexRuleSchema.infer;
