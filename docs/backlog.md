# Agent Zero Vault - Project Backlog

## Introduction

This document serves as the strategic roadmap for the development of the Agent Zero Vault. It captures all requested features, enhancements, and architectural changes derived from system-wide analysis and newly imported project files.

All items are formatted as user stories within larger **Epics**. Each story is assigned a priority:

*   **P1 - Critical:** Essential for core functionality, unblocks other major work, or fixes a critical stability issue.
*   **P2 - High:** A key feature that delivers significant user value or closes a major workflow gap.
*   **P3 - Medium:** An important enhancement, refactoring, or foundational step for future features.
*   **P4 - Low:** A "nice-to-have" feature, refinement, or specialized capability.

---

## Epic 1: Foundational Backend & Architectural Integrity (Highest Priority)

This epic covers the most critical architectural gaps preventing the system from scaling and achieving its core vision.

### Stories:

*   **AZV-020: [Backend] Implement Core FastAPI Server (P1 - Critical) - DONE**
    *   **As a:** System Architect ("Forge")
    *   **I want:** to build the foundational Python/FastAPI backend server as outlined in the project's technical vision.
    *   **So that:** we can enable data persistence, secure API key management, scalable processing, and unblock the majority of planned features.
    *   **Acceptance Criteria:**
        1.  A basic FastAPI server is created and containerized via Docker.
        2.  A `docker-compose.yml` file is established to manage the API, database, and other services.
        3.  Initial endpoints for health checks are implemented.
    *   **Status: DONE**

*   **AZV-021: [Architecture] Implement a Global Event Bus Service (P1 - Critical) - DONE**
    *   **As a:** System Architect
    *   **I want:** a single, robust event bus service for inter-app communication, as mandated by `internal/schemas.md`.
    *   **So that:** we can decouple applications, eliminate bespoke subscriber patterns, and enable complex, event-driven workflows like the Task & Review Hub.
    *   **Acceptance Criteria:**
        1.  A `services/eventBus.ts` is created with `publish`, `subscribe`, and `unsubscribe` methods.
        2.  A typed event map is defined in `types.ts` for type safety.
    *   **Status: DONE**

*   **AZV-017: [Architecture] Implement ArkType for Runtime Validation (P1 - Critical) - DONE**
    *   **As a:** System Architect
    *   **I want:** to integrate the ArkType library for runtime data validation at all critical data boundaries.
    *   **So that:** the application is protected from malformed data, preventing crashes and ensuring data integrity.
    *   **Status:** This has been implemented. `arktype.ts`, `schemas/`, and validation logic in `acquisitionService` and `loomService` are complete.

*   **AZV-022: [Refactor] Refactor Stateful Services to Use the Event Bus (P2 - High)**
    *   **As a:** Developer
    *   **I want:** to refactor services like `controlPanelService` and `loomService` to use the new global event bus.
    *   **So that:** we eliminate redundant code, improve maintainability, and align with the mandated architectural pattern.

---

## Epic 2: The Unified Operator Interface (The Control Deck)

This epic focuses on creating a seamless and efficient user experience by centralizing tasks and workflows.

### Stories:

*   **AZV-013: [Frontend] Create Centralized Task & Review Hub App (P2 - High)**
    *   **As a:** System Operator
    *   **I want:** a dedicated app that aggregates all actionable tasks and items requiring review from other apps (e.g., Acquisitions, Curator).
    *   **So that:** I have a single "inbox" to manage my work, improving flow and ensuring nothing is missed.
    *   **Acceptance Criteria:**
        1.  A `TaskQueueService` is created to manage a global list of tasks.
        2.  A `TaskReviewHubApp` is built to display and filter tasks.
        3.  `AcquisitionsService` and `CuratorService` are updated to push new tasks to the queue.
        4.  Clicking a task deep-links the user to the relevant app and item.

*   **AZV-035: [Feature] Implement a Unified Notification System (P3 - Medium)**
    *   **As a:** System Operator
    *   **I want:** a single, global notification center in the main UI shell.
    *   **So that:** I can receive all system-wide alerts and updates in one place, reducing clutter and improving my awareness.

*   **AZV-036: [Feature] Implement Contextual Cross-App Actions (P3 - Medium)**
    *   **As a:** System Operator
    *   **I want:** to right-click on items throughout the UI (logs, files, books) and see a context menu of relevant actions that open other apps.
    *   **So that:** I can move seamlessly between tools and improve my workflow efficiency.

