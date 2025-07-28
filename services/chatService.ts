import { getPersonaProfile } from './personaService';
import { generateText } from './geminiClient';
import type { ChatMessage } from '../types';

class ChatService {
    private chatHistories: Map<string, ChatMessage[]> = new Map();

    constructor() {}

    public getChatHistory(agentId: string): ChatMessage[] {
        return this.chatHistories.get(agentId) || [];
    }

    public async *sendMessageStream(agentId: string, message: string): AsyncGenerator<string, void, unknown> {
        const userMessage: ChatMessage = { sender: 'user', text: message, timestamp: new Date().toLocaleTimeString() };
        const currentHistory = this.getChatHistory(agentId);
        this.chatHistories.set(agentId, [...currentHistory, userMessage]);

        const profile = getPersonaProfile(agentId);
        if (!profile) {
            yield 'Error: could not load profile.';
            return;
        }

        const systemInstruction = profile.scrollContent || `You are ${profile.name}. Your capabilities include: ${profile.capabilities.join(', ')}.`;

        try {
            const fullResponse = await generateText(message, { systemInstruction });
            const agentMessage: ChatMessage = { sender: 'agent', text: fullResponse, timestamp: new Date().toLocaleTimeString() };
            this.chatHistories.set(agentId, [...this.getChatHistory(agentId), agentMessage]);
            yield fullResponse;
        } catch (error) {
            console.error(`Gemini API error for agent ${agentId}:`, error);
            const errorMessage = 'Sorry, I encountered an error. Please try again.';
            const historyWithoutUserMsg = this.getChatHistory(agentId).slice(0, -1);
            this.chatHistories.set(agentId, [...historyWithoutUserMsg, { sender: 'agent', text: errorMessage, timestamp: new Date().toLocaleTimeString() }]);
            yield errorMessage;
        }
    }
}

export const chatService = new ChatService();