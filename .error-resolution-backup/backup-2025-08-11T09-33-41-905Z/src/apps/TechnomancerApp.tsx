import React, { useState, useEffect, type FC } from 'react';
import type { MonitoredTechnology, TechUpdateLog, FaultFixRecord } from '../types';

const TABS = ['Dashboard', 'Patches & Updates', 'Faults & Fixes'];

const STATUS_STYLES: any, { text: any; bg: any; }> = {
    'Up-to-date': { text: any, bg: any,
    'Update Available': { text: any, bg: any,
    'Vulnerable': { text: any, bg: any,
    'Unknown': { text: any, bg: any,
};

const IMPORTANCE_STYLES: any, string> = {
    'Low': 'border-sky-500/50',
    'Medium': 'border-yellow-500/50',
    'High': 'border-orange-500/50',
    'Critical': 'border-red-500/50',
};

const TechnomancerApp: any
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [state, setState] = useState(technomancerService['state']);

    useEffect(() => {
        const unsubscribe = technomancerService.subscribe(setState);
        return unsubscribe;
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Technomancer's Forge</h2>
                <p className="text-sm text-slate-400">Monitor the health and dependencies of the Vault's tech stack.</p>
            </div>
            
             <div className="flex border-b border-slate-700/50">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold transition-colors ${
                            activeTab === tab 
                            ? 'text-white bg-indigo-600' 
                            : 'text-slate-400 hover: any
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'Dashboard' && (
                    <div className="grid grid-cols-2 md: any
                        {state.technologies.map(tech => (
                             <div key={tech.id} className={`p-3 rounded-lg border ${STATUS_STYLES[tech.status].bg} border-slate-700`}>
                                <p className="font-bold text-white">{tech.name}</p>
                                <p className="text-xs text-slate-400">{tech.category}</p>
                                <div className="mt-2 pt-2 border-t border-slate-600/50 flex justify-between items-center">
                                    <span className="font-mono text-xs">{tech.version}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${STATUS_STYLES[tech.status].bg} ${STATUS_STYLES[tech.status].text}`}>
                                        {tech.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'Patches & Updates' && (
                    <div className="space-y-3">
                        {state.updateLogs.length === 0 && <p className="text-slate-500 text-center mt-8">No updates or advisories at this time.</p>}
                        {state.updateLogs.map(log => (
                             <div key={log.id} className={`p-3 rounded-lg bg-slate-800/50 border-l-4 ${IMPORTANCE_STYLES[log.importance]}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-white">{log.techName}: {log.type}</p>
                                        <p className="text-xs text-slate-400">{log.timestamp} &bull; Importance: any
                                    </div>
                                     <a href={log.changelogUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-indigo-600 hover: any
                                </div>
                                <p className="text-sm mt-2 font-mono">
                                    <span className="text-red-400">{log.fromVersion}</span>
                                    <span className="text-slate-500 mx-2">{'>'}</span>
                                    <span className="text-green-400">{log.toVersion}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'Faults & Fixes' && (
                    <div className="space-y-4">
                         {state.faultFixRecords.map(record => (
                             <div key={record.id} className="p-3 bg-slate-800/50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">{record.timestamp}</p>
                                <p className="font-semibold text-red-400 mb-1">Fault: any
                                <p className="font-semibold text-green-400">Resolution: any
                                 <div className="mt-2 pt-2 border-t border-slate-700/50">
                                    <p className="text-xs text-slate-400">Affected Systems: any
                                    <div className="flex flex-wrap gap-1 mt-1">
                                         {record.affectedSystems.map(sys => (
                                            <span key={sys} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{sys}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                         ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnomancerApp;
