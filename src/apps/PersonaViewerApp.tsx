import React, { useState, useEffect, type FC } from "react";

import PersonaDetail from "../components/persona/PersonaDetail";
import PersonaList from "../components/persona/PersonaList";
import { getPersonaProfiles } from "../services/personaService";
import type { AgentProfile } from "../types";

const PersonaViewerApp: FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);

  useEffect(() => {
    const profiles = getPersonaProfiles();
    setAgents(profiles);
    if (profiles.length > 0) {
      setSelectedAgent(profiles[0]);
    }
  }, []);

  const handleSelectAgent = (agent: AgentProfile) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="flex h-full bg-slate-900/80 text-slate-200 font-sans">
      <PersonaList
        agents={agents}
        selectedAgentId={selectedAgent?.id || null}
        onSelect={handleSelectAgent}
      />
      <PersonaDetail agent={selectedAgent} />
    </div>
  );
};

export default PersonaViewerApp;
