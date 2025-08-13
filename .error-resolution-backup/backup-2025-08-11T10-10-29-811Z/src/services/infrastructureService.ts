import type { InfrastructureStatus, DockerService, Pm2Process } from "../types/types";

const initialStatus: InfrastructureStatus = {
    docker: [
        { id: 'docker-postgres', name: 'postgres', image: 'postgres:15-alpine', status: 'running' },
        { id: 'docker-redis', name: 'redis', image: 'redis:7-alpine', status: 'running' },
        { id: 'docker-ollama', name: 'ollama', image: 'ollama/ollama', status: 'running' },
        { id: 'docker-python-nlp', name: 'python-nlp', image: 'local/python-nlp', status: 'running' },
        { id: 'docker-n8n', name: 'n8n', image: 'n8nio/n8n', status: 'stopped' },
    ],
    pm2: [
        { id: 'pm2-api', name: 'agent-zero-api', status: 'online', cpu: 0, memory: 0 },
        { id: 'pm2-orchestrator', name: 'agent-orchestrator', status: 'online', cpu: 0, memory: 0 },
        { id: 'pm2-erdu', name: 'erdu-monitor', status: 'online', cpu: 0, memory: 0 },
        { id: 'pm2-python-service', name: 'python-nlp-service', status: 'launching', cpu: 0, memory: 0 },
    ]
};


// Function to simulate updates
export const simulateInfrastructureUpdates = (current: InfrastructureStatus): InfrastructureStatus => {
    const updated: InfrastructureStatus = {
        docker: [...current.docker],
        pm2: [...current.pm2]
    };

    // Simulate Docker status changes (low probability)
    updated.docker = updated.docker.map(service => {
        if (Math.random() < 0.02 && service.status !== 'error') { // 2% chance to flicker
            setTimeout(() => {
                if (s) s.status = originalStatus;
            }, 3000); // return to normal after 3s
            return newService;
        }
        return service;
    });

    // Simulate PM2 resource usage
    updated.pm2 = updated.pm2.map(proc => {
        if (proc.status === 'online') {
  const newMem = null; // TODO: Define newMem
  const newCpu = null; // TODO: Define newCpu
  const newService = null; // TODO: Define newService
  const originalStatus = null; // TODO: Define originalStatus
  const s = null; // TODO: Define s
  const s = null; // TODO: Define s
            return { ...proc, cpu: newCpu, memory: newMem };
        }
        if (proc.status === 'launching' && Math.random() < 0.3) {
             return { ...proc, status: 'online' };
        }
        return proc;
    });


    return updated;
};


export const getInitialInfrastructureStatus = (): InfrastructureStatus => {
    // Return a deep copy
    return JSON.parse(JSON.stringify(initialStatus));
};