*   **AZV-007: [Frontend] Create UI for Workflow Management ("Automation Hub") (P2 - High)**
    *   **As a:** System Operator
    *   **I want:** a dedicated UI to view, manage, and manually trigger simulated `n8n` workflows.
    *   **So that:** I can control and monitor the automated processes that connect the Vault to external systems.

---

## Epic 3: Closing Workflow & Feature Gaps

This epic addresses identified "dead ends" and incomplete features to create a more polished and complete user experience.

### Stories:

*   **AZV-023: [Feature] Implement "Save" Functionality in the System Editor (P2 - High) - DONE**
    *   **As a:** Developer
    *   **I want:** the ability to save changes made to files in the System Editor.
    *   **So that:** the editor becomes a functional tool for modifying the system's own codebase.
    *   **Status: DONE**

*   **AZV-024: [Feature] Establish a Data Contract for the Automation Hub (P3 - Medium) - DONE**
    *   **As a:** Developer
    *   **I want:** a clear mechanism to pass application context *into* a workflow and receive a structured result *from* it.
    *   **So that:** the Automation Hub can be used for meaningful, data-driven tasks initiated from other apps.
    *   **Status: DONE**

*   **AZV-025: [Feature] Connect Curator Placeholders to Acquisitions Scans (P2 - High)**
    *   **As a:** System Operator
    *   **I want:** a clear workflow to link a placeholder listing created in The Curator to a new physical item scanned in the Acquisitions app.
    *   **So that:** the end-to-end acquisition pipeline is complete and seamless.

*   **AZV-027: [Feature] Integrate or Remove PersonaFusionChamber.tsx (P3 - Medium)**
    *   **As a:** Developer
    *   **I want:** the `PersonaFusionChamber` component to be fully integrated into the UI or removed from the codebase.
    *   **So that:** there are no orphan components and the application reflects its intended feature set.

---

## Epic 4: The Self-Aware & Self-Improving Vault

This epic focuses on enhancing the Vault's intelligence through better data handling, knowledge management, and performance optimization.

### Stories:

*   **AZV-029: [Feature] Implement Agent Knowledge Feedback Loop (P3 - Medium)**
    *   **As an:** AI Agent
    *   **I want:** a protocol to correct, amend, or add to the central knowledge base based on my own deductions.
    *   **So that:** the system's knowledge can evolve and improve, creating a true learning feedback loop.

*   **AZV-033: [Optimization] Implement LLM Request Batching (P3 - Medium) - DONE**
    *   **As a:** System Architect
    *   **I want:** to implement a request queue in `geminiClient.ts` to batch similar, non-urgent API calls.
    *   **So that:** we can improve efficiency and reduce the total number of API calls, optimizing cost and performance.
    *   **Status: DONE**

*   **AZV-034: [Optimization] Optimize AgentNetworkApp Rendering (P3 - Medium)**
    *   **As a:** User
    *   **I want:** the Agent Network app to only re-render agent cards whose data has actually changed.
    *   **So that:** the application is more performant and uses fewer client-side resources.

*   **AZV-001: [Backend] Implement Native File Parsing & Indexing Commands (P1 - Critical)**
    *   **As a:** System Operator
    *   **I want:** the backend to handle parsing and indexing of various file types dropped into the application.
    *   **So that:** the Vault can build a comprehensive, searchable knowledge base from user-provided documents.

*   **AZV-005: [Backend] Architect for Vector Database (P2 - High)**
    *   **As a:** System Architect
    *   **I want:** the backend to integrate with a vector database (e.g., Milvus, pgvector).
    *   **So that:** we can enable semantic search and advanced retrieval-augmented generation (RAG) capabilities for the agents.

---

## Epic 5: Codebase & Documentation Hygiene

This epic is for cleanup and maintenance tasks that improve the long-term health and clarity of the project.

### Stories:

*   **AZV-026: [Chore] Remove Deprecated Data Files (P3 - Medium)**
    *   **As a:** Developer
    *   **I want:** to delete the deprecated `data/agentBaseData.ts` and `data/personaLoreData.ts` files.
    *   **So that:** the codebase is clean and there is only one single source of truth for agent data.

*   **AZV-028: [Chore] Audit and Integrate All Persona Lore (P3 - Medium)**
    *   **As a:** Technical Writer ("Reliquarian")
    *   **I want:** to perform a full audit to ensure all lore from the `Personas/*.md` files is correctly ingested and displayed in the `PersonaViewerApp`.
    *   **So that:** the rich narrative content is fully utilized and presented correctly to the user.
