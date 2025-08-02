

import { type FC } from 'react';

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  Component: FC;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaximizeState?: { x: number; y: number; width: number; height: number };
}

export type Agent = 'Kairos' | 'Sophia' | 'Jordan' | 'System' | 'Zero' | 'Ghost' | 'Nya' | 'Major Payne' | 'Steel Core' | 'The Weaver' | 'Tinker Hexbolt' | 'The Archivist' | 'Aeon Indexwell' | 'The Cartographer' | 'Machine Spirit' | 'Piney' | 'Joyn' | 'The Technomancer';

export interface CouncilMessage {
  agent: Agent;
  text: string;
}

export interface RpgBookAnalysis {
  title: string;
  authors: string[];
  edition?: string;
  publisher?: string;
  series?: string;
}

export interface SymbolicStatus {
    activityState: 'Online' | 'Busy' | 'Idle' | 'Dormant';
    health: 'Optimal' | 'Stable' | 'Fluctuating' | 'Critical';
    alignment: 'Aligned' | 'Weaving' | 'Drifting' | 'Fractured';
}

// The new, harmonized agent profile, combining technical and lore data.
export interface AgentProfile {
    id: string;
    name: string;
    icon: FC;
    capabilities: string[];
    status: SymbolicStatus;
    // --- New Lore Attributes ---
    title?: string;
    class?: string;
    role?: string;
    scrollContent?: string;
}

export interface OperationStep {
    name: string;
    agentId: string;
    status: 'pending' | 'running' | 'complete' | 'error';
    result?: string;
    error?: string;
}

export interface IngestionReport {
    summary: string;
    details: { [key: string]: string };
}

export interface IngestionProgress {
    steps: OperationStep[];
    isComplete: boolean;
    report?: IngestionReport;
    error?: string;
}

// --- Orchestrator Types ---
export interface LLMProvider {
  name: string;
  enabled: boolean;
  baseUrl: string;
  apiKey?: string;
  model: string;
  maxRetries: number;
  timeout: number;
  capabilities: string[];
}

export interface AgentPreferences {
  [agentId: string]: {
    preferred: string[];
  };
}

export interface FallbackStrategy {
  enableFallback: boolean;
  fallbackOnError: boolean;
  fallbackOnTimeout: boolean;
  fallbackOnLowConfidence: boolean;
  confidenceThreshold: number;
}

export interface CostOptimization {
  trackCosts: boolean;
  monthlyBudget: number;
  preferLocalModels: boolean;
  cacheResponses: boolean;
  cacheTTL: number;
}

export interface OrchestratorConfig {
  priority: string[];
  providers: {
    [providerName: string]: LLMProvider;
  };
  agentPreferences: AgentPreferences;
  fallbackStrategy: FallbackStrategy;
  costOptimization: CostOptimization;
}

// --- Symposium Types ---
export interface SymposiumMessage {
  agentId: string;
  agentName: string;
  agentIcon: FC;
  text: string;
  isSummary?: boolean;
}

// --- ERDU Monitor Types ---
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface ErduLogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface SystemStatus {
  integrity: number; // 0-100
  threatLevel: number; // 0-100
}

export interface IncidentResponseProgress {
  steps: OperationStep[];
  isComplete: boolean;
  error?: string;
}

export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ErduIncident {
  id: string;
  description: string;
  severity: IncidentSeverity;
  timestamp: string;
  status: 'Pending' | 'Resolved';
  agentInvolved?: string;
}

// --- Observatory Types ---
export interface ObservatoryMetrics {
    totalLLMCalls: number;
    estimatedCost: number; // in USD
    avgTaskDuration: number; // in ms
}

export interface LLMCallLog {
    id: string;
    timestamp: string;
    agentId: string;
    provider: string;
    model: string;
    tokens: number;
    cost: number;
}

export interface AgentTaskLog {
    id: string;
    timestamp: string;
    agentId: string;
    taskType: string;
    duration: number; // in ms
}

// --- Diagnostics Types ---
export interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  params?: Array<{ id: string; label: string; type: 'agent' | 'channel' }>;
}

export interface DiagnosticLogEntry {
    id: number;
    timestamp: string;
    status: 'info' | 'success' | 'error' | 'running';
    message: string;
}

// --- Playbook Types ---
export interface PlaybookStep {
    name: string;
    agentId: string;
    prompt: string;
}

export interface Playbook {
    id: string;
    name: string;
    description: string;
    steps: PlaybookStep[];
}

