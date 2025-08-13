import type { CodexRule } from "../types/types";

import { loomService } from "./loomService";

type Subscriber = (rules: any[]) => void;

class CodexService {
  private rules: any[] = [];
  private subscribers: Set<Subscriber> = new Set();

  constructor() {
    this.loadRules();
    // Subscribe to future updates from the central store
    loomService.subscribe(this.handleLoomUpdate);
  }

  private loadRules = () => {
    try {
      // TODO: Implement proper codex scrolls loading
      this.rules = [];
    } catch (e) {
      console.error("Failed to parse Codex rules from loomService:", e);
      this.rules = [];
    }
  };

  private handleLoomUpdate = () => {
    this.loadRules();
    this.notify();
  };

  private notify = () => {
    this.subscribers.forEach((cb) => cb([...this.rules]));
  };

  subscribe = (callback: Subscriber) => {
    this.subscribers.add(callback);
    callback([...this.rules]); // Immediately send the current state
    return () => {
      this.subscribers.delete(callback);
    };
  };

  getRules = (): CodexRule[] => {
    return [...this.rules];
  };

  addRule = (rule: Partial<CodexRule>) => {
    // Create the full rule object locally first to get an ID
    const newRule: CodexRule = {
      ...rule,
      id: rule.id || `rule_${Date.now()}`,
    } as CodexRule;

    // Add the new rule via the loomService
    loomService.addScroll("codex", newRule.id, newRule.title || "", newRule);
    // The subscription will handle updating the local state and notifying subscribers
  };
}

// Export a singleton instance
export const codexService = new CodexService();
