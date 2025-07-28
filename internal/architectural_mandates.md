# Architectural Mandates

This document serves as the single, unbreakable source of truth for foundational architectural decisions for the Agent Zero Vault project. The Sentinel Protocol is required to read and enforce these mandates before any implementation.

---

## 1. Runtime Data Validation Library

- **Mandate:** The project will use **ArkType** for all runtime data validation.
- **Rationale:** After a comparative analysis, ArkType was selected over Zod for its superior "type-first" architecture, which provides a true single source of truth for data shapes, eliminating the risk of type and validator drift. Its performance and developer experience are also deemed optimal for this project's long-term goals.
- **Implementation:** All new features requiring data validation must use ArkType. Existing services should be incrementally refactored to use ArkType schemas as per the project backlog.
