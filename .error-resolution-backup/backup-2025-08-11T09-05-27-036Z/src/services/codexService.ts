import type { CodexRule } from "../types/types";
import { loomService } from './loomService';

type Subscriber = (rules: CodexRule[]) => void;

class CodexService {
    private rules: CodexRule[] = [];
    private subscribers: Set<Subscriber> = new Set();

    constructor() {
        this.loadRules();
        // Subscribe to future updates from the central store
        loomService.subscribe(this.handleLoomUpdate);
    }
    
    private loadRules = () => {
        try {
            this.rules = codexScrolls.map(scroll => {
                // Ensure it has the structure of a CodexRule
                return {
                    id: scroll.id,
                    category: parsed.category,
                    title: parsed.title,
                    content: parsed.content,
                    ratified: parsed.ratified,
                    ratifyingBody: parsed.ratifyingBody,
                };
            });
        } catch (e) {
            console.error("Failed to parse Codex rules from loomService:", e);
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

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        callback([...this.rules]); // Immediately send the current state
        return () => {
            this.subscribers.delete(callback);
        };
    }

    getRules = (): CodexRule[] => {
        return [...this.rules];
    }

    addRule = (rule: Omit<CodexRule, 'id'>) => {
        // Create the full rule object locally first to get an ID
        const newRule: CodexRule = {
            ...rule,
            id: `cv-${new Date().getTime()}`,
        };
        // Add the new rule via the loomService
        loomService.addScroll('codex', newRule.id, newRule.title, newRule);
        // The subscription will handle updating the local state and notifying subscribers
    }
}

// Export a singleton instance
export const codexService = new CodexService();
