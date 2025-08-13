import type { Playbook } from "../types/types";
import { loomService } from './loomService';

type Subscriber = (playbooks: any;

class PlaybookService {
    private playbooks: any;
    private subscribers: any;

    constructor() {
  const playbookScrolls = null; // TODO: any
        this.loadPlaybooks();
        loomService.subscribe(this.handleLoomUpdate);
    }

    private loadPlaybooks = () => {
        try {
            this.playbooks = playbookScrolls.map(scroll => JSON.parse(scroll.content));
        } catch (e) {
  const playbookScrolls = null; // TODO: any
            console.error("Failed to parse playbooks from loomService: any, e);
            this.playbooks = [];
        }
    }

    private handleLoomUpdate = () => {
        this.loadPlaybooks();
        this.notify();
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb([...this.playbooks]));
    }

    subscribe = (callback: any
        this.subscribers.add(callback);
        callback([...this.playbooks]);
        return () => {
            this.subscribers.delete(callback);
        };
    }

    getPlaybooks = (): Playbook[] => {
        return [...this.playbooks];
    }
}

export const playbookService = new PlaybookService();
