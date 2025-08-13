// components/persona/PersonaDetail.tsx
import React from 'react';
import { AgentProfile } from '../../types';

interface PersonaDetailProps {
  agent: AgentProfile | null;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ agent }) => {
  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select an agent from the list to view their persona details.
      </div>
    );
  }

  return (
    <div className="w-2/3 p-6 overflow-y-auto">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4">{agent.name}</h1>
        {agent.title && <h2 className="text-xl text-gray-400 mb-2">Title: {agent.title}</h2>}
        {agent.class && <p className="text-lg mb-1"><strong>Class:</strong> {agent.class}</p>}
        {agent.role && <p className="text-lg mb-4"><strong>Vault Role:</strong> {agent.role}</p>}

        {agent.scrollContent ? (
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: agent.scrollContent }}
          />
        ) : (
          <p className="text-gray-500">No detailed scroll content available for this persona.</p>
        )}
      </div>
    </div>
  );
};

export default PersonaDetail;