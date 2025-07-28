import type { Playbook } from '../types';
import { loomService } from './loomService';

type Subscriber = (playbooks: Playbook[]) => void;

class PlaybookService {
    private playbooks: Playbook[] = [];
    private subscribers: Set<Subscriber> = new Set();

    constructor() {
        this.loadPlaybooks();
        loomService.subscribe(this.handleLoomUpdate);
    }

    private loadPlaybooks = () => {
        const playbookScrolls = loomService.getScrolls('playbook');
        try {
            this.playbooks = playbookScrolls.map(scroll => JSON.parse(scroll.content));
        } catch (e) {
            console.error("Failed to parse playbooks from loomService:", e);
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

    subscribe = (callback: Subscriber): (() => void) => {
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