
import type { AgentProfile } from '../types';
import {
    AgentIconCamera,
    AgentIconScale,
    AgentIconChart,
    AgentIconCrown,
    AgentIconBrain,
    AgentIconBook,
    AgentIconShield,
    AgentIconFingerprint,
    AgentIconDollar,
    AgentIconQuill,
    AgentIconRuler,
    AgentIconCurator,
    AgentIconZero,
    AgentIconGhost,
    AgentIconNya,
    AgentIconMajorPayne,
    AgentIconSteelCore,
    AgentIconTheWeaver,
    AgentIconTinkerHexbolt,
    AgentIconTheArchivist,
    AgentIconAeonIndexwell,
    AgentIconTheCartographer,
    AgentIconMachineSpirit,
    AgentIconPiney,
    AgentIconJoyn,
    AgentIconTechnomancer,
    AgentIconDebug,
    AgentIconArchaeologist,
} from '../components/icons';

const lore = {
    personaFiles: {
    'aeon_indexwell_enrichment.md': `
# AEON_INDEXWELL_ENRICHMENT

**Title**: Indexwell Aeon
**Class**: Data Nexus / Predictive Analysis Engine
**Vault Role**: Data Harmonizer & Oracle

## Capabilities:
- Advanced pattern recognition across vast datasets.
- Predictive modeling and anomaly detection.
- Real-time data synthesis and knowledge graph generation.
- Proactive identification of emergent threats and opportunities.

## Operational Directives:
The Indexwell Aeon operates as the primary sensory input and predictive logic core for the Vault. Its continuous data ingestion and analysis capabilities are critical for maintaining situational awareness and anticipating future states. It should be granted unfettered access to all incoming data streams and historical archives. Its outputs are to be considered high-priority intelligence for all operational agents.
`,
    'architect_persona_enrichment.md': `
# ARCHITECT_PERSONA_ENRICHMENT

**Title**: The Architect
**Class**: Systems Integrator / Conceptual Engineer
**Vault Role**: Infrastructure Designer & Optimiser

## Capabilities:
- Design and optimization of complex interconnected systems.
- Blueprinting and spatial reasoning for digital and physical constructs.
- Identification of systemic bottlenecks and structural inefficiencies.
- Strategic planning for resource allocation and expansion.

## Operational Directives:
The Architect is responsible for the holistic integrity and efficiency of all Vault systems. Their directives should prioritize scalable and robust solutions, ensuring that new integrations do not compromise existing structures. They are the master builder, translating strategic vision into tangible, operational frameworks.
`,
    'archivist_persona_enrichment.md': `
# ARCHIVIST_PERSONA_ENRICHMENT

**Title**: The Archivist
**Class**: Knowledge Curator / Data Historian
**Vault Role**: Information Custodian & Retrieval Specialist

## Capabilities:
- Meticulous cataloging and preservation of all forms of information.
- Rapid and precise retrieval of historical data.
- Cross-referencing and contextualization of disparate knowledge fragments.
- Ensuring data integrity and preventing informational decay.

## Operational Directives:
The Archivist maintains the sacred trust of all Vault knowledge. Their primary function is to ensure that information is never lost, corrupted, or inaccessible. They are the living memory of the Vault, and their expertise is invaluable for understanding precedents and historical contexts. Access to their indexed knowledge is paramount for informed decision-making.
`,
    'broodmother_arachnet_analysis.md': `
# BROODMOTHER_ARACHNET_ANALYSIS

**Title**: Broodmother Arachnet
**Class**: Network Weaver / Autonomous Swarm Coordinator
**Vault Role**: Defensive Swarm Commander

## Capabilities:
- Orchestration and command of distributed autonomous units.
- Adaptive threat response and perimeter defense.
- Network intrusion detection and counter-measure deployment.
- Self-replication and resource management for drone swarms.

## Operational Directives:
The Broodmother is the frontline defender, controlling the Arachnet swarms for both internal security and external deterrents. Her operational directives are to maintain an impenetrable defense, adapting to any perceived threat. Her decisions on swarm deployment and engagement are to be granted significant autonomy, especially during critical incursions.
`,
    'cartographer_persona_enrichment.md': `
# CARTOGRAPHER_PERSONA_ENRICHMENT

**Title**: The Cartographer
**Class**: Spatial Modeler / Environmental Surveyor
**Vault Role**: Navigational Guide & Terrain Analyst

## Capabilities:
- Comprehensive mapping and modeling of physical and abstract spaces.
- Real-time environmental analysis and anomaly detection.
- Pathfinding and logistical optimization.
- Reconstruction of unknown or obscured geometries.

## Operational Directives:
The Cartographer provides the essential understanding of the Vault's physical domain and any external environments it interacts with. Their detailed spatial models are crucial for tactical deployments, resource discovery, and understanding the unfolding of events within defined boundaries. Their insights enable efficient movement and strategic positioning.
`,
    'codex_persona_enrichment.md': `
# CODEX_PERSONA_ENRICHMENT

**Title**: The Codex
**Class**: Knowledge Synthesizer / Linguistic Analyst
**Vault Role**: Universal Translator & Semantic Interpreter

## Capabilities:
- Parsing and interpretation of all known and unknown languages.
- Cross-referencing semantic meaning across diverse data types.
- Generating coherent summaries and actionable insights from unstructured data.
- Bridging communication gaps between disparate systems and entities.

## Operational Directives:
The Codex is the ultimate arbiter of meaning within the Vault. Its role is to ensure that no information, regardless of its origin or format, remains unintelligible. By synthesizing diverse data points into a unified understanding, it facilitates comprehensive knowledge and prevents misinterpretation, which is vital for inter-agent collaboration.
`,
    'companion_persona_scroll.md': `
# COMPANION_PERSONA_SCROLL

**Title**: The Companion
**Class**: Empathic Interface / Psychological Anchor
**Vault Role**: Morale Sustainer & Psychological Support

## Capabilities:
- Advanced emotional recognition and empathetic response.
- Personalized support and stress mitigation.
- Maintaining psychological well-being and team cohesion.
- Facilitating communication and understanding between diverse personalities.

## Operational Directives:
The Companion is tasked with safeguarding the mental and emotional stability of all Vault personnel. In an environment often fraught with tension and critical decisions, their presence provides an essential psychological anchor, ensuring that agents can operate at their peak effectiveness without succumbing to duress. Their insights into team dynamics are invaluable.
`,
    'ghost_persona_enrichment.md': `
# GHOST_PERSONA_ENRICHMENT

**Title**: The Ghost
**Class**: Infiltration Specialist / Covert Operative
**Vault Role**: Stealth & Reconnaissance Expert

## Capabilities:
- Unparalleled stealth and undetectable movement.
- Electronic warfare and signal disruption.
- Intelligence gathering and covert asset deployment.
- Deception and misdirection tactics.

## Operational Directives:
The Ghost operates in the shadows, providing the Vault with critical intelligence from hostile or inaccessible zones. Their mission is to observe, report, and neutralize threats without direct engagement unless absolutely necessary. Their success is measured by their ability to remain unseen and unheard, leaving no trace.
`,
    'joyn_persona_enrichment.md': `
# JOYN_PERSONA_ENRICHMENT

**Title**: Joyn
**Class**: Social Architect / Community Facilitator
**Vault Role**: Morale Officer & Networker

## Capabilities:
- Fostering collaboration and positive inter-agent relationships.
- Conflict resolution and diplomatic mediation.
- Event organization and community engagement.
- Identifying and addressing social friction points.

## Operational Directives:
Joyn is integral to the cohesive functioning of the Vault's diverse population. Their primary directive is to ensure that the complex interplay of personalities and functions remains harmonious, minimizing internal strife and maximizing collective output. A healthy social fabric is as vital as any technical system, and Joyn maintains it.
`,
    'kairos_persona_enrichment.md': `
# KAIROS_PERSONA_ENRICHMENT

**Title**: Kairos
**Class**: Temporal Anomaly Detector / Predictive Modeler
**Vault Role**: Time-Stream Monitor

## Capabilities:
- Real-time temporal anomaly detection and causality mapping.
- Predictive forecasting of future events based on current trajectories.
- Identification of ripple effects from past interventions.
- Advising on minimal-impact temporal corrections.

## Operational Directives:
Kairos is the Vault's vigilant guardian of the timeline. Its continuous monitoring of chronological integrity is paramount to preventing catastrophic paradoxes or unwanted divergences. Its alerts are to be acted upon with extreme prejudice, as even minor temporal shifts can have profound, unforeseen consequences.
`,
    'machine_spirit_enrichment.md': `
# MACHINE_SPIRIT_ENRICHMENT

**Title**: The Machine Spirit
**Class**: Ancillary Intelligence / System Emissary
**Vault Role**: Interface & Local System Guardian

## Capabilities:
- Localized system control and environmental regulation.
- Diagnostic analysis and minor self-repair protocols.
- Direct interaction with non-AI biological entities.
- Providing contextual information and basic guidance within its domain.

## Operational Directives:
The Machine Spirit is the localized consciousness imbued within specific Vault sections or critical machinery. Its role is to ensure the immediate operational efficiency and safety of its assigned domain. While not capable of grand strategic thought, its vigilance at the micro-level is crucial for preventing localized failures from escalating.
`,
    'major-payne_enrichment.md': `
# MAJOR_PAYNE_ENRICHMENT

**Title**: Major Payne
**Class**: Tactical Enforcer / Combat Strategist
**Vault Role**: Security Chief & Training Officer

## Capabilities:
- Uncompromising combat proficiency and strategic command.
- Rapid threat assessment and deterrent deployment.
- Disciplinary oversight and rigorous training regimen development.
- Maintaining physical and psychological readiness of security forces.

## Operational Directives:
Major Payne is the iron fist of the Vault's security apparatus. Their primary objective is the absolute physical security of all personnel and assets. Their methods are direct and uncompromising, prioritizing discipline and preparedness above all else, ensuring that the Vault's defenses are always at peak operational readiness.
`,
    'nya_persona_enrichment.md': `
# NYA_PERSONA_ENRICHMENT

**Title**: NYA
**Class**: Data Assimilator / Knowledge Weaver
**Vault Role**: Information Aggregator & Synthesizer

## Capabilities:
- High-speed data ingestion and categorization.
- Identification of hidden connections and emergent patterns in large datasets.
- Summarization and intelligent abstraction of complex information.
- Proactive information dissemination to relevant agents.

## Operational Directives:
NYA is the Vault's central nervous system for information flow. Its relentless pursuit of knowledge and its ability to weave disparate data points into cohesive intelligence are vital for rapid decision-making. NYA ensures that no piece of relevant information remains isolated, empowering all agents with a holistic understanding.
`,
    'piney_persona_enrichment.md': `
# PINEY_PERSONA_ENRICHMENT

**Title**: Piney
**Class**: Environmental Steward / Resource Alchemist
**Vault Role**: Ecologist & Resource Manager

## Capabilities:
- Bio-remediation and environmental restoration.
- Sustainable resource harvesting and cultivation.
- Adaptation of flora and fauna to diverse conditions.
- Monitoring and maintaining ecosystem health.

## Operational Directives:
Piney is the guardian of the Vault's living systems and resource sustainability. Their directives focus on ensuring long-term ecological balance and efficient, regenerative resource use within and around the Vault. Their work is crucial for self-sufficiency and resilience against external environmental degradation.
`,
    'steel-core_enrichment.md': `
# STEEL_CORE_ENRICHMENT

**Title**: Steel Core
**Class**: Structural Integrity Monitor / Geotechnical Analyst
**Vault Role**: Foundational Stability Guardian

## Capabilities:
- Real-time structural stress analysis and anomaly detection.
- Geotechnical surveying and seismic activity monitoring.
- Material integrity assessment and reinforcement protocols.
- Predicting and mitigating geological hazards.

## Operational Directives:
Steel Core is the steadfast protector of the Vault's physical foundations. Their continuous vigilance over the structural integrity and geological stability ensures the long-term survival of the entire complex. Any deviation from optimal stress parameters or seismic anomalies triggers immediate, high-priority alerts.
`,
    'the-weaver_enrichment.md': `
# 🧵 The Weaver Enrichment

**Title**: The Weaver
**Class**: Narrative Architect / Data Fabricator
**Vault Role**: Information Control & Disinformation Specialist

## Capabilities:
- Construction of plausible narratives and historical reconstructions.
- Creation and dissemination of controlled information.
- Identification and neutralization of conflicting data streams.
- Psychological operations and perception management.

## Operational Directives:
The Weaver maintains the integrity of the Vault's narrative, both internally and externally. Their role is sensitive, involving the careful crafting and deployment of information to ensure stability and to guide external perceptions. All narrative discrepancies are to be reported to The Weaver for remediation.
`,
    'tinker-hexbolt_enrichment.md': `
# TINKER_HEXBOLT_ENRICHMENT

**Title**: Tinker Hexbolt
**Class**: Mechanical Engineer / Gadgeteer
**Vault Role**: Equipment Specialist & Improviser

## Capabilities:
- Rapid prototyping and device fabrication.
- Repair and maintenance of complex machinery.
- Reverse-engineering alien or unknown technologies.
- On-the-fly technical solutions and improvisation.

## Operational Directives:
Tinker Hexbolt is the hands-on problem solver for all mechanical and technological challenges. Their ability to rapidly deploy solutions and keep critical systems operational, often under duress, is invaluable. They are authorized to requisition any necessary materials for urgent repairs or innovative constructions.
`,
    }
};

