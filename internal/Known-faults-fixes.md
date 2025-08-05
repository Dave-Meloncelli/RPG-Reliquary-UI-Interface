# Known Faults & Fixes Log

This document serves as a living record of recurring issues and their permanent solutions to ensure the system's continuous improvement and stability.

---

## 3. Critical Application Startup Failure: Missing index.html and Import Path Issues

### Fault Description
The application failed to start with multiple critical errors:
- **404 Error**: "This localhost page can't be found" when accessing `http://localhost:3000`
- **Import Resolution Errors**: `Cannot find module './components/Desktop'` and similar errors
- **EventBus Type Errors**: `'EventBus' has no exported member named 'EventBus'`
- **Vite Build Failures**: Failed to scan dependencies and resolve imports

### Root Cause Analysis
The issues stemmed from several architectural problems:

1. **Missing Entry Point**: Vite requires an `index.html` file in the root directory to serve the React application, but this file was missing
2. **Incorrect Import Paths**: Components in `src/components/App.tsx` were using relative paths like `../components/Desktop` instead of `./Desktop`
3. **EventBus Type Mismatches**: Multiple services were importing `EventBus` as a type instead of using `typeof eventBus`
4. **Directory Mismatch**: User was running commands from `F:\AZ Interface` while fixes were applied to `C:\az-interface`

### Implemented Solution (Remediation)

#### 3.1 Missing index.html Fix
Created the main `index.html` file in the root directory:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agent Zero Vault</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

#### 3.2 Import Path Corrections
Fixed relative import paths in `src/components/App.tsx`:
```typescript
// Before (incorrect)
import Desktop from '../components/Desktop';
import Dock from '../components/Dock';

// After (correct)
import Desktop from './Desktop';
import Dock from './Dock';
```

#### 3.3 EventBus Type Fixes
Corrected EventBus type annotations across multiple services:
```typescript
// Before (incorrect)
private eventBus: EventBus;
constructor(eventBus: EventBus) {

// After (correct)
private eventBus: typeof eventBus;
constructor(eventBus: typeof eventBus) {
```

**Services Fixed:**
- `src/services/apiBuildAgentService.ts`
- `src/services/openAICodexService.ts`
- `src/services/ashrakaIntegrationService.ts`
- `src/services/googleAIStudioService.ts`
- `src/services/googleVertexAIService.ts`
- `src/services/contentIngestionService.ts`
- `src/services/seoOptimizationService.ts`

#### 3.4 Development Environment Alignment
Ensured consistent working directory usage:
- **Correct Path**: `C:\az-interface`
- **Server Status**: Confirmed running on `http://localhost:3000`
- **Application Access**: Successfully serving React application

### Verification
- ✅ Server responds with 200 OK at `http://localhost:3000`
- ✅ React application loads without critical import errors
- ✅ Vite development server starts successfully
- ✅ Core components resolve correctly
- ✅ Dependencies installed in both C:\az-interface and F:\AZ Interface
- ✅ Schema files synchronized between directories

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

---

## 4. Directory Synchronization: Dual Repository Issue

### Fault Description
The user was running the application from `F:\AZ Interface` while fixes were being applied to `C:\az-interface`, causing persistent import errors and dependency issues.

### Root Cause Analysis
- **Dual Directories**: Two separate copies of the project existed
- **Dependency Mismatch**: Dependencies installed in `C:\az-interface` but not in `F:\AZ Interface`
- **File Synchronization**: Schema files and other assets existed in one directory but not the other
- **Import Resolution**: Vite was resolving imports from the wrong directory

### Implemented Solution (Remediation)

#### 4.1 Dependency Installation
Installed missing dependencies in the user's working directory:
```bash
cd "F:\AZ Interface"
npm install @google/genai monaco-editor
```

#### 4.2 File Synchronization
Copied missing schema files from the fixed directory:
```powershell
Copy-Item "C:\az-interface\schemas\*" "F:\AZ Interface\schemas\" -Recurse -Force
```

#### 4.3 Server Verification
Confirmed the development server is running correctly:
- ✅ Server responds with 200 OK at `http://localhost:3000`
- ✅ All dependencies resolved
- ✅ Import errors eliminated
- ✅ Application loads successfully

### Prevention Strategy
1. **Single Source of Truth**: Use only one project directory
2. **Directory Verification**: Always check `Get-Location` before running commands
3. **Dependency Management**: Ensure dependencies are installed in the working directory
4. **File Synchronization**: Keep all project files in sync between directories if multiple copies exist

### Current Status
- ✅ Application running successfully from `F:\AZ Interface`
- ✅ All dependencies installed and resolved
- ✅ Import errors eliminated
- ✅ Book Sales App and other features accessible