// --- Infrastructure Types ---
export interface DockerService {
    id: string;
    name: string;
    image: string;
    status: 'running' | 'stopped' | 'restarting' | 'error';
}

export interface Pm2Process {
    id: string;
    name: string;
    status: 'online' | 'stopped' | 'errored' | 'launching';
    cpu: number; // percentage
    memory: number; // in MB
}

export interface InfrastructureStatus {
    docker: DockerService[];
    pm2: Pm2Process[];
}

// --- Codebase Types ---
export interface GitCommit {
    id: string;
    timestamp: string;
    author: string;
    message: string;
}

export interface WebhookDelivery {
    id: string;
    timestamp: string;
    event: 'push' | 'pull_request';
    success: boolean;
}

// --- Backup & Recovery Types ---
export interface BackupStatus {
    lastBackupTimestamp: string | null;
    lastBackupStatus: 'Success' | 'Failed' | 'Never run';
}

export interface BackupLogEntry {
    id: number;
    timestamp: string;
    message: string;
}

// --- Control Panel Types ---
export interface ApiKeyConfig {
    name: string;
    key: string;
}

export interface ControlPanelState {
    apiKeys: Record<string, ApiKeyConfig>;
    orchestrator: {
        monthlyBudget: number;
        providerEnabled: Record<string, boolean>;
    };
    agentMasterStatus: Record<string, 'Online' | 'Dormant'>;
}

// --- Vault Codex Types ---
export interface CodexRule {
    id: string;
    category: 'Core Directive' | 'Ethical Constraint' | 'Operational Protocol';
    title: string;
    content: string;
    ratified: string; // date string
    ratifyingBody: string; // e.g., 'Council Verdict'
}

// --- Command Hierarchy Types ---
export interface AgentRelationshipNode {
    id: string;
    name: string;
    icon: FC;
    type: 'primary' | 'subordinate' | 'sidekick';
    children: AgentRelationshipNode[];
}

// --- Companion Chat Types ---
export interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

// --- Loom Types ---
export type ScrollType = 'playbook' | 'codex';

export interface EditableScroll {
    id: string;
    type: ScrollType;
    name: string;
    content: string; // Stringified JSON of the object (Playbook or CodexRule)
}

// --- Operations Console Types ---
export interface OperationProgress {
    steps: OperationStep[];
    isComplete: boolean;
    error?: string;
}

// --- Vault Explorer Types ---
export type SearchableSourceType = 'Playbook' | 'Codex' | 'Persona' | 'File';

export interface SearchResult {
    id: string;
    title: string;
    snippet: string; // A small piece of content with match highlighted
    sourceType: SearchableSourceType;
    sourceId: string; // The original ID of the item
}

// --- Aegis Dashboard Types ---
export type WidgetType = 'SystemStatus' | 'KeyMetrics' | 'AgentStatusSummary';

export interface WidgetConfig {
    id: string;
    type: WidgetType;
    gridArea: string; 
}

export interface DashboardLayout {
    gridTemplateAreas: string;
    widgets: WidgetConfig[];
}

// --- Automation Hub (N8N) Types ---
export interface N8nWorkflow {
    id: string;
    name: string;
    description: string;
    status: 'Idle' | 'Running';
}

export interface WorkflowInput {
  sourceApp: string;
  payload: any;
}

export interface WorkflowOutput {
  success: boolean;
  data?: any;
  error?: string;
}

export interface WorkflowRun {
    id: string;
    timestamp: string;
    status: 'Success' | 'Failed' | 'Running';
    durationMs: number;
    input?: WorkflowInput;
    output?: WorkflowOutput;
}

// --- Acquisitions App Types ---
export interface AcquisitionStep {
    name: string;
    agentId: string;
    status: 'pending' | 'running' | 'complete' | 'error' | 'review_pending';
    result?: string;
    error?: string;
}

export interface BookDimensions {
    width_mm: number;
    height_mm: number;
    thickness_mm: number;
    weight_grams: number;
}

export interface AcquiredBookData {
    title: string;
    authors: string[];
    isbn?: string;
    publisher?: string;
    blurb?: string;
    dimensions?: BookDimensions;
}

export interface AcquisitionProgress {
    steps: AcquisitionStep[];
    isComplete: boolean;
    error?: string;
    acquiredData?: AcquiredBookData;
    shopifyDescription?: string;
    councilReviewNeeded?: boolean;
}

// --- Curator App Types ---
export interface CuratorTarget {
  id: string;
  name: string;
  url: string;
  lastScraped: string;
  nextScrape: string;
  status: 'Idle' | 'Scraping' | 'Failed';
  isNewDiscovery?: boolean;
}

