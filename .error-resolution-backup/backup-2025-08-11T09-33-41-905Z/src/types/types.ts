// Core type definitions for the az-interface system

// Window Management Types
export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isResizable?: boolean;
  isDraggable?: boolean;
}

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  Component: React.ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaximizeState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AppDefinition {
  id: string;
  name: string;
  description?: string;
  icon: ReactNode;
  category: AppCategory;
  component: ComponentType<AppProps>;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  isResizable?: boolean;
  isDraggable?: boolean;
  requiresAuth?: boolean;
  dependencies?: string[];
}

export interface AppProps {
  windowId: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isActive?: boolean;
}

export type AppCategory =
  | 'system'
  | 'productivity'
  | 'development'
  | 'ai'
  | 'utilities'
  | 'games'
  | 'communication'
  | 'monitoring';

// API and System Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SystemInfo {
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  timestamp: number;
}

export interface EventBusEvent {
  type: string;
  payload?: any;
  timestamp: number;
  source?: string;
}

export interface ServiceConfig {
  enabled: boolean;
  retryAttempts?: number;
  timeout?: number;
  baseURL?: string;
}

// Context Types
export interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (appId: string, customProps?: any) => string;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  updateWindow: (windowId: string, updates: Partial<WindowState>) => void;
  bringToFront: (windowId: string) => void;
  getActiveWindow: () => WindowState | null;
}

export interface AppRegistryContextType {
  apps: Record<string, AppDefinition>;
  getApp: (id: string) => AppDefinition | undefined;
  getAppsByCategory: (category: AppCategory) => AppDefinition[];
  registerApp: (app: AppDefinition) => void;
  unregisterApp: (id: string) => void;
}

// Error Types
export interface AppError extends Error {
  code?: string;
  details?: any;
  timestamp: number;
  context?: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
  timestamp?: string;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Auth Types
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Autonomous System Types
export interface AutonomousErrorReport {
  timestamp: string;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  componentStack?: string;
  context: {
    userAgent: string;
    url: string;
    userId: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

export interface AutonomousFrame {
  id: string;
  name: string;
  type: 'critical' | 'non-critical';
  status: 'active' | 'inactive' | 'error' | 'recovering';
  dependencies?: string[];
  retryCount: number;
  maxRetries: number;
  lastExecution?: string;
  errorHistory: AutonomousErrorReport[];
}

export interface ScaffoldConfig {
  frameId: string;
  scaffoldType: 'error_handling' | 'retry_logic' | 'fallback' | 'recovery';
  parameters: Record<string, any>;
  enabled: boolean;
  priority: number;
}

// Health and Monitoring Types
export interface BackendHealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
  uptime?: number;
  services?: Record<string, boolean>;
}

// UI Types
export type Theme = 'dark' | 'light' | 'auto';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Environment Types
declare global {
  interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_APP_ENV: 'development' | 'production' | 'test';
    readonly VITE_DEBUG_MODE: string;
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_ERROR_REPORTING: string;
    readonly DEV: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Agent Types
export interface AgentProfile {
  id: string;
  name: string;
  description?: string;
  status: SymbolicStatus;
  capabilities: string[];
  currentTask?: string;
  lastActive: Date;
  xpLevel: number;
  securityLevel: number;
  scrollContent?: string;
  icon?: string;
}

export type SymbolicStatus = 'active' | 'idle' | 'busy' | 'offline' | 'error';

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: "detected" | "investigating" | "mitigating" | "resolved";
  capabilities: string[];
}

// Council and Symposium Types
export interface CouncilMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SymposiumMessage {
  id: string;
  sender?: AgentProfile;
  agentId?: string;
  agentName?: string;
  agentIcon?: string;
  content: string;
  text?: string;
  timestamp: Date;
  topic?: string;
  references?: string[];
}

// Operation Types
export interface OperationStep {
  id?: string;
  name: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
  result?: any;
}

export interface OperationProgress {
  operationId?: string;
  currentStep?: number;
  totalSteps?: number;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  startTime?: Date;
  estimatedCompletion?: Date;
  error?: string;
  isComplete?: boolean;
  steps?: OperationStep[];
}

// Ingestion Types
export interface IngestionReport {
  id: string;
  status: 'success' | 'failed' | 'partial';
  totalItems: number;
  processedItems: number;
  errors: string[];
  timestamp: Date;
}

export interface IngestionProgress {
  currentStep: string;
  progress: number;
  estimatedTimeRemaining: number;
  errors: string[];
}

// Orchestrator Types
export interface OrchestratorConfig {
  maxConcurrentOperations: number;
  retryAttempts: number;
  timeout: number;
  enableLogging: boolean;
  priority?: string[];
  providers?: any;
}

// ERDU Types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface ErduLogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source: string;
  context?: any;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
}

export interface IncidentResponseProgress {
  incidentId: string;
  status: 'detected' | 'investigating' | 'mitigating' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  assignedAgent?: string;
}

export interface IncidentEvent {
  timestamp: Date;
  event: string;
  details: string;
  agent?: string;
}

// Observatory Types
export interface ObservatoryMetrics {
  totalLLMCalls: number;
  averageResponseTime: number;
  successRate: number;
  activeAgents: number;
  systemHealth: number;
  estimatedCost?: number;
  avgTaskDuration?: number;
}

export interface LLMCallLog {
  id: string;
  model: string;
  prompt: string;
  response: string;
  timestamp: Date | string;
  duration: number;
  tokens: number;
  cost: number;
}

export interface AgentTaskLog {
  agentId: string;
  taskId: string;
  taskType: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  result?: any;
}

// Diagnostic Types
export interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  run: () => Promise<DiagnosticResult>;
}

