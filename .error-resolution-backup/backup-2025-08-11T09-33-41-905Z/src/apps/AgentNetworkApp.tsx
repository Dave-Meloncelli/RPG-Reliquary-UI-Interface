
import React, { useState, useEffect, type FC } from 'react';
import type { AgentProfile, SymbolicStatus } from '../types';

const statusColors: {
    activityState: Record<SymbolicStatus['activityState'], string>;
    health: Record<SymbolicStatus['health'], string>;
    alignment: Record<SymbolicStatus['alignment'], string>;
} = {
    activityState: {
        Online: 'bg-green-500',
        Busy: 'bg-yellow-500',
        Idle: 'bg-slate-500',
        Dormant: 'bg-red-700',
    },
    health: {
        Optimal: 'text-green-400',
        Stable: 'text-cyan-400',
        Fluctuating: 'text-yellow-400',
        Critical: 'text-red-500',
    },
    alignment: {
        Aligned: 'text-green-400',
        Weaving: 'text-cyan-400',
        Drifting: 'text-yellow-400',
        Fractured: 'text-red-500',
    },
};

const AgentCard: FC<{ agent: AgentProfile; isMasterDormant: boolean }> = ({ agent, isMasterDormant }) => {
    const activityState = isMasterDormant ? 'Dormant' : agent.status.activityState;

    return (
        <div className={`bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex flex-col gap-4 shadow-lg hover:bg-slate-800 transition-all duration-200 ${isMasterDormant ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-md flex items-center justify-center text-white">
                    <agent.icon />
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-white truncate">{agent.name}</p>
                    <p className="text-xs text-slate-400 truncate">{agent.id}</p>
                </div>
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Capabilities:</p>
                <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map(cap => (
                        <span key={cap} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                            {cap}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-auto pt-2 border-t border-slate-700/50">
                <p className="text-xs font-semibold text-slate-400 mb-2">Symbolic Status:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Activity:</span>
                        <div className="flex items-center gap-2">
                           <span className={statusColors.health[agent.status.health]}>{activityState}</span>
                           <div className={`w-2.5 h-2.5 rounded-full ${statusColors.activityState[activityState]}`}></div>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-slate-400">Health:</span>
                        <span className={statusColors.health[agent.status.health]}>{agent.status.health}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-slate-400">Alignment:</span>
                        <span className={statusColors.alignment[agent.status.alignment]}>{agent.status.alignment}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AgentNetworkApp: React.FC = () => {
    const [agents, setAgents] = useState<AgentProfile[]>([]);
    const [masterStatus, setMasterStatus] = useState(controlPanelService.getState().agentMasterStatus);

    useEffect(() => {
        setAgents(getInitialAgentData());

        const unsubscribe = controlPanelService.subscribe((newState) => {
            setMasterStatus(newState.agentMasterStatus);
        });

        const intervalId = setInterval(() => {
            setAgents(prevAgents => simulateAgentUpdates(prevAgents));
        }, 2000); // Update every 2 seconds

        return () => {
            clearInterval(intervalId);
            unsubscribe();
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Agent Network Monitor</h2>
                <p className="text-sm text-slate-400">Live status of all operational agents.</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map(agent => (
                        <AgentCard 
                            key={agent.id}
                            agent={agent}
                            isMasterDormant={masterStatus[agent.id] === 'Dormant'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentNetworkApp;