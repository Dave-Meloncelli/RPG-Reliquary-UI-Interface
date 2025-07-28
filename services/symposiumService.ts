import { generateText } from './geminiClient';
import type { AgentProfile, SymposiumMessage } from '../types';

const SUMMARIZATION_AGENT_ID = 'agent-jordan';

const generateAgentPrompt = (agent: AgentProfile, topic: string, history: SymposiumMessage[]): string => {
    const historyString = history
        .map(msg => `${msg.agentName}: ${msg.text}`)
        .join('\n\n');
    
    // Simplified persona from capabilities
    const persona = `You are ${agent.name}. Your expertise includes: ${agent.capabilities.join(', ')}. You are participating in a symposium.`;

    return `
**Your Persona:** ${persona}

**Symposium Topic:**
${topic}

**Previous Discussion:**
${historyString.length > 0 ? historyString : "You are the first to speak."}

**Your Task:**
Based on your persona, the topic, and the conversation so far, provide your input. Keep your response to 2-4 sentences. Be insightful and stay in character. Do not repeat points already made unless you are building on them in a significant way.
`;
};

const generateSummaryPrompt = (topic: string, history: SymposiumMessage[]): string => {
    const historyString = history
        .map(msg => `${msg.agentName}: ${msg.text}`)
        .join('\n\n');

    return `
You are Jordan, an arbiter agent. Your role is to provide a concise, neutral summary of a discussion.

**Symposium Topic:**
${topic}

**Full Discussion Transcript:**
${historyString}

**Your Task:**
Synthesize the key arguments and outcomes from the discussion into a 2-3 sentence summary.
`;
};

const getAiResponse = async (prompt: string): Promise<string> => {
    const response = await generateText(prompt, { temperature: 0.8 });
    if(response.startsWith('Error:')) {
        return `Error: AI processing failed.`;
    }
    return response.trim();
};

export async function* runSymposium(topic: string, participants: AgentProfile[]): AsyncGenerator<SymposiumMessage> {
    const history: SymposiumMessage[] = [];

    // Main discussion
    for (const agent of participants) {
        // Skip the summarizer in the main discussion if they are also a participant and not the only one
        if (agent.id === SUMMARIZATION_AGENT_ID && participants.length > 1) continue;

        const prompt = generateAgentPrompt(agent, topic, history);
        const responseText = await getAiResponse(prompt);
        const message: SymposiumMessage = { 
            agentId: agent.id, 
            agentName: agent.name, 
            agentIcon: agent.icon,
            text: responseText 
        };
        history.push(message);
        yield message;
    }
    
    // A single participant talks to themselves, no summary needed.
    if (participants.length <= 1) {
        return;
    }

    // Summarization step - find the designated summarizer, even if they didn't speak.
    const summarizer = participants.find(p => p.id === SUMMARIZATION_AGENT_ID) 
        || participants.find(p => p.id === 'agent-jordan'); // fallback just in case
        
    if (summarizer) {
        const summaryPrompt = generateSummaryPrompt(topic, history);
        const summaryText = await getAiResponse(summaryPrompt);
        const summaryMessage: SymposiumMessage = {
            agentId: summarizer.id,
            agentName: summarizer.name,
            agentIcon: summarizer.icon,
            text: summaryText,
            isSummary: true,
        };
        yield summaryMessage;
    }
}

export const symposiumConfig = {
  maxParticipants: 6,
  summarizationAgentId: SUMMARIZATION_AGENT_ID,
  topicRouting: {
    'rpg': ['agent-az85', 'agent-az82'],
    'technical': ['agent-codex', 'agent-architect'],
    'strategic': ['agent-kairos', 'agent-sophia'],
    'book': ['agent-az86', 'agent-az81'],
    'market': ['agent-az82', 'agent-az84'],
    'security': ['agent-erdu', 'agent-architect'],
    'rules': ['agent-jordan', 'agent-sophia'],
    'law': ['agent-jordan', 'agent-sophia'],
    'price': ['agent-az84', 'agent-az82'],
  }
};
