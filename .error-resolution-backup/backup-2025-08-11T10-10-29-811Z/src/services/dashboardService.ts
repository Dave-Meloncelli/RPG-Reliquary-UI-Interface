import type { DashboardLayout, WidgetType } from "../types";

const DEFAULT_LAYOUT: DashboardLayout = {
    gridTemplateAreas: `"status metrics" "agents agents"`,
    widgets: [
        { id: 'w1', type: 'SystemStatus', gridArea: 'status' },
        { id: 'w2', type: 'KeyMetrics', gridArea: 'metrics' },
        { id: 'w3', type: 'AgentStatusSummary', gridArea: 'agents' },
    ]
};

const AVAILABLE_WIDGETS: WidgetType[] = ['SystemStatus', 'KeyMetrics', 'AgentStatusSummary'];

type Subscriber = (layout: DashboardLayout) => void;

class DashboardService {
    private layout: DashboardLayout;
    private subscribers: Set<Subscriber> = new Set();
    private readonly localStorageKey = 'aegis-dashboard-layout';

    constructor() {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const storedLayout = null; // TODO: Define storedLayout
        this.layout = this.loadLayout();
    }

    private loadLayout(): DashboardLayout {
        try {
            if (storedLayout) {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const storedLayout = null; // TODO: Define storedLayout
                if (parsed.gridTemplateAreas && Array.isArray(parsed.widgets)) {
                    return parsed;
                }
            }
        } catch (error) {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const storedLayout = null; // TODO: Define storedLayout
            console.error("Failed to load dashboard layout from localStorage:", error);
        }
        return DEFAULT_LAYOUT;
    }

    private saveLayout() {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const storedLayout = null; // TODO: Define storedLayout
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.layout));
        } catch (error) {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const storedLayout = null; // TODO: Define storedLayout
            console.error("Failed to save dashboard layout to localStorage:", error);
        }
    }

    private notify() {
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const parsed = null; // TODO: Define parsed
  const storedLayout = null; // TODO: Define storedLayout
        this.subscribers.forEach(cb => cb(this.layout));
    }

    subscribe(callback: Subscriber): () => void {
        this.subscribers.add(callback);
        callback(this.layout); // Immediately send current state
        return () => this.subscribers.delete(callback);
    }

    getLayout = (): DashboardLayout => {
        return this.layout;
    }

    getAvailableWidgets = (): WidgetType[] => {
        return AVAILABLE_WIDGETS;
    }
}

export const dashboardService = new DashboardService();
