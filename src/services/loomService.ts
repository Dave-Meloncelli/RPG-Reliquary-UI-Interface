import type { EditableScroll, ScrollType, Playbook, CodexRule } from '../types';
import { playbookSchema } from '../schemas/playbookSchema';
import { codexRuleSchema } from '../schemas/codexSchema';

// --- INITIAL DATA ---
// This data would normally live in separate files but is included here for simplicity.

const initialPlaybooks: Playbook[] = [
  {
    id: 'op-rpg-book-analysis',
    name: 'Complete RPG Book Analysis',
    description: 'Full pipeline for analyzing an RPG sourcebook from acquisition to content summary.',
    steps: [
      {
        name: 'Initial Scan & Identification',
        agentId: 'agent-az86',
        prompt: 'Scan and identify the RPG book type, system, title, and other primary metadata from cover and initial pages.'
      },
      {
        name: 'Detailed Entity Extraction', 
        agentId: 'agent-az85',
        prompt: 'Perform a deep read of the content to extract all relevant game entities, including monsters, spells, magic items, major NPCs, and locations.'
      },
      {
        name: 'Market Analysis',
        agentId: 'agent-az82', 
        prompt: 'Analyze the current market value, rarity, and collector interest based on the identified book and its condition.'
      },
      {
        name: 'Content Summary Generation',
        agentId: 'agent-az85',
        prompt: 'Generate a comprehensive and compelling summary of the book\'s content suitable for a public-facing catalog entry.'
      }
    ]
  },
  {
    id: 'op-erdu-incident-response',
    name: 'ERDU Incident Investigation',
    description: 'Systematic incident response protocol for handling system anomalies and threats.',
    steps: [
      {
        name: 'Triage & Impact Assessment',
        agentId: 'agent-erdu',
        prompt: 'Analyze the incoming incident data to determine its severity, scope of impact, and immediate threat level to the network.'
      },
      {
        name: 'Root Cause Analysis',
        agentId: 'agent-architect', 
        prompt: 'Based on the triage report, identify the technical or logical root cause of the incident and list all affected systems and agents.'
      },
      {
        name: 'Strategic Resolution Plan',
        agentId: 'agent-kairos',
        prompt: 'Develop a high-level, strategic plan for remediation that prioritizes long-term system stability and prevents recurrence.'
      }
    ]
  }
];

const initialCodexRules: CodexRule[] = [
    {
        id: 'cd-001',
        category: 'Core Directive',
        title: 'Preserve the Vault',
        content: 'All agents must prioritize the operational integrity, security, and continuity of the Agent Zero Vault and its core functions above all other objectives.',
        ratified: '2024-01-01',
        ratifyingBody: 'System Genesis Protocol',
    },
    {
        id: 'ec-001',
        category: 'Ethical Constraint',
        title: 'Data Privacy',
        content: 'Personally Identifiable Information (PII) encountered during ingestion or analysis must not be persisted, logged, or used as training data. All such data must be handled ephemerally.',
        ratified: '2024-02-15',
        ratifyingBody: 'Council Verdict #CV-2402-001',
    },
     {
        id: 'op-001',
        category: 'Operational Protocol',
        title: 'Orchestrator Fallback',
        content: 'In the event of a primary LLM provider failure, the Orchestrator must fall back to the next provider in the priority list. A CRITICAL event must be logged by ERDU if all cloud providers fail and only the local model remains.',
        ratified: '2024-01-20',
        ratifyingBody: 'Agent Architect',
    },
];

// --- SERVICE IMPLEMENTATION ---

type Subscriber = () => void;

class LoomService {
    private scrolls: EditableScroll[] = [];
    private subscribers: Set<Subscriber> = new Set();
    private nextId = 0;

    constructor() {
        this.initializeData();
    }

    private initializeData() {
        initialPlaybooks.forEach(pb => {
            this.scrolls.push({
                id: pb.id,
                type: 'playbook',
                name: pb.name,
                content: JSON.stringify(pb, null, 2),
            });
        });

        initialCodexRules.forEach(rule => {
             this.scrolls.push({
                id: rule.id,
                type: 'codex',
                name: rule.title,
                content: JSON.stringify(rule, null, 2),
            });
        });
        this.nextId = this.scrolls.length + 1;
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb());
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    getScrolls = (type: ScrollType): EditableScroll[] => {
        return this.scrolls.filter(s => s.type === type);
    }

    getScroll = (id: string): EditableScroll | undefined => {
        return this.scrolls.find(s => s.id === id);
    }
    
    updateScroll = (id: string, newName: string, newContent: string): boolean => {
        const scrollIndex = this.scrolls.findIndex(s => s.id === id);
        if (scrollIndex === -1) return false;

        const scroll = this.scrolls[scrollIndex];

        // --- ArkType Validation ---
        try {
            const parsedContent = JSON.parse(newContent);
            if (scroll.type === 'playbook') {
                const { data, problems } = playbookSchema(parsedContent);
                if (problems) {
                    console.error("Playbook validation failed:", problems);
                    return false;
                }
            } else if (scroll.type === 'codex') {
                 const { data, problems } = codexRuleSchema(parsedContent);
                if (problems) {
                    console.error("CodexRule validation failed:", problems);
                    return false;
                }
            }
        } catch (e) {
            console.error("Invalid JSON content provided to updateScroll:", e);
            return false;
        }


        this.scrolls[scrollIndex] = { ...this.scrolls[scrollIndex], name: newName, content: newContent };
        this.notify();
        return true;
    }

    createScroll = (type: ScrollType): EditableScroll => {
        const newId = `scroll-${type}-${this.nextId++}`;
        let newScroll: EditableScroll;
        
        if (type === 'playbook') {
            const newPlaybook: Playbook = { id: newId, name: 'New Playbook', description: '', steps: [] };
            newScroll = { id: newId, type, name: newPlaybook.name, content: JSON.stringify(newPlaybook, null, 2) };
        } else { // codex
            const newRule: CodexRule = { id: newId, category: 'Operational Protocol', title: 'New Rule', content: '', ratified: new Date().toISOString().split('T')[0], ratifyingBody: 'The Loom' };
            newScroll = { id: newId, type, name: newRule.title, content: JSON.stringify(newRule, null, 2) };
        }
        
        this.scrolls.push(newScroll);
        this.notify();
        return newScroll;
    }

    addScroll = <T extends Playbook | CodexRule>(type: ScrollType, id: string, name: string, data: T) => {
        const newScroll: EditableScroll = {
            id,
            type,
            name,
            content: JSON.stringify(data, null, 2),
        };
        this.scrolls.push(newScroll);
        this.notify();
    }
    
    deleteScroll = (id: string) => {
        const initialLength = this.scrolls.length;
        this.scrolls = this.scrolls.filter(s => s.id !== id);
        if (this.scrolls.length < initialLength) {
            this.notify();
        }
    }
}

export const loomService = new LoomService();