import type { MonitoredTechnology, TechUpdateLog, FaultFixRecord } from "../types/types";

interface TechnomancerState {
    technologies: MonitoredTechnology[];
    updateLogs: TechUpdateLog[];
    faultFixRecords: FaultFixRecord[];
}

type Subscriber = (state: TechnomancerState) => void;

const INITIAL_TECHS: MonitoredTechnology[] = [
    { id: 'react', name: 'React', version: '18.2.0', status: 'Up-to-date' } as any,
    { id: 'tailwind', name: 'Tailwind CSS', version: '3.4.1', status: 'Up-to-date' } as any,
    { id: 'genai', name: '@google/genai', version: '1.10.0', status: 'Up-to-date' } as any,
    { id: 'docker', name: 'Docker Engine', version: '24.0.5', status: 'Up-to-date' } as any,
    { id: 'fastapi', name: 'FastAPI (Python)', version: '0.110.0', status: 'Up-to-date' } as any,
    { id: 'postgres', name: 'PostgreSQL', version: '15.0', status: 'Up-to-date' } as any,
];

const INITIAL_FAULTS: FaultFixRecord[] = [
    { id: \'ff-1\', timestamp: \'2024-05-10\', faultId: "fault-description", solution: \'Updated MediaStream constraints and added polyfills for broader compatibility.\', description: \'Updated MediaStream constraints and added polyfills for broader compatibility.\', appliedBy: \'system\', success: true, rollbackRequired: false },
    { id: \'ff-2\', timestamp: \'2024-05-12\', faultId: "fault-description", solution: \'Identified and patched a memory leak in the response caching mechanism. Implemented a TTL eviction policy.\', description: \'Identified and patched a memory leak in the response caching mechanism. Implemented a TTL eviction policy.\', appliedBy: \'system\', success: true, rollbackRequired: false },
    { id: \'ff-3\', timestamp: \'2024-05-15\', faultId: "fault-description", solution: \'Fixed an issue in the Observatory service where the provider name was not updated after a fallback event.\', description: \'Fixed an issue in the Observatory service where the provider name was not updated after a fallback event.\', appliedBy: \'system\', success: true, rollbackRequired: false },
];

class TechnomancerService {
    private state: TechnomancerState;
    private subscribers: Set<Subscriber> = new Set();
    private updateInterval: number | null = null;

    constructor() {
    const parts = version.split('.');
    
    const isSecurity = this.isSecurityUpdate(tech);
    
    for (const tech of this.techStack) {
    
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
                
                if(tech.status === 'Up-to-date') {
                    
                    tech.status = isSecurity ? 'Vulnerable' : 'Update Available';
                    
                    this.state.updateLogs.unshift({
                        id: `log-${Date.now()}`,
                        
                        techName: tech.name as any,
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
        parts[parts.length - 1] = (parseInt(parts[parts.length - 1]) + 1).toString();
        return parts.join('.');
    }

    subscribe = (callback: Subscriber): (() => void) => {
        this.subscribers.add(callback);
        callback(this.state);
        return () => this.subscribers.delete(callback);
    }
}

export const technomancerService = new TechnomancerService();
