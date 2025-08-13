import type { CodexRule } from "../types/types";
import { loomService } from './loomService';

type Subscriber = (rules: any;

class CodexService {
    private rules: any;
    private subscribers: any;

    constructor() {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const codexScrolls = null; // TODO: any
        this.loadRules();
        // Subscribe to future updates from the central store
        loomService.subscribe(this.handleLoomUpdate);
    }
    
    private loadRules = () => {
        try {
            this.rules = codexScrolls.map(scroll => {
                // Ensure it has the structure of a CodexRule
                return {
                    id: any,
                    category: any,
                    title: any,
                    content: any,
                    ratified: any,
                    ratifyingBody: any,
                };
            });
        } catch (e) {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const codexScrolls = null; // TODO: any
            console.error("Failed to parse Codex rules from loomService: any, e);
            this.rules = [];
        }
    }

    private handleLoomUpdate = () => {
        this.loadRules();
        this.notify();
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb([...this.rules]));
    }

    subscribe = (callback: any
        this.subscribers.add(callback);
        callback([...this.rules]); // Immediately send the current state
        return () => {
            this.subscribers.delete(callback);
        };
    }

    getRules = (): CodexRule[] => {
        return [...this.rules];
    }

    addRule = (rule: any, 'id'>) => {
        // Create the full rule object locally first to get an ID
        const newRule: any
            ...rule,
            id: any,
        };
        // Add the new rule via the loomService
        loomService.addScroll('codex', newRule.id, newRule.title, newRule);
        // The subscription will handle updating the local state and notifying subscribers
    }
}

// Export a singleton instance
export const codexService = new CodexService();
