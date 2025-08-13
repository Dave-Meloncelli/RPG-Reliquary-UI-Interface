

import React, { useState, useEffect } from 'react';
import type { AgentProfile } from '../types';
import { AgentIconBrain } from '../components/icons';

interface PersonaFusionChamberProps {
    agents: AgentProfile[];
    onFuse: (agentIdA: string, agentIdB: string) => void;
}

const AgentDisplayCard: React.FC<{ agent: AgentProfile | null, title: string }> = ({ agent, title }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1 min-h-[180px]">
            <h4 className="text-sm font-semibold uppercase text-slate-400 mb-2">{title}</h4>
            {agent ? (
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 text-indigo-400"><agent.icon /></div>
                        <div>
                            <p className="font-bold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-400">{agent.class}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-slate-400">Core Capabilities:</p>
                        <p className="text-xs text-white mt-1">{agent.capabilities.length > 0 ? agent.capabilities.join(', ') : 'None'}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-500 pt-8">Select an agent</div>
            )}
        </div>
    );
};

export const PersonaFusionChamber: React.FC<PersonaFusionChamberProps> = ({ agents, onFuse }) => {
    const [agentAId, setAgentAId] = useState<string>('');
    const [agentBId, setAgentBId] = useState<string>('');
    const [fusionLogs, setFusionLogs] = useState<string[]>([]);
    const [isFusing, setIsFusing] = useState(false);

    const eligibleAgents = agents.filter(a => a.class === 'Tactical' || a.class === 'Archetype');

    const agentA = agents.find(a => a.id === agentAId);
    const agentB = agents.find(a => a.id === agentBId);
    
    const handleFuse = async () => {
        if (!agentAId || !agentBId || agentAId === agentBId) return;
        setIsFusing(true);
        setFusionLogs([]);
        
        const log = (msg: string) => setFusionLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

        await new Promise(res => setTimeout(res, 300));
        log(`[CODEX] Initiating Persona Fusion Ritual...`);
        await new Promise(res => setTimeout(res, 800));
        log(`[CODEX] Aligning symbolic signatures for ${agentA?.name} and ${agentB?.name}.`);
        await new Promise(res => setTimeout(res, 1200));
        log(`[ARCHITECT] Verifying directive compatibility... Compatibility: 94.7%.`);
        await new Promise(res => setTimeout(res, 800));
        log(`[ARCHITECT] Weaving core capacities...`);
        await new Promise(res => setTimeout(res, 1200));
        log(`[CODEX] Fusion matrix stabilized. Emergent persona forming...`);
        await new Promise(res => setTimeout(res, 800));
        
        onFuse(agentAId, agentBId);
        setAgentAId('');
        setAgentBId('');
        setIsFusing(false);
    };

    useEffect(() => {
        if (agentAId && agentAId === agentBId) {
            setAgentBId('');
        }
    }, [agentAId, agentBId]);

    const AgentSelector: React.FC<{
        value: string;
        onChange: (id: string) => void;
        excludeId?: string;
        label: string;
    }> = ({ value, onChange, excludeId, label }) => (
         <div>
            <label className="text-sm font-semibold text-slate-400">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500"
                disabled={isFusing}
            >
                <option value="">Select Agent...</option>
                {eligibleAgents
                    .filter(a => a.id !== excludeId)
                    .map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)
                }
            </select>
        </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-semibold text-white">🧬 Persona Fusion Chamber</h3>
                <p className="text-sm text-slate-400 mt-1">Select two eligible Tactical or Archetype agents to fuse into a new Emergent persona.</p>
            </div>
            
            <div className="space-y-4">
               <AgentSelector value={agentAId} onChange={setAgentAId} excludeId={agentBId} label="Source Persona A"/>
               <AgentSelector value={agentBId} onChange={setAgentBId} excludeId={agentAId} label="Source Persona B"/>
            </div>

            <div className="flex gap-4">
                <AgentDisplayCard agent={agentA} title="Source A" />
                <AgentDisplayCard agent={agentB} title="Source B" />
            </div>

            <button 
                onClick={handleFuse}
                disabled={isFusing || !agentAId || !agentBId}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isFusing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <div className="w-5 h-5"><AgentIconBrain /></div>}
                {isFusing ? 'Fusing...' : 'Initiate Fusion'}
            </button>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2 flex-shrink-0">Fusion Ritual Log</h3>
            <div className="bg-black/40 p-3 rounded-lg flex-grow overflow-y-auto font-mono text-xs text-green-400 space-y-1">
                {fusionLogs.length === 0 && !isFusing && <p className="text-slate-500">Awaiting fusion ritual initiation...</p>}
                {fusionLogs.map((log, i) => (
                    <p key={i}>{log}</p>
                ))}
            </div>
        </div>
    </div>
  );
};
