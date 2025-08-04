import type { MonitoredTechnology, TechUpdateLog, FaultFixRecord } from '../types';

interface TechnomancerState {
    technologies: MonitoredTechnology[];
    updateLogs: TechUpdateLog[];
    faultFixRecords: FaultFixRecord[];
}

type Subscriber = (state: TechnomancerState) => void;

const INITIAL_TECHS: MonitoredTechnology[] = [
    { id: 'react', name: 'React', version: '19.1.0', status: 'Up-to-date', category: 'Frontend' },
    { id: 'tailwind', name: 'Tailwind CSS', version: '3.4.1', status: 'Up-to-date', category: 'Frontend' },
    { id: 'genai', name: '@google/genai', version: '1.10.0', status: 'Up-to-date', category: 'AI Core' },
    { id: 'docker', name: 'Docker Engine', version: '24.0.5', status: 'Up-to-date', category: 'Backend' },
    { id: 'fastapi', name: 'FastAPI (Python)', version: '0.110.0', status: 'Up-to-date', category: 'Backend' },
    { id: 'postgres', name: 'PostgreSQL', version: '15.0', status: 'Up-to-date', category: 'Database' },
];

const INITIAL_FAULTS: FaultFixRecord[] = [
    { id: 'ff-1', timestamp: '2024-05-10', fault: 'Acquisitions app camera feed fails on specific browser versions.', resolution: 'Updated MediaStream constraints and added polyfills for broader compatibility.', affectedSystems: ['AcquisitionsApp', 'WebRTC Driver'] },
    { id: 'ff-2', timestamp: '2024-05-12', fault: 'High memory usage in PM2 for agent-orchestrator process under load.', resolution: 'Identified and patched a memory leak in the response caching mechanism. Implemented a TTL eviction policy.', affectedSystems: ['agent-orchestrator', 'Redis Cache'] },
    { id: 'ff-3', timestamp: '2024-05-15', fault: 'LLM calls to fallback provider were not being logged correctly.', resolution: 'Fixed an issue in the Observatory service where the provider name was not updated after a fallback event.', affectedSystems: ['Observatory', 'Orchestrator'] },
];

class TechnomancerService {
    private state: TechnomancerState;
    private subscribers: Set<Subscriber> = new Set();
    private updateInterval: number | null = null;

    constructor() {
        this.state = {
            technologies: INITIAL_TECHS,
            updateLogs: [],
            faultFixRecords: INITIAL_FAULTS,
        };
        this.startSimulation();
    }

    private notify = () => {
        this.subscribers.forEach(cb => cb(this.state));
    }

    private startSimulation() {
        if (this.updateInterval) clearInterval(this.updateInterval);

        this.updateInterval = window.setInterval(() => {
            // Low probability to simulate a new update or vulnerability
            if (Math.random() < 0.1) {
                const techIndex = Math.floor(Math.random() * this.state.technologies.length);
                const tech = this.state.technologies[techIndex];
                
                if(tech.status === 'Up-to-date') {
                    const isSecurity = Math.random() < 0.3;
                    const oldVersion = tech.version;
                    const newVersion = this.incrementVersion(oldVersion);
                    
                    tech.status = isSecurity ? 'Vulnerable' : 'Update Available';
                    
                    this.state.updateLogs.unshift({
                        id: `log-${Date.now()}`,
                        techId: tech.id,
                        techName: tech.name,
                        timestamp: new Date().toLocaleString(),
                        type: isSecurity ? 'Security Advisory' : 'Update',
                        fromVersion: oldVersion,
                        toVersion: newVersion,
                        importance: isSecurity ? 'Critical' : (Math.random() > 0.5 ? 'Medium' : 'Low'),
                        changelogUrl: `https://github.com/example/${tech.id}/releases/tag/v${newVersion}`,
                    });
                }
            }
            this.notify();
        }, 8000); // Check every 8 seconds
    }
    
    private incrementVersion(version: string): string {
        const parts = version.split('.').map(Number);
        parts[parts.length - 1]++;
        return parts.join('.');
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        callback(this.state);
        return () => this.subscribers.delete(callback);
    }
}

export const technomancerService = new TechnomancerService();
