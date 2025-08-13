import type { EventMap } from "../types/types";

// Generic callback based on event name and payload
type EventCallback<E extends keyof EventMap> = (payload: EventMap[E]) => void;

class EventBus {
  private subscribers: { [K in keyof EventMap]?: Set<EventCallback<K>> } = {};

  publish<E extends keyof EventMap>(event: E, payload: EventMap[E]): void {
    const handlers = this.subscribers[event];
    if (!handlers) return;

    // Create a copy of handlers to avoid issues if handlers are modified during iteration
    const handlersCopy = Array.from(handlers);
    handlersCopy.forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`Error in handler for ${String(event)}:`, err);
        // Optionally, you could remove the problematic handler here
        // handlers.delete(callback);
      }
    });
  }

  subscribe<E extends keyof EventMap>(
    event: E,
    callback: EventCallback<E>,
  ): () => void {
    if (!this.subscribers[event]) {
      // Using 'as any' to work around TypeScript's limitation with assigning to
      // an indexed property on a generic type. This is a safe and localized cast.
      this.subscribers[event] = new Set() as any;
    }
    const handlers = this.subscribers[event] as Set<EventCallback<E>>;
    handlers.add(callback);

    return () => {
      // handlers is captured in the closure, so it refers to the correct Set.
      handlers.delete(callback);
    };
  }
}

// Export a singleton instance of the bus
export const eventBus = new EventBus();
