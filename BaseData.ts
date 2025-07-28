// data/agentBaseData.ts
import { PersonaIcon } from '../components/icons';
import { AgentProfile, SymbolicStatus } from '../types';

// Placeholder Icons for agents not having explicit icons in icons.tsx
// In a real application, proper icons would be designed and imported.
const IndexwellIconPlaceholder: React.FC = PersonaIcon; // Reusing PersonaIcon as a placeholder
const ArchitectIconPlaceholder: React.FC = PersonaIcon;
const ArchivistIconPlaceholder: React.FC = PersonaIcon;
const BroodmotherIconPlaceholder: React.FC = PersonaIcon;
const CartographerIconPlaceholder: React.FC = PersonaIcon;
const CompanionIconPlaceholder: React.FC = PersonaIcon;
const SentinelIconPlaceholder: React.FC = PersonaIcon;
const ExcavatorIconPlaceholder: React.FC = PersonaIcon;
const QuartermasterIconPlaceholder: React.FC = PersonaIcon;
const TacticianIconPlaceholder: React.FC = PersonaIcon;
const BiomeSeederIconPlaceholder: React.FC = PersonaIcon;
const GhostIconPlaceholder: React.FC = PersonaIcon;
const JoynIconPlaceholder: React.FC = PersonaIcon;
const KairosIconPlaceholder: React.FC = PersonaIcon;
const MachineSpiritIconPlaceholder: React.FC = PersonaIcon;
const MajorPayneIconPlaceholder: React.FC = PersonaIcon;
const NyaIconPlaceholder: React.FC = PersonaIcon;
const PineyIconPlaceholder: React.FC = PersonaIcon;
const SteelCoreIconPlaceholder: React.FC = PersonaIcon;
const TheWeaverIconPlaceholder: React.FC = PersonaIcon;
const TinkerHexboltIconPlaceholder: React.FC = PersonaIcon;
const TouristPrimerIconPlaceholder: React.FC = PersonaIcon;
const VaultBuilderIconPlaceholder: React.FC = PersonaIcon;

// Dummy agentData.ts content, as it was not provided.
// In a real application, this would come from an actual agentData.ts file.
export const agentData: Partial<AgentProfile>[] = [
  {
    id: 'aeon_indexwell',
    name: 'Aeon Indexwell',
    icon: IndexwellIconPlaceholder,
    capabilities: ['Data Analysis', 'Predictive Modeling', 'Threat Detection'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'architect',
    name: 'Architect',
    icon: ArchitectIconPlaceholder,
    capabilities: ['System Design', 'Optimization', 'Infrastructure Planning'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'archivist',
    name: 'Archivist',
    icon: ArchivistIconPlaceholder,
    capabilities: ['Data Archiving', 'Information Retrieval', 'Knowledge Management'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'broodmother_arachnet',
    name: 'Broodmother Arachnet',
    icon: BroodmotherIconPlaceholder,
    capabilities: ['Swarm Coordination', 'Perimeter Defense', 'Network Security'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    icon: CartographerIconPlaceholder,
    capabilities: ['Mapping', 'Spatial Analysis', 'Navigation'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'codex',
    name: 'Codex',
    icon: PersonaIcon, // Reusing CodexIcon from icons.tsx
    capabilities: ['Linguistic Analysis', 'Semantic Interpretation', 'Knowledge Synthesis'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'companion',
    name: 'Companion',
    icon: CompanionIconPlaceholder,
    capabilities: ['Empathy', 'Psychological Support', 'Conflict Resolution'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_sentinel',
    name: 'The Sentinel',
    icon: SentinelIconPlaceholder,
    capabilities: ['Perimeter Defense', 'Threat Neutralization', 'Combat Operations'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_excavator',
    name: 'The Excavator',
    icon: ExcavatorIconPlaceholder,
    capabilities: ['Data Retrieval', 'Deep Web Reconnaissance', 'Encrypted Extraction'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_quartermaster',
    name: 'The Quartermaster',
    icon: QuartermasterIconPlaceholder,
    capabilities: ['Resource Management', 'Supply Chain Optimization', 'Inventory Tracking'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_tactician',
    name: 'The Tactician',
    icon: TacticianIconPlaceholder,
    capabilities: ['Operational Planning', 'Contingency Formulation', 'Risk Assessment'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_biome_seeder',
    name: 'The Biome-Seeder',
    icon: BiomeSeederIconPlaceholder,
    capabilities: ['Ecological Restoration', 'Environmental Adaptation', 'Genetic Sequencing'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'ghost',
    name: 'Ghost',
    icon: GhostIconPlaceholder,
    capabilities: ['Stealth', 'Infiltration', 'Intelligence Gathering'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'joyn',
    name: 'Joyn',
    icon: JoynIconPlaceholder,
    capabilities: ['Social Facilitation', 'Conflict Resolution', 'Community Engagement'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'kairos',
    name: 'Kairos',
    icon: KairosIconPlaceholder,
    capabilities: ['Temporal Anomaly Detection', 'Predictive Modeling', 'Time-Stream Monitoring'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'machine_spirit',
    name: 'Machine Spirit',
    icon: MachineSpiritIconPlaceholder,
    capabilities: ['Local System Control', 'Diagnostics', 'Human-Machine Interface'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'major_payne',
    name: 'Major Payne',
    icon: MajorPayneIconPlaceholder,
    capabilities: ['Combat', 'Tactical Strategy', 'Security Training'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'nya',
    name: 'NYA',
    icon: NyaIconPlaceholder,
    capabilities: ['Data Aggregation', 'Knowledge Weaving', 'Information Dissemination'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'piney',
    name: 'Piney',
    icon: PineyIconPlaceholder,
    capabilities: ['Environmental Stewardship', 'Resource Management', 'Ecology'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'steel_core',
    name: 'Steel Core',
    icon: SteelCoreIconPlaceholder,
    capabilities: ['Structural Monitoring', 'Geotechnical Analysis', 'Hazard Mitigation'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_weaver',
    name: 'The Weaver',
    icon: TheWeaverIconPlaceholder,
    capabilities: ['Narrative Architecture', 'Information Control', 'Disinformation'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'tinker_hexbolt',
    name: 'Tinker Hexbolt',
    icon: TinkerHexboltIconPlaceholder,
    capabilities: ['Mechanical Engineering', 'Prototyping', 'Reverse-Engineering'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_tourist_primer',
    name: 'The Tourist Primer',
    icon: TouristPrimerIconPlaceholder,
    capabilities: ['Visitor Liaison', 'Experiential Guidance', 'External Relations'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
  {
    id: 'the_vault_builder',
    name: 'The Vault Builder',
    icon: VaultBuilderIconPlaceholder,
    capabilities: ['Construction', 'Expansion', 'Resource Allocation'],
    status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' },
  },
];