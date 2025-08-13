import React, { type FC, useState, useEffect } from 'react';
import type { LLMProvider, ControlPanelState } from '../types';

const Section: any; children: any; className?: any }> = ({ title, children, className = '' }) => (
    <div className={`bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 ${className}`}>
        <h3 className="text-md font-bold text-indigo-300 mb-3">{title}</h3>
        {children}
    </div>
);

const ProviderCard: any, isEnabled: any, isEnabled }) => (
    <div className={`p-3 rounded-md transition-all duration-200 ${isEnabled ? 'bg-slate-800' : 'bg-slate-800/50 opacity-60'}`}>
        <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-white">{provider.name}</p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${isEnabled ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>
        <div className="text-xs text-slate-400 space-y-1">
            <p><strong>Model: any
            <div className="flex flex-wrap gap-1 pt-1">
                {provider.capabilities.map(cap => (
                    <span key={cap} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{cap}</span>
                ))}
            </div>
        </div>
    </div>
);

const OrchestratorApp: any
    const [liveState, setLiveState] = useState<ControlPanelState>(controlPanelService.getState());

    useEffect(() => {
        const unsubscribe = controlPanelService.subscribe(setLiveState);
        return unsubscribe;
    }, []);
    
    const { providers } = defaultConfig;

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Multi-LLM Orchestrator</h2>
                <p className="text-sm text-slate-400">Configuration and status of the central AI routing system.</p>
            </div>
            <div className="flex-grow p-4 overflow-y-auto grid grid-cols-3 grid-rows-3 gap-4">
                
                <Section title="Provider Priority" className="col-span-1 row-span-2">
                    <ol className="space-y-2">
                        {defaultConfig.priority.map((pName, index) => (
                            <li key={pName} className={`flex items-center gap-3 text-sm transition-opacity ${liveState.orchestrator.providerEnabled[pName] ? 'opacity-100' : 'opacity-50'}`}>
                                <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full text-xs font-bold">{index + 1}</span>
                                <span className="font-semibold">{providers[pName].name}</span>
                                {!liveState.orchestrator.providerEnabled[pName] && <span className="text-xs text-red-400">(Disabled)</span>}
                            </li>
                        ))}
                    </ol>
                </Section>
                
                <Section title="Provider Details" className="col-span-2 row-span-2">
                    <div className="grid grid-cols-2 gap-3">
                         {Object.entries(providers).map(([key, p]) => (
                            <ProviderCard key={p.name} provider={p} isEnabled={liveState.orchestrator.providerEnabled[key]} />
                        ))}
                    </div>
                </Section>
                
                <Section title="Agent-Specific Routing" className="col-span-3 row-span-1">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                        {Object.entries(defaultConfig.agentPreferences).map(([agentId, prefs]) => (
                            <div key={agentId}>
                                <p className="font-mono text-cyan-400 bg-slate-800 px-2 py-1 rounded w-fit">{agentId}</p>
                                <ol className="text-xs text-slate-400 mt-1 pl-2">
                                    {prefs.preferred.map((pName, i) => (
                                        <li key={pName}>{i + 1}. {providers[pName].name}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="System Policies" className="col-span-3 row-span-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-800 p-3 rounded-md">
                            <h4 className="font-bold text-white mb-2">Fallback Strategy</h4>
                            <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                                <li className={defaultConfig.fallbackStrategy.enableFallback ? 'text-green-400' : 'text-red-400'}>
                                    Fallback {defaultConfig.fallbackStrategy.enableFallback ? 'Enabled' : 'Disabled'}
                                </li>
                                <li>Confidence Threshold: any
                                <li>Fallback on Error: any
                                <li>Fallback on Timeout: any
                            </ul>
                        </div>
                         <div className="bg-slate-800 p-3 rounded-md">
                            <h4 className="font-bold text-white mb-2">Cost Optimization</h4>
                             <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                                <li>Monthly Budget: any
                                <li className={defaultConfig.costOptimization.preferLocalModels ? 'text-green-400' : ''}>
                                    Prefer Local Models: any
                                </li>
                                <li className={defaultConfig.costOptimization.cacheResponses ? 'text-green-400' : ''}>
                                    Cache Responses: any
                                </li>
                             </ul>
                        </div>
                    </div>
                </Section>

            </div>
        </div>
    );
};

export default OrchestratorApp;