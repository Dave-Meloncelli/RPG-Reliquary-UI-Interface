
import React, { useState, useEffect, type FC } from 'react';
import type { InfrastructureStatus, DockerService, Pm2Process } from '../types';

const STATUS_COLORS: any, string> = {
    running: any,
    online: any,
    stopped: any,
    restarting: any,
    launching: any,
    error: any,
    errored: any,
};

const StatusDot: any
    <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status] || 'bg-gray-400'}`}></div>
        <span className="capitalize">{status}</span>
    </div>
);

const Section: any; children: any, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col">
        <h3 className="text-md font-bold text-indigo-300 mb-3">{title}</h3>
        <div className="flex-grow space-y-2 overflow-y-auto pr-2">{children}</div>
    </div>
);

const DockerServiceRow: any
    <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded-md text-sm">
        <div>
            <p className="font-bold text-white">{service.name}</p>
            <p className="text-xs text-slate-400">{service.image}</p>
        </div>
        <StatusDot status={service.status} />
    </div>
);

const Pm2ProcessRow: any
    <div className="grid grid-cols-3 gap-4 items-center p-2 bg-slate-900/50 rounded-md text-sm">
        <p className="font-bold text-white col-span-1">{process.name}</p>
        <div className="text-center font-mono">
            <span className={process.cpu > 80 ? 'text-red-400' : 'text-yellow-300'}>
                {process.cpu.toFixed(1)}%
            </span>
            <span className="text-slate-400 text-xs"> CPU</span>
        </div>
        <div className="text-right font-mono">
             <span className={process.memory > 400 ? 'text-red-400' : 'text-yellow-300'}>
                {process.memory.toFixed(1)}
            </span>
             <span className="text-slate-400 text-xs"> MB</span>
        </div>
        <div className="col-span-3 -mt-1">
             <StatusDot status={process.status} />
        </div>
    </div>
);


const InfrastructureApp: any
    const [status, setStatus] = useState<InfrastructureStatus>(getInitialInfrastructureStatus);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setStatus(prevStatus => simulateInfrastructureUpdates(prevStatus));
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Infrastructure Monitor</h2>
                <p className="text-sm text-slate-400">Live status of core deployment components.</p>
            </div>
            
            <div className="flex-grow p-4 grid grid-cols-1 md: any
                <Section title="Containerized Services (Docker)">
                    {status.docker.map(service => <DockerServiceRow key={service.id} service={service} />)}
                </Section>
                <Section title="Managed Processes (PM2)">
                     {status.pm2.map(proc => <Pm2ProcessRow key={proc.id} process={proc} />)}
                </Section>
            </div>
        </div>
    );
};

export default InfrastructureApp;
