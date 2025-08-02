# Architectural Schemas & Patterns

This document serves as a technical reference for the established architectural patterns in the Agent Zero Vault UI. Future development should adhere to these patterns to ensure consistency, scalability, and maintainability.

## 1. Singleton Services (for API Clients)

- **Pattern:** Create a single, shared instance of an external client (e.g., `@google/genai`).
- **Example:** `services/geminiClient.ts`
- **When to use:** For any third-party library or SDK that requires initialization, especially with API keys. This prevents redundant initializations and provides a single point for configuration, error handling, and future abstraction (e.g., for a multi-LLM orchestrator).
- **Implementation:**
    - Initialize the client once at the module level.
    - Export standardized functions that use the client instance (e.g., `generateText`, `generateImage`).
    - Other services should import and use these standardized functions, not create their own client.

## 2. Dynamic State Services (for Shared, Mutable State)

- **Pattern:** A class-based service that manages a piece of shared application state and notifies subscribers of changes.
- **Examples:** `services/controlPanelService.ts`, `services/codexService.ts`
- **When to use:** When multiple, potentially unrelated components need to read and/or write to the same data store. This is a lightweight alternative to a full state management library like Redux or Zustand.
- **Implementation:**
    - A `class` holds the `private state`.
    - A `private subscribers: Set<Function>` holds callback functions.
    - A `subscribe(callback)` method adds a listener and returns an `unsubscribe` function.
    - A `private notify()` method iterates over subscribers and calls them with the new state.
    - Public methods (`updateSetting()`, `addRule()`) modify the internal state and then call `notify()`.
    - Export a singleton instance of the class: `export const myService = new MyService();`.

## 3. Event Bus (for Decoupled Inter-App Communication)

- **Pattern:** A central publish-subscribe system for broadcasting and listening to named application events.
- **Example:** `services/eventBus.ts`
- **When to use:** When one component needs to trigger an action in another component without creating a direct dependency or passing props through many layers (prop drilling). Ideal for inter-window communication.
- **Implementation:**
    - A central `eventBus` instance with `publish`, `subscribe`, and `unsubscribe` methods.
    - Use a typed event map in `types.ts` (e.g., `AppEventMap`) for type safety.
    - A "publisher" component calls `eventBus.publish('eventName', data)`.
    - A "subscriber" component uses `useEffect` to call `eventBus.subscribe('eventName', callback)` on mount, and returns the unsubscribe function for cleanup.