export interface CuratedBook {
    title: string;
    isbn: string;
    mpn?: string;
    sourceName: string;
    sourceUrl: string;
}

export interface CuratedData {
    bookList: CuratedBook[];
    priceHistory: Array<{ date: string; price: number; source: string, sourceName: string, sourceUrl: string }>;
    series: Array<{ name: string; bookCount: number, sourceName: string, sourceUrl: string }>;
    gossipAndLore: Array<{ timestamp: string; content: string, sourceName: string, sourceUrl: string }>;
    blogPosts: Array<{ title: string; summary: string, sourceName: string, sourceUrl: string }>;
}

// --- Technomancer App Types ---
export interface MonitoredTechnology {
    id: string;
    name: string;
    version: string;
    status: 'Up-to-date' | 'Update Available' | 'Vulnerable' | 'Unknown';
    category: 'Frontend' | 'Backend' | 'AI Core' | 'Database';
}

export interface TechUpdateLog {
    id: string;
    techId: string;
    techName: string;
    timestamp: string;
    type: 'Update' | 'Patch' | 'Security Advisory';
    fromVersion: string;
    toVersion: string;
    importance: 'Low' | 'Medium' | 'High' | 'Critical';
    changelogUrl: string;
}

export interface FaultFixRecord {
    id: string;
    timestamp: string;
    fault: string;
    resolution: string;
    affectedSystems: string[];
}

// --- Universal Parser & Indexer Types ---
export interface ParsedData {
  origin: string; // filename
  format: string; // e.g., 'pdf', 'json', 'zip'
  type: string; // e.g., 'Document', 'Configuration', 'Archive'
  content?: string; // Raw text content
  data?: any; // Parsed structured data (e.g., from JSON)
  children?: ParsedData[]; // For archives
  errors?: string[];
}

export interface VaultIndexEntry {
  id: string;
  title: string;
  content: string;
  sourceType: SearchableSourceType;
  sourceId: string; // The original filename or internal ID
}

// --- Desktop Bridge Types ---
export interface ParsedFile {
    id: number;
    name: string;
    status: 'pending' | 'parsing' | 'indexing' | 'complete' | 'error';
    message: string;
}

export type DesktopBridgeEvent = 'parse_progress' | 'parse_complete' | 'parse_error';

export interface DesktopBridge {
    invoke: (command: 'parse_and_index_files', args: { files: File[] }) => Promise<void>;
    listen: (event: DesktopBridgeEvent, callback: (payload: any) => void) => () => void; // Returns an unlisten function
}

// --- Knowledge Graph Types ---
export interface ForensicEvent {
    id: string;
    componentId: string;
    timestamp: string;
    type: 'commit' | 'deploy' | 'config_change' | 'error' | 'log';
    author: string;
    summary: string;
}

export interface CodeCommit {
    id: string;
    summary: string;
    author: string;
    date: string;
}

export interface CodeLineage {
    id: string;
    name: string;
    description: string;
    dependencies: string[];
    relatedDocuments: string[];
    commitHistory: CodeCommit[];
}

// --- Task & Review Hub Types ---
export type TaskSource = 'Acquisitions' | 'Curator' | 'System';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'Resolved';

export interface TaskItem {
    id: string;
    source: TaskSource;
    sourceId: string; // e.g., the acquisition ID or curator target ID
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    timestamp: string;
    appId: string; // The app to open to resolve the task
}

export interface EventMap {
  /** Emitted whenever a new task is created via `taskQueueService.addTask`. */
  'task.created': TaskItem;
  /** Emitted when a task is resolved. */
  'task.resolved': { id: string };
  /** General system alert payload. */
  'system.alert': { level: LogLevel; message: string };
  /** Authentication events */
  'auth.login': { user: { id: number; username: string; email: string; is_active: boolean; is_admin: boolean } };
  'auth.logout': {};
  'auth.register': { user: { id: number; username: string; email: string; is_active: boolean; is_admin: boolean } };
  'auth.error': { error: string };
  /** OCR scan completion event */
  'ocr.scan.complete': { result: any };
  // Extend this map with further events as needed.
}

// Additional utility types for better type safety
export type AppId = string;
export type WindowId = string;
export type AgentId = string;

// Strict typing for configuration objects
export interface AppConfig {
  readonly id: AppId;
  readonly title: string;
  readonly defaultSize: { readonly width: number; readonly height: number };
}

// Error types for better error handling
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: AppError;
}