export interface DiagnosticResult {
  passed: boolean;
  message: string;
  details?: any;
  recommendations?: string[];
}

export interface DiagnosticLogEntry {
  testId: string;
  timestamp: Date;
  result: DiagnosticResult;
  duration: number;
}

// Playbook Types
export interface Playbook {
  id: string;
  name: string;
  description: string;
  steps: PlaybookStep[];
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybookStep {
  id?: string;
  name: string;
  description?: string;
  prompt: string;
  agentId: string;
  expectedOutput?: string;
  validationRules?: string[];
  dependencies?: string[];
}

// Infrastructure Types
export interface InfrastructureStatus {
  docker: DockerService[];
  pm2: Pm2Process[];
  overallHealth: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface DockerService {
  name: string;
  status: 'running' | 'stopped' | 'restarting' | 'paused';
  image: string;
  ports: string[];
  volumes: string[];
  environment: Record<string, string>;
}

export interface Pm2Process {
  name: string;
  status: 'online' | 'stopped' | 'stopping' | 'launching' | 'errored' | 'one-launch-status';
  pmId: number;
  cpu: number;
  memory: number;
  uptime: number;
}

// Codebase Types
export interface GitCommit {
  hash: string;
  author: string;
  message: string;
  timestamp: Date;
  files: string[];
}

export interface WebhookDelivery {
  id: string;
  event: string;
  payload: any;
  timestamp: Date;
  status: 'delivered' | 'failed' | 'pending';
  retries: number;
}

// Backup Types
export interface BackupLogEntry {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'success' | 'failed' | 'in_progress';
  size: number;
  timestamp: Date;
  path: string;
  retentionDays: number;
}

// Control Panel Types
export interface ControlPanelState {
  apiKeys: {
    google: { name: string; key: string };
    openai: { name: string; key: string };
    chutes: { name: string; key: string };
  };
  orchestrator: {
    monthlyBudget: number;
    providerEnabled: Record<string, boolean>;
  };
  agentMasterStatus: Record<string, 'Online' | 'Dormant'>;
  aiAutonomy?: {
    agentAutonomyLevels: Record<string, AutonomyLevel>;
    permissionScopes: Record<string, PermissionScope>;
  };
}

export type AutonomyLevel = 'restricted' | 'supervised' | 'autonomous' | 'enhanced';

export interface PermissionScope {
  enabled: boolean;
  level: PermissionLevel;
}

export type PermissionLevel =
  | 'none'
  | 'read_only'
  | 'filtered'
  | 'sandboxed'
  | 'monitored'
  | 'restricted'
  | 'read_write'
  | 'full';

// Chat Types
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'error';
  metadata?: any;
}

// Dashboard Types
export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  grid: GridConfig;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
}

export type WidgetType = 'metrics' | 'chart' | 'table' | 'status' | 'log' | 'custom';

export interface GridConfig {
  columns: number;
  rows: number;
  cellSize: { width: number; height: number };
}

// Acquisition Types
export interface AcquisitionProgress {
  id: string;
  status: 'scanning' | 'processing' | 'analyzing' | 'publishing' | 'complete';
  currentStep: AcquisitionStep;
  progress: number;
  errors: string[];
  startTime: Date;
  estimatedCompletion?: Date;
}

export interface AcquisitionStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface AcquiredBookData {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  condition: string;
  estimatedValue: number;
  dimensions: BookDimensions;
  images: string[];
  metadata: Record<string, any>;
}

export interface BookDimensions {
  width: number;
  height: number;
  thickness: number;
  weight: number;
}

