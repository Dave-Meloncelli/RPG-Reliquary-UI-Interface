// components/PersonaViewerApp.tsx
import React, { useState, useEffect } from "react";

import { getPersonaProfiles } from "../services/personaService";
import { AgentProfile } from "../types";

import PersonaDetail from "./persona/PersonaDetail"; // Import the new PersonaDetail component
import PersonaList from "./persona/PersonaList"; // Import the new PersonaList component

const PersonaViewerApp: React.FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);

  useEffect(() => {
    // Fetch persona profiles when the component mounts
    const profiles = getPersonaProfiles();
    setAgents(profiles);
    if (profiles.length > 0) {
      setSelectedAgent(profiles[0]); // Select the first agent by default
    }

    // Future: event bus subscription logic would go here
  }, []);

  const handleAgentSelect = (agent: AgentProfile) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="flex h-full bg-gray-900 text-gray-100">
      <PersonaList
        agents={agents}
        selectedAgentId={selectedAgent?.id || null}
        onSelect={handleAgentSelect}
      />
      <PersonaDetail agent={selectedAgent} />
    </div>
  );
};

export default PersonaViewerApp;
