// Core type definitions for the az-interface system

// Basic data structures
export interface CuratedData {
  id: string;
  type: string;
  content: any;
}

export interface IncidentResponseProgress {
  id: string;
  status: "detected" | "investigating" | "mitigating" | "resolved";
  progress: number;
}

export interface AgentProfile {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
}

export interface LLMProvider {
  name: string;
  model: string;
  apiKey?: string;
}

// Additional type aliases for common patterns
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type BackupStatus = 'success' | 'failed' | 'in_progress';
export type CuratedBook = CuratedData & { type: 'book' };
export type ErduIncident = IncidentResponseProgress;
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

// Scroll and Loom types
export interface ScrollType {
  id: string;
  title: string;
  content: string;
  type: 'persona' | 'codex' | 'playbook' | 'general';
  tags: string[];
  lastModified: Date;
}

export interface EditableScroll extends ScrollType {
  isEditing: boolean;
  isDirty: boolean;
}

// Codex rule type
export interface CodexRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  category: string;
  isActive: boolean;
  priority: number;
}

// Agent relationship hierarchy
export interface AgentRelationshipNode {
  id: string;
  name: string;
  type: 'primary' | 'subordinate' | 'sidekick';
  children: AgentRelationshipNode[];
  profile?: AgentProfile;
}

// Quick action types
export interface QuickAction {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

// Extended LLM Provider interface
export interface ExtendedLLMProvider extends LLMProvider {
  type: 'openai' | 'anthropic' | 'google' | 'local';
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
}
