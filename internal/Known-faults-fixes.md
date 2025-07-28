# Known Faults & Fixes Log

This document serves as a living record of recurring issues and their permanent solutions to ensure the system's continuous improvement and stability.

---

## 1. Persistent Parsing Error: "List item found without a parent container"

### Fault Description

The application has repeatedly thrown errors such as `List item found without a parent container:` or `(yamlData.CHANGELOG || []).map is not a function`. These errors occur during the data ingestion phase when parsing YAML-like text files (`persona-passport-enrichment.md`, `core_templates_full_procedures.md`, etc.).

### Root Cause Analysis

The core issue stemmed from a fragile `parseYamlLike` function in `services/dataParsers.ts`. The parser struggled to reliably differentiate between various data structures common in the source files, specifically:
-   **Lists of simple strings** (e.g., a `CHANGELOG`).
-   **Lists of objects** (e.g., a publisher's product `catalog` with `name` and `marketValue` properties).
-   **Simple key-value pairs**.
-   **Nested objects**.

The parser failed to correctly create a parent array (`[]`) for list structures *before* attempting to process the list items (lines starting with `- `). This resulted in an attempt to push a list item into a non-array parent, causing the "without a parent container" crash.

### Implemented Solution (Remediation)

The `parseYamlLike` function has been completely replaced with a more robust, stack-based parser with a "lookahead" mechanism, inspired by the "System-Aware Parsing" principles found in the Vault's design documents.

**How it works:**

1.  **Stack-Based Context:** The parser maintains a stack of the current nested objects or arrays it is building.
2.  **Indentation Tracking:** It correctly tracks indentation levels to understand the document's structure.
3.  **Lookahead Logic:** When it encounters a key that starts a new block (e.g., `CHANGELOG:`), it **looks ahead** to the next non-empty line.
    -   If the next line is indented and starts with a hyphen (`- `), it knows the block is a **list** and creates an empty array (`[]`) as the container.
    -   If the next line is indented and is another key-value pair, it knows the block is an **object** and creates an empty object (`{}`).
4.  **Correct Parent Assignment:** This new container (`[]` or `{}`) is then pushed onto the stack, becoming the correct parent for all subsequent indented lines, which definitively solves the "list item without a parent container" error.

This enhanced parser correctly handles all data structures present in the intelligence documents, ensuring data integrity and preventing future parsing-related crashes.

---

## 2. Module Initialization Error: `does not provide an export named 'RawData'`

### Fault Description
A `SyntaxError` occurred during application startup, preventing modules from loading. The error indicates that an imported variable was not available from its source module at the time of import.

### Root Cause Analysis
The issue stemmed from a problematic module dependency structure. The `constants.tsx` file was trying to import raw data strings from `services/dataParsers.ts` solely to pass them back into parsing functions from that same file. This created a tight coupling and a potential module initialization race condition, where `constants.tsx` attempted to access an export from `dataParsers.ts` before the module was fully evaluated and the export was ready.

### Implemented Solution (Remediation)
The architecture has been refactored to be more robust and eliminate the problematic dependency:

1.  **Data Co-location:** The large, constant raw data strings have been moved from `services/dataParsers.ts` directly into `constants.tsx`. This places the data in the same module where it is parsed and used to define the application's core constants.
2.  **Pure Service Module:** The `services/dataParsers.ts` file has been simplified into a pure service module. It no longer contains any raw data and exclusively exports the parsing functions (`parseAgentPassports`, etc.).
3.  **Simplified Dependency:** `constants.tsx` now has a simple, one-way dependency on `dataParsers.ts` for its functions, resolving the initialization error. The data is defined and parsed within the same module, making the flow linear and predictable.