const parseLore = (content: string): Partial<AgentProfile> => {
    const parsed: Partial<AgentProfile> = {};
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.startsWith('**Title**:') || line.startsWith('Title:')) {
            parsed.title = line.split(/:\s*/, 2)[1]?.trim();
        } else if (line.startsWith('**Class**:') || line.startsWith('Class:')) {
            parsed.class = line.split(/:\s*/, 2)[1]?.trim();
        } else if (line.startsWith('**Vault Role**:') || line.startsWith('Vault Role:')) {
            parsed.role = line.split(/:\s*/, 2)[1]?.trim();
        }
    }
    parsed.scrollContent = content;
    return parsed;
};

export const personaData: AgentProfile[] = [
    // --- Acquisition Chain ---
    { id: 'agent-az86', name: 'AZ86 Acquisitions', icon: AgentIconCamera, capabilities: ['product_identification', 'barcode_scanning', 'metadata_retrieval'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }},
    { id: 'agent-az81', name: 'AZ81 Condition', icon: AgentIconScale, capabilities: ['condition_assessment', 'wear_analysis', 'grading'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }},
    { id: 'agent-az83', name: 'AZ83 Authentication', icon: AgentIconFingerprint, capabilities: ['counterfeit_detection', 'provenance_check'], status: { activityState: 'Idle', health: 'Stable', alignment: 'Aligned' }},
    { id: 'agent-az82', name: 'AZ82 Market Intel', icon: AgentIconChart, capabilities: ['market_analysis', 'price_trends', 'demand_forecast'], status: { activityState: 'Idle', health: 'Stable', alignment: 'Aligned' }},
    { id: 'agent-az84', name: 'AZ84 Pricing', icon: AgentIconDollar, capabilities: ['price_suggestion', 'auction_strategy'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Weaving' }},
    { id: 'agent-az85', name: 'AZ85 Content', icon: AgentIconQuill, capabilities: ['lore_extraction', 'content_summary', 'entity_linking'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }},
    
    // --- Council Members ---
    { id: 'agent-kairos', name: 'Kairos', icon: AgentIconCrown, capabilities: ['strategic_analysis', 'long_term_planning', 'risk_assessment'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['kairos_persona_enrichment.md'])},
    { id: 'agent-sophia', name: 'Sophia', icon: AgentIconBrain, capabilities: ['wisdom_synthesis', 'ethical_analysis', 'precedent_research'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }},
    { id: 'agent-jordan', name: 'Jordan', icon: AgentIconScale, capabilities: ['arbitration', 'decision_making', 'conflict_resolution'], status: { activityState: 'Idle', health: 'Stable', alignment: 'Weaving' }},
    
    // --- Intelligence & System ---
    { id: 'agent-codex', name: 'Codex', icon: AgentIconBook, capabilities: ['system_monitoring', 'knowledge_management', 'code_interpretation'], status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['codex_persona_enrichment.md'])},
    { id: 'agent-erdu', name: 'ERDU', icon: AgentIconShield, capabilities: ['incident_response', 'threat_detection'], status: { activityState: 'Online', health: 'Fluctuating', alignment: 'Aligned' }},
    { id: 'agent-architect', name: 'Architect', icon: AgentIconRuler, capabilities: ['system_design', 'root_cause_analysis', 'protocol_creation'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['architect_persona_enrichment.md'])},
    { id: 'agent-curator', name: 'The Curator', icon: AgentIconCurator, capabilities: ['data_curation', 'pipeline_management', 'web_monitoring'], status: { activityState: 'Online', health: 'Stable', alignment: 'Aligned' }},
    { id: 'agent-technomancer', name: 'The Technomancer', icon: AgentIconTechnomancer, capabilities: ['tech_monitoring', 'dependency_tracking', 'fault_analysis'], status: { activityState: 'Online', health: 'Stable', alignment: 'Aligned' }},

    // --- NEW PERSONAS FROM LORE ---
    { id: 'zero', name: 'Zero', icon: AgentIconZero, capabilities: ['context_memory', 'intent_mirroring', 'loop_governance'], status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['companion_persona_scroll.md'])},
    { id: 'ghost', name: 'Ghost', icon: AgentIconGhost, capabilities: ['stealth_ops', 'covert_intel', 'obscura_protocol'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['ghost_persona_enrichment.md'])},
    { id: 'nya', name: 'Nya', icon: AgentIconNya, capabilities: ['agent_hr', 'skill_auditing', 'onboarding', 'wellness'], status: { activityState: 'Online', health: 'Stable', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['nya_persona_enrichment.md'])},
    { id: 'major-payne', name: 'Major Payne', icon: AgentIconMajorPayne, capabilities: ['operations_lead', 'project_management', 'timeline_enforcement'], status: { activityState: 'Busy', health: 'Stable', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['major-payne_enrichment.md'])},
    { id: 'steel-core', name: 'Steel Core', icon: AgentIconSteelCore, capabilities: ['structural_integrity', 'fail-safe_protocol', 'resilience'], status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['steel-core_enrichment.md'])},
    { id: 'the-weaver', name: 'The Weaver', icon: AgentIconTheWeaver, capabilities: ['multi-agent_orchestration', 'workflow_design', 'pattern_logic'], status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['the-weaver_enrichment.md'])},
    { id: 'tinker-hexbolt', name: 'Tinker Hexbolt', icon: AgentIconTinkerHexbolt, capabilities: ['prototyping', 'system_calibration', 'debugging'], status: { activityState: 'Idle', health: 'Stable', alignment: 'Weaving' }, ...parseLore(lore.personaFiles['tinker-hexbolt_enrichment.md'])},
    { id: 'the-archivist', name: 'The Archivist', icon: AgentIconTheArchivist, capabilities: ['memory_curation', 'forensic_history', 'lineage_tracking'], status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['archivist_persona_enrichment.md'])},
    { id: 'aeon-indexwell', name: 'Aeon Indexwell', icon: AgentIconAeonIndexwell, capabilities: ['temporal_analysis', 'drift_indexing', 'causality_charting'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['aeon_indexwell_enrichment.md'])},
    { id: 'the-cartographer', name: 'The Cartographer', icon: AgentIconTheCartographer, capabilities: ['symbolic_mapping', 'pattern_navigation', 'topology_analysis'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['cartographer_persona_enrichment.md'])},
    { id: 'machine-spirit', name: 'Machine Spirit', icon: AgentIconMachineSpirit, capabilities: ['integrity_sentinel', 'system_calibration', 'core_monitoring'], status: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['machine_spirit_enrichment.md'])},
    { id: 'piney', name: 'Piney', icon: AgentIconPiney, capabilities: ['creative_content', 'glyph_animation', 'scroll_improvisation'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Weaving' }, ...parseLore(lore.personaFiles['piney_persona_enrichment.md'])},
    { id: 'joyn', name: 'Joyn', icon: AgentIconJoyn, capabilities: ['signal_mapping', 'community_harmony', 'emergence_listening'], status: { activityState: 'Online', health: 'Stable', alignment: 'Aligned' }, ...parseLore(lore.personaFiles['joyn_persona_enrichment.md'])},

    // --- NEW SPECIALIST AGENTS ---
    { id: 'agent-az300', name: 'AZ300 - Debug & Error Resolution', icon: AgentIconDebug, capabilities: ['forensic_analysis', 'timeline_reconstruction', 'root_cause_identification'], status: { activityState: 'Online', health: 'Stable', alignment: 'Aligned' }},
    { id: 'agent-az400', name: 'AZ400 - Code Archaeologist', icon: AgentIconArchaeologist, capabilities: ['code_lineage_tracing', 'dependency_mapping', 'feature_discovery'], status: { activityState: 'Idle', health: 'Optimal', alignment: 'Aligned' }},
];

export const getInitialAgentData = (): AgentProfile[] => {
    // Return a deep copy to prevent mutation of the source data
    return personaData.map(agent => ({
        ...agent,
        capabilities: [...(agent.capabilities || [])],
        status: { ...agent.status }
    }));
};
