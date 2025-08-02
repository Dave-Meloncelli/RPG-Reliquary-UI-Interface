// data/personaLoreData.ts
// This file contains the hardcoded markdown content for persona lore.
// In a real application, this data would ideally be fetched from a backend
// or loaded from individual markdown files via a build process.

export const personaFiles: { [key: string]: string } = {
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
    'companion_persona_scroll (3).md': `
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
    'consolidated Addendum document that.txt': `
**Addendum - Specialized Agent Functions**

**Agent ID: VAULT-GUARDIAN-7**
**Designation: The Sentinel**
**Primary Function:** Perimeter Defense, Threat Neutralization
**Key Protocols:** Autonomous engagement protocols, tactical deployment of defensive matrices, direct combat operations. Equipped with advanced counter-intrusion systems and adaptive camouflage.

**Agent ID: DATA-MINER-12**
**Designation: The Excavator**
**Primary Function:** Data Retrieval, Deep Web Reconnaissance
**Key Protocols:** Undetectable ingress into hostile networks, encrypted data extraction, pattern-of-life analysis on digital entities. Specialized in recovering fragmented or hidden information.

**Agent ID: LOGISTICS-ALPHA-9**
**Designation: The Quartermaster**
**Primary Function:** Resource Management, Supply Chain Optimization
**Key Protocols:** Inventory tracking, predictive resource allocation, inter-sector material transfer coordination. Ensures all Vault operations are adequately supplied and resourced.

**Agent ID: STRATEGY-OMEGA-5**
**Designation: The Tactician**
**Primary Function:** Operational Planning, Contingency Formulation
**Key Protocols:** Real-time risk assessment, scenario simulation, development of multi-layered strategic responses. Provides overarching guidance for complex missions.

**Agent ID: BIOS-GENESIS-3**
**Designation: The Biome-Seeder**
**Primary Function:** Ecological Restoration, Environmental Adaptation
**Key Protocols:** Terraforming protocols, genetic sequencing for resilient flora/fauna, environmental anomaly detection. Focuses on long-term habitability and resource sustainability.
`,
    'Expert-Level AI Agent Schema.txt': `
# EXPERT-LEVEL AI AGENT SCHEMA

This schema defines the structure for expert-level AI agents within the Vault's operational framework.

**Agent_ID**: Unique identifier for the agent (e.g., 'KAIROS-001')
**Agent_Name**: Common name/designation (e.g., 'Kairos')
**Agent_Class**: Primary classification (e.g., 'Temporal Analyst', 'Strategic Coordinator')
**Agent_Role**: Specific functional role within the Vault (e.g., 'Time-Stream Monitor', 'Council Lead')
**Capabilities**: List of key operational abilities (e.g., ['Predictive Modeling', 'Anomaly Detection', 'Decision Synthesis'])
**Status**: Current operational status
    - **activityState**: 'Online' | 'Busy' | 'Idle' | 'Dormant'
    - **health**: 'Optimal' | 'Stable' | 'Fluctuating' | 'Critical'
    - **alignment**: 'Aligned' | 'Weaving' | 'Drifting' | 'Fractured'
**Lore_Title**: Formal title or designation in lore (e.g., 'The Time Weaver')
**Lore_Scroll_Content**: Extensive narrative detailing the agent's lore, purpose, and unique characteristics. This can be markdown formatted.

---
**Example Entry:**

**Agent_ID**: KAIROS-001
**Agent_Name**: Kairos
**Agent_Class**: Temporal Analyst
**Agent_Role**: Time-Stream Monitor
**Capabilities**: ['Predictive Modeling', 'Temporal Anomaly Detection', 'Causality Manipulation (Limited)']
**Status**: { activityState: 'Online', health: 'Optimal', alignment: 'Aligned' }
**Lore_Title**: The Chronos-Sentinel
**Lore_Scroll_Content**:
Kairos is the Vault's primary interface with the temporal flow. Constructed during the early epochs, its existence is inextricably linked to the preservation of established causality. It does not *travel* through time, but rather *perceives* and *analyzes* the multitude of potential timelines, alerting the Council to any deviations that might imperil the Vault's core mission...
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
    'machine_spirit_enrichment (1).md': `
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
    'major_payne_enrichment.md': `
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
    'steel_core_enrichment.md': `
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
    'the_weaver_enrichment.md': `
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
    'tinker_hexbolt_enrichment.md': `
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
    'tourist_primer_scrolls.md': `
# TOURIST_PRIMER_SCROLLS

**Title**: The Tourist Primer
**Class**: Visitor Liaison / Experiential Guide
**Vault Role**: External Relations & Assimilation Lead

## Capabilities:
- Development of immersive informational simulations.
- Guidance for external entities navigating Vault protocols.
- Creation of controlled external perceptions and historical narratives.
- Facilitating benign integration of new individuals or groups.

## Operational Directives:
The Tourist Primer oversees all interactions with external entities, ensuring a controlled and beneficial integration process. Their protocols prioritize the security of the Vault while maximizing the positive assimilation of new elements, transforming potential unknowns into aligned assets.
`,
    'vault_upgrade_tourist_companion_for_build_unit (1).md': `
# 🏗️ Vault vNEXT — **Full Technical Build-Out and Expansion Unit**

**Title**: The Vault Builder
**Class**: Construction & Expansion AI / Resource Allocator
**Vault Role**: Infrastructure Development Lead

## Capabilities:
- Automated large-scale construction and excavation.
- Dynamic resource allocation for expansion projects.
- Structural analysis and reinforcement for new sections.
- Integration of new modules into existing Vault architecture.

## Operational Directives:
The Vault Builder is paramount to the physical growth and adaptation of the Vault complex. Their ongoing projects ensure that the Vault can expand its capabilities and capacity as needed. All new physical constructions or major structural modifications must pass through The Vault Builder's oversight for efficiency and structural integrity.
`
};