// Curator Types
export interface CuratorTarget {
  id: string;
  name: string;
  type: 'book' | 'article' | 'data' | 'image';
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface CuratedData {
  id: string;
  targetId: string;
  content: any;
  quality: number;
  tags: string[];
  metadata: Record<string, any>;
  timestamp: Date;
}

// Technomancer Types
export interface MonitoredTechnology {
  id: string;
  name: string;
  version: string;
  type: 'library' | 'framework' | 'service' | 'database';
  status: 'stable' | 'deprecated' | 'vulnerable' | 'unknown' | 'Up-to-date' | 'Vulnerable' | 'Update Available';
  lastChecked: Date;
  updateAvailable: boolean;
  latestVersion?: string;
}

export interface TechUpdateLog {
  id: string;
  technologyId: string;
  action: 'check' | 'update' | 'rollback';
  fromVersion?: string;
  toVersion?: string;
  status: 'success' | 'failed' | 'in_progress';
  timestamp: Date | string;
  details?: string;
}

export interface FaultFixRecord {
  id: string;
  faultId: string;
  description: string;
  solution: string;
  appliedBy: string;
  timestamp: Date | string;
  success: boolean;
  rollbackRequired: boolean;
}

// Knowledge Graph Types
export interface ForensicEvent {
  id: string;
  type: string;
  timestamp: Date | string;
  source: string;
  data: any;
  relatedEvents: string[];
  componentId?: string;
  summary?: string;
}

export interface CodeLineage {
  file: string;
  commits: GitCommit[];
  dependencies: string[];
  impact: 'low' | 'medium' | 'high' | 'critical';
  lastModified: Date;
  name?: string;
}

// N8N Types
export interface N8nWorkflow {
  id: string;
  name: string;
  active?: boolean;
  status?: string;
  description?: string;
  nodes?: N8nNode[];
  connections?: N8nConnection[];
  settings?: N8nWorkflowSettings;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
}

export interface N8nConnection {
  from: string;
  to: string;
  fromOutput: number;
  toInput: number;
}

export interface N8nWorkflowSettings {
  saveExecutionProgress: boolean;
  saveManualExecutions: boolean;
  callerPolicy: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'canceled';
  startTime: Date;
  endTime?: Date;
  data?: any;
  error?: string;
  durationMs?: number;
  output?: any;
}

export interface WorkflowInput {
  workflowId: string;
  data: any;
  options?: any;
}

// Task Queue Types
export interface TaskItem {
  id: string;
  type: string;
  priority: TaskPriority;
  source: TaskSource;
  sourceId?: string;
  data: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retries: number;
  maxRetries: number;
  timestamp?: Date;
}

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type TaskSource = 'user' | 'system' | 'scheduled' | 'webhook';

// Event Bus Types
export interface SearchResult {
  id: string;
  type: SearchableSourceType;
  title: string;
  fullContent: string;
  relevance: number;
  metadata?: Record<string, any>;
}

export type SearchableSourceType = 'playbook' | 'codex' | 'persona' | 'document';

export interface EventMap {
  'system:startup': { timestamp: Date };
  'system:shutdown': { timestamp: Date };
  'agent:created': { agent: AgentProfile };
  'agent:updated': { agent: AgentProfile };
  'agent:deleted': { agentId: string };
  'task:created': { task: TaskItem };
  'task:completed': { task: TaskItem };
  'task:failed': { task: TaskItem; error: string };
  'workflow:started': { workflow: N8nWorkflow };
  'workflow:completed': { workflow: N8nWorkflow; result: any };
  'backup:created': { backup: BackupLogEntry };
  'diagnostic:run': { test: DiagnosticTest; result: DiagnosticResult };
  'incident:detected': { incident: IncidentResponseProgress };
  'incident:resolved': { incident: IncidentResponseProgress };
  'n8n.workflow.complete': { run: any };
  'n8n.workflow.failed': { run: any; error: any };
  'ocr.scan.complete': { result: any };
  'task.created': { task: TaskItem };
  'task.resolved': { id: string };
  'traffic.journey.progress': { journey: any; progress: number };
  'auth.login': { user: any };
  'auth.logout': {};
  'auth.register': { user: any };
  'auth.error': { error: string };
}

// RPG Book Analysis Types
export interface RpgBookAnalysis {
  title: string;
  publisher: string;
  condition: string;
  estimatedValue: number;
  marketDemand: 'low' | 'medium' | 'high';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  keywords: string[];
  description: string;
  recommendations: string[];
}

// Codex Types
export interface CodexRule {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  content?: string;
  category: string;
  pattern?: string;
  replacement?: string;
  priority?: number;
  enabled?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  ratified?: string;
  ratifyingBody?: string;
}

// Scroll Types
export interface EditableScroll {
  id: string;
  title?: string;
  name?: string;
  content: string;
  type: ScrollType;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export type ScrollType = 'lore' | 'guide' | 'reference' | 'story' | 'technical' | 'playbook' | 'codex';

// Agent Relationship Types
export interface AgentRelationshipNode {
  id: string;
  agent: AgentProfile;
  relationships: AgentRelationship[];
  influence: number;
  trust: number;
}

export interface AgentRelationship {
  targetAgentId: string;
  type: 'mentor' | 'peer' | 'subordinate' | 'collaborator' | 'competitor';
  strength: number;
  trust: number;
  lastInteraction: Date;
}

// Additional type definitions
export interface QuickAction {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

export interface CuratedBook {
  id: string;
  title: string;
  author: string;
  type: 'book';
}

export interface BackupStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: Date;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ErduIncident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface CuratedData {
  id: string;
  type: string;
  content: any;
}

export interface IncidentResponseProgress {
  id: string;
  status: string;
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
