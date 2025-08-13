import React, { type FC } from 'react';
import type { AgentProfile } from '../../types';

interface PersonaListProps {
    agents: AgentProfile[];
    selectedAgentId: string | null;
    onSelect: (agent: AgentProfile) => void;

  title?: any;
  title?: any;}

const PersonaList: FC<PersonaListProps> = ({ agents, selectedAgentId, onSelect }) => {
    return (
        <div className="w-1/3 min-w-[250px] border-r border-slate-700/50 flex flex-col">
            <h2 className="text-lg font-bold p-3 bg-slate-900/70 border-b border-slate-700/50 text-white flex-shrink-0">
                Persona Index
            </h2>
            <ul className="overflow-y-auto">
                {agents.map(agent => (
                    <li key={agent.id}>
                        <button
                            onClick={() => onSelect(agent)}
                            className={`w-full text-left p-3 transition-colors duration-150 ${
                                selectedAgentId === agent.id 
                                    ? 'bg-indigo-600/30 border-l-4 border-indigo-500' 
                                    : 'border-l-4 border-transparent hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="font-bold text-white">{agent.name}</div>
                            {agent.title && <div className="text-sm text-slate-400 truncate">{agent.title}</div>}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersonaList;
