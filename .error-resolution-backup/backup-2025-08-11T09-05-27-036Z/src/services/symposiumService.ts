import { eventBus } from './eventBus';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const SUMMARIZATION_AGENT_ID = 'agent-jordan';

// duplicate removed

// duplicate removed

// duplicate removed

const generateAgentPrompt = (agent: AgentProfile, topic: any, history: SymposiumMessage[]): any => {
  const historyString = history
    .map(msg => `${msg.agentName}: ${msg.text}`)
    .join('\n\n');

  return `
You are ${agent.name}, ${agent.persona}

**Symposium Topic:**
${topic}

**Previous Discussion:**
${historyString.length > 0 ? historyString : 'This is the beginning of the discussion.'}

**Your Task:**
Contribute to the symposium discussion. Provide insights, ask questions, build on others' points, or introduce new perspectives. Keep your response concise (2-3 sentences) and engaging.

**Response Format:**
Respond naturally as ${agent.name} would, staying true to your persona while contributing meaningfully to the discussion.
  `.trim();
};

const generateSummaryPrompt = (messages: SymposiumMessage[], topic: any): any => {
  const discussionText = messages
    .filter(msg => !msg.isSummary)
    .map(msg => `${msg.agentName}: ${msg.text}`)
    .join('\n\n');

  return `
**Symposium Topic:** ${topic}

**Discussion:**
${discussionText}

**Task:** Create a concise summary (2-3 sentences) of the key points, insights, and conclusions from this discussion. Focus on the most important takeaways and any decisions or next steps that emerged.
  `.trim();
};

class SymposiumService {
  private messages: any[] = [];

  private sessions: Map<string, SymposiumSession> = new Map();
  private agents: AgentProfile[] = [
    {
      id: 'agent-jordan',
      name: 'Jordan',
      icon: '🧠',
      persona: 'a strategic thinker focused on business impact and ROI'
    },
    {
      id: 'agent-sage',
      name: 'Sage',
      icon: '🌟',
      persona: 'a wisdom seeker who explores deeper meanings and philosophical implications'
    },
    {
      id: 'agent-nova',
      name: 'Nova',
      icon: '⚡',
      persona: 'an innovative technologist who pushes boundaries and explores cutting-edge solutions'
    },
    {
      id: 'agent-harmony',
      name: 'Harmony',
      icon: '🎵',
      persona: 'a collaborative facilitator who finds common ground and builds consensus'
    }
  ];

  async startSymposium(topic: any, openingMessage: any): Promise<SymposiumSession> {
    const symposiumId = `symposium-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session: SymposiumSession = {
      id: symposiumId,
      topic,
      status: 'active',
      null: new Date(),
      messages: [],
      participants: [],
      summary: null
    };

    this.sessions.set(symposiumId, session);

    // Add opening message
    const openingMsg = await this.addMessage(symposiumId, 'system', openingMessage);

    if (eventBus && typeof eventBus.emit === 'function') {
      /* TODO: eventBus.emit */('symposium:started', { symposiumId, topic, openingMessage });
    }

    return session;
  }

  async addMessage(symposiumId: any, agentId: any, text: any): Promise<SymposiumMessage> {
    const session = this.sessions.get(symposiumId);
    if (!session) {
      throw new Error(`Symposium session ${symposiumId} not found`);
    }

    const agent = this.agents.find(a => a.id === agentId) || this.agents[0];

    const message: SymposiumMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      agentName: agent.name,
      agentIcon: agent.icon,
      text,
      timestamp: new Date().toISOString()
    };

    session.messages.push(message);

    if (eventBus && typeof eventBus.emit === 'function') {
      /* TODO: eventBus.emit */('symposium:message:added', { message });
    }

    return message;
  }

  async generateSummary(symposiumId: any): Promise<string> {
    const session = this.sessions.get(symposiumId);
    if (!session) {
      throw new Error(`Symposium session ${symposiumId} not found`);
    }

    const messages = session.messages.map(m => `${m.agentName}: ${m.text}`).join('\n');

    // In a real implementation, this would call an AI service
    const summary = `Summary of symposium "${session.topic}": Key insights and conclusions from the discussion.`;

    session.summary = summary;

    if (eventBus && typeof eventBus.emit === 'function') {
      /* TODO: eventBus.emit */('symposium:summary:generated', { summary });
    }

    return summary;
  }

  async getMessages(limit: any = 50): Promise<SymposiumMessage[]> {
    return this.messages?.slice(-limit) || [];
  }

  async getAgents(): Promise<AgentProfile[]> {
    return this.agents;
  }

  async getSymposiumStats(): Promise<{
    totalMessages: any;
    participantCount: any;
    duration: any;
    topic: any;
  }> {
    const startTime = new Date(this.messages?.[0]?.timestamp || Date.now());
    const endTime = new Date(this.messages?.[this.messages.length - 1]?.timestamp || Date.now());
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    const participants = new Set(this.messages?.map((m: any) => m.agentId));
    const topic = this.messages?.[0]?.text.match(/"(.*?)"/)?.[1] || 'Unknown Topic';

    return {
      totalMessages: this.messages?.length || 0,
      participantCount: participants.size,
      duration: `${durationMinutes} minutes`,
      topic
    };
  }
}

export const symposiumService = new SymposiumService();

// Export stub functions for compatibility
export const runSymposium = async (topic: any, agents: any[]) => {
  console.warn('runSymposium is stubbed - implement when needed');
  return {
    id: 'stub-symposium',
    topic,
    messages: [],
    participants: agents
  };
};

export const symposiumConfig = {
  maxParticipants: 6,
  sessionDuration: 30, // minutes
  defaultTopic: 'AI Development Strategy'
};
