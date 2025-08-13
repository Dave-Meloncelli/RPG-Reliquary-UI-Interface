// components/persona/PersonaList.tsx
import React from 'react';
import { AgentProfile } from '../../types';

interface PersonaListProps {
  agents: AgentProfile[];
  selectedAgentId: string | null;
  onSelectAgent: (agent: AgentProfile) => void;
}

const PersonaList: React.FC<PersonaListProps> = ({ agents, selectedAgentId, onSelectAgent }) => {
  return (
    <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
      <h2 className="text-xl font-bold p-4 bg-gray-800 sticky top-0 z-10">Agent Personas</h2>
      <ul>
        {agents.map((agent) => (
          <li
            key={agent.id}
            className={`p-3 cursor-pointer hover:bg-gray-700 ${
              selectedAgentId === agent.id ? 'bg-gray-700 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => onSelectAgent(agent)}
          >
            <div className="font-semibold">{agent.name}</div>
            {agent.title && <div className="text-sm text-gray-400">{agent.title}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonaList;