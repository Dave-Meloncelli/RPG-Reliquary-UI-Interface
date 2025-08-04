import React, { useState, useEffect, type FC } from 'react';
import { controlPanelService } from '../../services/controlPanelService';

const AgentStatusSummaryWidget: FC = () => {
    const [status, setStatus] = useState({ online: 0, dormant: 0, total: 0 });

    useEffect(() => {
        const updateState = (state: ReturnType<typeof controlPanelService.getState>) => {
            const masterStatus = state.agentMasterStatus;
            const total = Object.keys(masterStatus).length;
            const online = Object.values(masterStatus).filter(s => s === 'Online').length;
            const dormant = total - online;
            setStatus({ online, dormant, total });
        };
        
        const unsubscribe = controlPanelService.subscribe(updateState);
        
        // Trigger initial state load
        updateState(controlPanelService.getState());

        return unsubscribe;
    }, []);

    return (
        <div className="h-full flex items-center justify-around text-center">
            <div>
                <p className="text-4xl font-bold font-mono text-green-400">{status.online}</p>
                <p className="text-sm text-slate-400">Agents Online</p>
            </div>
            <div>
                <p className="text-4xl font-bold font-mono text-red-500">{status.dormant}</p>
                <p className="text-sm text-slate-400">Agents Dormant</p>
            </div>
             <div>
                <p className="text-4xl font-bold font-mono text-white">{status.total}</p>
                <p className="text-sm text-slate-400">Total Agents</p>
            </div>
        </div>
    );
};

export default AgentStatusSummaryWidget;