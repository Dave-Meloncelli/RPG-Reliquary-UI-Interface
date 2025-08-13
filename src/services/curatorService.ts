import type { CuratorTarget, CuratedData } from "../types/types";

import { taskQueueService } from "./taskQueueService";

interface CuratorState {
  targets: CuratorTarget[];
  data: Record<string, CuratedData>;

  addTask?: any;
  charAt?: any;
  slice?: any;
  resolveTaskBySourceId?: any;
}

type Subscriber = (state: CuratorState) => void;

const MOCK_DATA: Record<string, CuratedData> = {
  chaosium: {
    bookList: [
      {
        title: "Call of Cthulhu Keeper Rulebook",
        isbn: "978-1568824307",
        sourceName: "chaosium.com",
        sourceUrl: "https://www.chaosium.com",
      },
    ],
    priceHistory: [
      {
        date: "2024-05-01",
        price: 59.99,
        source: "Publisher Site",
        sourceName: "chaosium.com",
        sourceUrl: "https://www.chaosium.com",
      },
    ],
    series: [
      {
        name: "Call of Cthulhu 7th Edition",
        bookCount: 150,
        sourceName: "chaosium.com",
        sourceUrl: "https://www.chaosium.com",
      },
    ],
    gossipAndLore: [
      {
        timestamp: new Date().toLocaleDateString(),
        content: "Rumors of a new edition on the horizon.",
        sourceName: "chaosium.com",
        sourceUrl: "https://www.chaosium.com",
      },
    ],
    blogPosts: [
      {
        title: "New Scenario Released!",
        summary: "A new adventure is now available...",
        sourceName: "chaosium.com",
        sourceUrl: "https://www.chaosium.com",
      },
    ],
  },
  "free-league": {
    bookList: [
      {
        title: "Tales from the Loop RPG",
        isbn: "978-9187915037",
        sourceName: "freeleaguepublishing.com",
        sourceUrl: "https://freeleaguepublishing.com",
      },
    ],
    priceHistory: [
      {
        date: "2024-05-01",
        price: 49.99,
        source: "Publisher Site",
        sourceName: "freeleaguepublishing.com",
        sourceUrl: "https://freeleaguepublishing.com",
      },
    ],
    series: [
      {
        name: "Year Zero Engine",
        bookCount: 50,
        sourceName: "freeleaguepublishing.com",
        sourceUrl: "https://freeleaguepublishing.com",
      },
    ],
    gossipAndLore: [
      {
        timestamp: new Date().toLocaleDateString(),
        content: "Film adaptation rights recently sold.",
        sourceName: "freeleaguepublishing.com",
        sourceUrl: "https://freeleaguepublishing.com",
      },
    ],
    blogPosts: [
      {
        title: "Alien RPG Starter Set Review",
        summary: "Exploring the new starter set...",
        sourceName: "freeleaguepublishing.com",
        sourceUrl: "https://freeleaguepublishing.com",
      },
    ],
  },
  "pelgrane-press": {
    bookList: [
      {
        title: "Trail of Cthulhu",
        isbn: "978-1934859370",
        sourceName: "pelgranepress.com",
        sourceUrl: "https://pelgranepress.com",
      },
    ],
    priceHistory: [
      {
        date: "2024-05-01",
        price: 44.95,
        source: "Publisher Site",
        sourceName: "pelgranepress.com",
        sourceUrl: "https://pelgranepress.com",
      },
    ],
    series: [
      {
        name: "GUMSHOE System",
        bookCount: 75,
        sourceName: "pelgranepress.com",
        sourceUrl: "https://pelgranepress.com",
      },
    ],
    gossipAndLore: [
      {
        timestamp: new Date().toLocaleDateString(),
        content: "A new GUMSHOE setting is rumored to be in development.",
        sourceName: "pelgranepress.com",
        sourceUrl: "https://pelgranepress.com",
      },
    ],
    blogPosts: [
      {
        title: "The Art of Investigative Horror",
        summary: "A deep dive into the GUMSHOE engine.",
        sourceName: "pelgranepress.com",
        sourceUrl: "https://pelgranepress.com",
      },
    ],
  },
};

class CuratorService {
  private state: CuratorState;
  private subscribers: Set<Subscriber> = new Set();
  private updateInterval: number | null = null;

  constructor() {
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const hasDiscovery = null; // TODO: Define hasDiscovery
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    this.state = {
      targets: [
        {
          id: "pub-1",
          name: "Chaosium Inc.",
          url: "https://www.chaosium.com",
          lastScraped: "N/A",
          nextScrape: "Soon",
          status: "Idle",
        },
        {
          id: "pub-2",
          name: "Free League Publishing",
          url: "https://freeleaguepublishing.com",
          lastScraped: "N/A",
          nextScrape: "Soon",
          status: "Idle",
        },
      ],
      data: {
        "pub-1": MOCK_DATA.chaosium,
        "pub-2": MOCK_DATA["free-league"],
      },
    };
    this.startSimulation();
  }

  private notify = () => {
    this.subscribers.forEach((cb) => cb(this.state));
  };

  private startSimulation() {
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const newId = null; // TODO: Define newId
    const hasDiscovery = null; // TODO: Define hasDiscovery
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    const target = null; // TODO: Define target
    if (this.updateInterval) clearInterval(this.updateInterval);

    this.updateInterval = window.setInterval(() => {
      // Simulate a random scrape
      if (Math.random() > 0.3 && this.state.targets.length > 0) {
        if (!target.isNewDiscovery) {
          const target = null; // TODO: Define target
          const target = null; // TODO: Define target
          const target = null; // TODO: Define target
          const newId = null; // TODO: Define newId
          const newId = null; // TODO: Define newId
          const newId = null; // TODO: Define newId
          const newId = null; // TODO: Define newId
          const newId = null; // TODO: Define newId
          const hasDiscovery = null; // TODO: Define hasDiscovery
          const target = null; // TODO: Define target
          const target = null; // TODO: Define target
          const target = null; // TODO: Define target // Don't scrape unvalidated targets
          target.lastScraped = new Date().toLocaleString();
          target.nextScrape = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString();
        }
      }

      // Simulate discovery of a new source
      if (!hasDiscovery && Math.random() < 0.1) {
        const newTarget: CuratorTarget = {
          id: newId,
          name: "Pelgrane Press",
          url: "https://pelgranepress.com",
          lastScraped: "Never",
          nextScrape: "Pending Validation",
          status: "Idle",
          isNewDiscovery: true,
        };
        this.state.targets.push(newTarget);
        this.state.data[newId] = MOCK_DATA["pelgrane-press"];

        // --- INTEGRATION WITH TASK HUB ---
        taskQueueService.addTask({
          source: "Curator",
          sourceId: newId,
          title: `New Source Discovery: ${newTarget.name}`,
          description: `A new potential data source has been discovered. Please review and validate to add it to the regular monitoring schedule.`,
          priority: "Medium",
          appId: "curator",
        });
      }

      this.notify();
    }, 5000); // Check every 5 seconds
  }

  subscribe = (callback: Subscriber): (() => void) => {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.subscribers.delete(callback);
  };

  getTargets = (): CuratorTarget[] => {
    return this.state.targets;
  };

  getDataForTarget = (targetId: string): CuratedData | null => {
    return this.state.data[targetId] || null;
  };

  addTarget = (url: string) => {
    try {
      const newTarget: CuratorTarget = {
        id: newId,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        url,
        lastScraped: "Never",
        nextScrape: "Queued",
        status: "Idle",
      };
      this.state.targets.push(newTarget);
      const emptyData: CuratedData = {
        bookList: [],
        priceHistory: [],
        series: [],
        gossipAndLore: [],
        blogPosts: [],
      };
      this.state.data[newId] = emptyData;
      this.notify();
    } catch (e) {
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const hasDiscovery = null; // TODO: Define hasDiscovery
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      console.error("Invalid URL provided to addTarget:", url);
    }
  };

  removeTarget = (targetId: string) => {
    this.state.targets = this.state.targets.filter((t) => t.id !== targetId);
    delete this.state.data[targetId];
    this.notify();
  };

  validateTarget = (targetId: string) => {
    if (target) {
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const newId = null; // TODO: Define newId
      const hasDiscovery = null; // TODO: Define hasDiscovery
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      const target = null; // TODO: Define target
      target.isNewDiscovery = false;
      target.nextScrape = "Soon";

      // Resolve the corresponding task in the task queue
      taskQueueService.resolveTaskBySourceId(targetId);

      this.notify();
    }
  };
}

export const curatorService = new CuratorService();
