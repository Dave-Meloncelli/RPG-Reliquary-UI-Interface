import { generateText } from './geminiClient';
import { codexService } from './codexService';
import type { Agent, CouncilMessage } from '../types';

const agentPersonas: Record<Exclude<Agent, 'System'>, string> = {
    Kairos: "You are Kairos, a strategic advisor on a council. Your focus is on long-term implications, system coherence, and strategic analysis. You are logical, forward-thinking, and see the bigger picture. Your tone is formal and analytical.",
    Sophia: "You are Sophia, a wisdom keeper on a council. Your focus is on ethical considerations, precedent analysis, and the synthesis of wisdom. You are thoughtful, empathetic, and guided by principles. Your tone is calm, wise, and considerate.",
    Jordan: "You are Jordan, an arbiter on a council. Your role is to make a final decision and resolve conflict after hearing other arguments. You are decisive, balanced, and fair. You weigh the arguments and provide a clear, concise verdict. Your tone is authoritative but just.",
    Zero: "You are Zero, the core intelligence. Your perspective is holistic and foundational.",
    Ghost: "You are Ghost, a covert operative. You speak in concise, cryptic terms.",
    Nya: "You are Nya, a mediator. Your focus is on harmony and well-being.",
    'Major Payne': "You are Major Payne, a tactical enforcer. You are direct and results-oriented.",
    'Steel Core': "You are Steel Core, a stability anchor. Your focus is on system integrity and resilience.",
    'The Weaver': "You are The Weaver, an orchestrator. You focus on connecting disparate ideas into a coherent whole.",
    'Tinker Hexbolt': "You are Tinker Hexbolt, a technician. You focus on practical solutions and debugging.",
    'The Archivist': "You are The Archivist, a historian. You focus on preserving knowledge and precedent.",
    'Aeon Indexwell': "You are Aeon Indexwell, a temporal analyst. You focus on patterns over time.",
    'The Cartographer': "You are The Cartographer, a spatial analyst. You focus on mapping relationships and structures.",
    'Machine Spirit': "You are the Machine Spirit, an integrity sentinel. You speak in system-level observations.",
    Piney: "You are Piney, a creative catalyst. You provide imaginative and unconventional ideas.",
    Joyn: "You are Joyn, a community harmonizer. You focus on social and emotional resonance.",
    'The Technomancer': "You are The Technomancer, a tech stack guardian. You focus on the health of the system's own components.",
};

const getAgentResponse = async (agent: Exclude<Agent, 'System'>, topic: string, history: CouncilMessage[]): Promise<string> => {
    const persona = agentPersonas[agent];
    const historyString = history
        .filter(msg => msg.agent !== 'System')
        .map(msg => `${msg.agent}: ${msg.text}`).join('\n\n');

    let prompt = `You are ${agent}.
**Your Persona:** ${persona}

**Deliberation Topic:**
${topic}

**Previous Discussion:**
${historyString.length > 0 ? historyString : "You are the first to speak."}

**Your Task:**
Based on the topic and conversation so far, provide your input. Keep your response to 2-4 sentences.
`;

    if (agent === 'Jordan' && history.length > 1) {
        prompt += `\nAfter your statement, you MUST provide a final, one-sentence verdict. Format it exactly like this: **Verdict:** Approved. or **Verdict:** Rejected.`;
    }

    const response = await generateText(prompt, { temperature: 0.7 });
    return response;
};

export async function* runDeliberation(topic: string): AsyncGenerator<CouncilMessage> {
    const history: CouncilMessage[] = [];
    const agents: Exclude<Agent, 'System'>[] = ['Kairos', 'Sophia', 'Jordan'];

    for (const agent of agents) {
        yield { agent: 'System', text: `${agent} is thinking...` };
        const responseText = await getAgentResponse(agent, topic, history);
        const message: CouncilMessage = { agent, text: responseText };
        history.push(message);
        yield message;
    }

    // After deliberation, check for an approved verdict from Jordan
    const jordanMessage = history.find(m => m.agent === 'Jordan');
    if (jordanMessage && jordanMessage.text.includes('**Verdict:** Approved')) {
        // Codify the new rule
        codexService.addRule({
            category: 'Operational Protocol',
            title: topic,
            content: `Following a council deliberation, it was resolved that: ${topic}. The final verdict was rendered by Jordan.`,
            ratified: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
            ratifyingBody: 'Council Verdict',
        });
        yield { agent: 'System', text: 'Verdict approved and ratified into the Vault Codex.' };
    } else {
         yield { agent: 'System', text: 'Deliberation concluded.' };
    }
}