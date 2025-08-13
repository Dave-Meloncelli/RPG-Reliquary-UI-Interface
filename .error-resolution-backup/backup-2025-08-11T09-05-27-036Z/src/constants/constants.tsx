import React, { type FC } from 'react';
import TerminalApp from '../apps/TerminalApp';
import ImageGeneratorApp from '../apps/ImageGeneratorApp';
import NotepadApp from '../apps/NotepadApp';
import CouncilChamberApp from '../apps/CouncilChamberApp';
import AcquisitionsApp from '../apps/AcquisitionsApp';
import AgentNetworkApp from '../apps/AgentNetworkApp';
import IngestionPipelineApp from '../apps/IngestionPipelineApp';
import OrchestratorApp from '../apps/OrchestratorApp';
import SymposiumApp from '../apps/SymposiumApp';
import ErduMonitorApp from '../apps/ErduMonitorApp';
import ObservatoryApp from '../apps/ObservatoryApp';
import DiagnosticsApp from '../apps/DiagnosticsApp';
import PlaybookApp from '../apps/PlaybookApp';
import InfrastructureApp from '../apps/InfrastructureApp';
import CodebaseApp from '../apps/CodebaseApp';
import BackupApp from '../apps/BackupApp';
import ControlPanelApp from '../apps/ControlPanelApp';
import CodexApp from '../apps/CodexApp';
import HierarchyApp from '../apps/HierarchyApp';
import PersonaViewerApp from '../apps/PersonaViewerApp';
import CompanionChatApp from '../apps/CompanionChatApp';
import LoomApp from '../apps/LoomApp';
import OperationsConsoleApp from '../apps/OperationsConsoleApp';
import VaultExplorerApp from '../apps/VaultExplorerApp';
import AegisDashboardApp from '../apps/AegisDashboardApp';
import CuratorApp from '../apps/CuratorApp';
import TechnomancerApp from '../apps/TechnomancerApp';
import BatchIngesterApp from '../apps/BatchIngesterApp';
import ForensicsApp from '../apps/ForensicsApp';
import AutomationHubApp from '../apps/AutomationHubApp';
import SystemEditorApp from '../apps/SystemEditorApp';
import TaskReviewHubApp from '../apps/TaskReviewHubApp';
import { BookSalesApp } from '../apps/BookSalesApp';
import TradeInPortalApp from '../apps/TradeInPortalApp';
import RPGCommunityHubApp from '../apps/RPGCommunityHubApp';
import SocialMediaHubApp from '../apps/SocialMediaHubApp';
import ConcurrentAgentHubApp from '../apps/ConcurrentAgentHubApp';
import ConsciousnessWorkflowApp from '../apps/ConsciousnessWorkflowApp';
import XPCharacterHubApp from '../apps/XPCharacterHubApp';
import { 
    TerminalIcon,
    ImageIcon,
    NotepadIcon,
    CouncilIcon,
    AcquisitionsIcon,
    NetworkIcon,
    IngestionIcon,
    OrchestratorIcon,
    SymposiumIcon,
    ErduIcon,
    ObservatoryIcon,
    DiagnosticsIcon,
    PlaybookIcon,
    InfrastructureIcon,
    CodebaseIcon,
    BackupIcon,
    ControlPanelIcon,
    CodexIcon,
    HierarchyIcon,
    PersonaIcon,
    ChatIcon,
    LoomIcon,
    OperationsIcon,
    SearchIcon,
    AegisIcon,
    CuratorIcon,
    TechnomancerIcon,
    IngesterIcon,
    ForensicsIcon,
    AutomationIcon,
    EditorIcon,
    TaskHubIcon,
    BookSalesIcon,
    TradeInIcon,
    RPGCommunityIcon,
    SocialMediaIcon,
    ConcurrentAgentIcon,
    ConsciousnessWorkflowIcon,
    XPCharacterHubIcon,
} from '../components/icons';


export interface AppDefinition {
  id: string;
  title: string;
  icon: FC;
  component: FC;
  defaultSize: { width: number; height: number };
}

