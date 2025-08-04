import React, { useState, useEffect, type FC } from 'react';
import { controlPanelService } from '../services/controlPanelService';
import { getInitialAgentData } from '../services/agentData';
import type { ControlPanelState, AgentProfile } from '../types';

const TABS = ['Agents', 'Orchestrator', 'API Keys'];

const ControlPanelApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [state, setState] = useState<ControlPanelState>(controlPanelService.getState());
    const [agents] = useState<AgentProfile[]>(getInitialAgentData());

    useEffect(() => {
        const unsubscribe = controlPanelService.subscribe(setState);
        return unsubscribe;
    }, []);

    const handleAgentStatusToggle = (agentId: string) => {
        const currentStatus = state.agentMasterStatus[agentId];
        const newStatus = currentStatus === 'Online' ? 'Dormant' : 'Online';
        controlPanelService.setAgentMasterStatus(agentId, newStatus);
    };

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const budget = parseInt(e.target.value, 10);
        if (!isNaN(budget)) {
            controlPanelService.updateOrchestratorBudget(budget);
        }
    };
    
    const handleProviderToggle = (providerKey: string) => {
        const isEnabled = !state.orchestrator.providerEnabled[providerKey];
        controlPanelService.setProviderEnabled(providerKey, isEnabled);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Control Panel</h2>
                <p className="text-sm text-slate-400">Manage core system configurations.</p>
            </div>
            
            <div className="flex border-b border-slate-700/50">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold transition-colors ${
                            activeTab === tab 
                            ? 'text-white bg-indigo-600' 
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'Agents' && (
                    <div className="space-y-2">
                        {agents.map(agent => (
                             <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md">
                                 <div className="flex items-center gap-3">
                                     <div className="w-6 h-6 flex-shrink-0 bg-slate-700 rounded-md flex items-center justify-center text-white"><agent.icon /></div>
                                     <p className="font-semibold">{agent.name}</p>
                                 </div>
                                 <button
                                     onClick={() => handleAgentStatusToggle(agent.id)}
                                     className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                         state.agentMasterStatus[agent.id] === 'Online' 
                                         ? 'bg-green-500 hover:bg-green-600'
                                         : 'bg-slate-600 hover:bg-slate-500'
                                     }`}
                                 >
                                     {state.agentMasterStatus[agent.id]}
                                 </button>
                             </div>
                        ))}
                    </div>
                )}
                 {activeTab === 'Orchestrator' && (
                     <div className="space-y-4">
                        <div>
                           <label htmlFor="budget" className="block text-sm font-bold text-indigo-300 mb-1">Monthly Budget ($)</label>
                           <input
                                type="range"
                                id="budget"
                                min="0"
                                max="500"
                                value={state.orchestrator.monthlyBudget}
                                onChange={handleBudgetChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-center font-mono text-lg mt-1">${state.orchestrator.monthlyBudget}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-indigo-300 mb-2">Provider Status</p>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(state.orchestrator.providerEnabled).map(([key, isEnabled]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleProviderToggle(key)}
                                        className={`p-2 rounded-md text-left transition-colors ${isEnabled ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                                    >
                                        <p className="font-bold capitalize">{key}</p>
                                        <p className="text-xs">{isEnabled ? 'Enabled' : 'Disabled'}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                     </div>
                 )}
                 {activeTab === 'API Keys' && (
                    <div className="space-y-3">
                         {Object.values(state.apiKeys).map(apiKey => (
                             <div key={apiKey.name}>
                                <label className="block text-sm font-bold text-indigo-300 mb-1">{apiKey.name}</label>
                                <div className="flex">
                                <input
                                    type="text"
                                    readOnly
                                    value={apiKey.key}
                                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-l-md font-mono text-sm"
                                />
                                <button className="p-2 bg-slate-700 hover:bg-slate-600 border-y border-r border-slate-600 rounded-r-md text-xs">Update</button>
                                </div>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
        </div>
    );
};

export default ControlPanelApp;