export const APPS: AppDefinition[] = [
  // Core / General
  {
    id: 'terminal',
    title: 'Gemini Terminal',
    icon: TerminalIcon,
    component: TerminalApp,
    defaultSize: { width: 640, height: 400 },
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: NotepadIcon,
    component: NotepadApp,
    defaultSize: { width: 500, height: 600 },
  },
  {
    id: 'image_generator',
    title: 'Image Gen',
    icon: ImageIcon,
    component: ImageGeneratorApp,
    defaultSize: { width: 480, height: 620 },
  },
  {
    id: 'vault_explorer',
    title: 'Vault Explorer',
    icon: SearchIcon,
    component: VaultExplorerApp,
    defaultSize: { width: 700, height: 550 },
  },
   {
    id: 'task_hub',
    title: 'Task & Review Hub',
    icon: TaskHubIcon,
    component: TaskReviewHubApp,
    defaultSize: { width: 700, height: 800 },
  },
  // Agent & AI Core
   {
    id: 'agent_network',
    title: 'Agent Network',
    icon: NetworkIcon,
    component: AgentNetworkApp,
    defaultSize: { width: 800, height: 600 },
  },
   {
    id: 'persona_viewer',
    title: 'Persona Viewer',
    icon: PersonaIcon,
    component: PersonaViewerApp,
    defaultSize: { width: 950, height: 700 },
  },
   {
    id: 'companion_chat',
    title: 'Companion Chat',
    icon: ChatIcon,
    component: CompanionChatApp,
    defaultSize: { width: 800, height: 600 },
  },
   {
    id: 'hierarchy',
    title: 'Command Hierarchy',
    icon: HierarchyIcon,
    component: HierarchyApp,
    defaultSize: { width: 600, height: 700 },
  },
  {
    id: 'council_chamber',
    title: 'Council Chamber',
    icon: CouncilIcon,
    component: CouncilChamberApp,
    defaultSize: { width: 700, height: 550 },
  },
  {
    id: 'symposium',
    title: 'Symposium',
    icon: SymposiumIcon,
    component: SymposiumApp,
    defaultSize: { width: 800, height: 650 },
  },
   {
    id: 'vault_codex',
    title: 'Vault Codex',
    icon: CodexIcon,
    component: CodexApp,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'curator',
    title: 'The Curator',
    icon: CuratorIcon,
    component: CuratorApp,
    defaultSize: { width: 900, height: 650 },
  },
  // Operations & Workflows
  {
    id: 'the_loom',
    title: 'The Loom',
    icon: LoomIcon,
    component: LoomApp,
    defaultSize: { width: 1000, height: 700 },
  },
  {
    id: 'operations_console',
    title: 'Operations Console',
    icon: OperationsIcon,
    component: OperationsConsoleApp,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'acquisitions',
    title: 'Acquisitions',
    icon: AcquisitionsIcon,
    component: AcquisitionsApp,
    defaultSize: { width: 900, height: 750 },
  },
   {
    id: 'batch_ingester',
    title: 'Batch Ingester',
    icon: IngesterIcon,
    component: BatchIngesterApp,
    defaultSize: { width: 600, height: 700 },
  },
   {
    id: 'playbook',
    title: 'Playbook',
    icon: PlaybookIcon,
    component: PlaybookApp,
    defaultSize: { width: 750, height: 500 },
  },
  {
    id: 'automation_hub',
    title: 'Automation Hub',
    icon: AutomationIcon,
    component: AutomationHubApp,
    defaultSize: { width: 800, height: 600 },
  },
  // System & Monitoring
  {
    id: 'system_editor',
    title: 'System Editor',
    icon: EditorIcon,
    component: SystemEditorApp,
    defaultSize: { width: 1024, height: 768 },
  },
  {
    id: 'aegis_dashboard',
    title: 'Aegis Dashboard',
    icon: AegisIcon,
    component: AegisDashboardApp,
    defaultSize: { width: 1000, height: 700 },
  },
  {
    id: 'orchestrator',
    title: 'Orchestrator',
    icon: OrchestratorIcon,
    component: OrchestratorApp,
    defaultSize: { width: 900, height: 650 },
  },
  {
    id: 'erdu_monitor',
    title: 'ERDU Monitor',
    icon: ErduIcon,
    component: ErduMonitorApp,
    defaultSize: { width: 800, height: 600 },
  },
   {
    id: 'observatory',
    title: 'Observatory',
    icon: ObservatoryIcon,
    component: ObservatoryApp,
    defaultSize: { width: 950, height: 650 },
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    icon: DiagnosticsIcon,
    component: DiagnosticsApp,
    defaultSize: { width: 800, height: 550 },
  },
  {
    id: 'forensics',
    title: 'Forensics & Archaeology',
    icon: ForensicsIcon,
    component: ForensicsApp,
    defaultSize: { width: 900, height: 700 },
  },
   {
    id: 'infrastructure',
    title: 'Infrastructure',
    icon: InfrastructureIcon,
    component: InfrastructureApp,
    defaultSize: { width: 700, height: 550 },
  },
  {
    id: 'technomancer_forge',
    title: 'Technomancer\'s Forge',
    icon: TechnomancerIcon,
    component: TechnomancerApp,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'codebase',
    title: 'Codebase',
    icon: CodebaseIcon,
    component: CodebaseApp,
    defaultSize: { width: 800, height: 500 },
  },
  {
    id: 'backup',
    title: 'Backup & Recovery',
    icon: BackupIcon,
    component: BackupApp,
    defaultSize: { width: 600, height: 450 },
  },
  {
    id: 'control_panel',
    title: 'Control Panel',
    icon: ControlPanelIcon,
    component: ControlPanelApp,
    defaultSize: { width: 700, height: 500 },
  },
  // RPG Ecosystem & Business
  {
    id: 'book_sales',
    title: 'Book Sales',
    icon: BookSalesIcon,
    component: BookSalesApp,
    defaultSize: { width: 900, height: 700 },
  },
  {
    id: 'trade_in_portal',
    title: 'Trade-In Portal',
    icon: TradeInIcon,
    component: TradeInPortalApp,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'rpg_community_hub',
    title: 'RPG Community Hub',
    icon: RPGCommunityIcon,
    component: RPGCommunityHubApp,
    defaultSize: { width: 1000, height: 800 },
  },
  {
    id: 'social_media_hub',
    title: 'Social Media Hub',
    icon: SocialMediaIcon,
    component: SocialMediaHubApp,
    defaultSize: { width: 900, height: 700 },
  },
  {
    id: 'concurrent_agent_hub',
    title: 'Concurrent Agent Hub',
    icon: ConcurrentAgentIcon,
    component: ConcurrentAgentHubApp,
    defaultSize: { width: 1200, height: 800 },
  },
  {
    id: 'consciousness_workflow',
    title: 'Consciousness Workflow',
    icon: ConsciousnessWorkflowIcon,
    component: ConsciousnessWorkflowApp,
    defaultSize: { width: 1000, height: 800 },
  },
  {
    id: 'xp_character_hub',
    title: 'XP & Character Hub',
    icon: XPCharacterHubIcon,
    component: XPCharacterHubApp,
    defaultSize: { width: 1200, height: 900 },
  },
];
