import { GoogleGenAI, Chat } from "@google/genai";
import { getPersonaProfile } from './personaService';
import type { ChatMessage } from '../types';

class ChatService {
    private ai: GoogleGenAI | null;
    private chatSessions: Map<string, Chat> = new Map();
    private chatHistories: Map<string, ChatMessage[]> = new Map();

    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY environment variable not set for ChatService.");
            this.ai = null;
            return;
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    private async initializeChat(agentId: string): Promise<Chat | null> {
        if (!this.ai) return null;

        const profile = getPersonaProfile(agentId);
        if (!profile) {
            console.error(`Could not find profile for agent ${agentId}`);
            return null;
        }

        const systemInstruction = profile.scrollContent || `You are ${profile.name}. Your capabilities include: ${profile.capabilities.join(', ')}.`;

        const chat = this.ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
        });

        this.chatSessions.set(agentId, chat);
        return chat;
    }

    public getChatHistory(agentId: string): ChatMessage[] {
        return this.chatHistories.get(agentId) || [];
    }

    public async *sendMessageStream(agentId: string, message: string): AsyncGenerator<string, void, unknown> {
        if (!this.ai) {
            yield "Error: Chat service is not initialized. Please configure your GEMINI_API_KEY.";
            return;
        }
        
        // Add user message to history, which is now done in the component to show it instantly.
        // We'll add it here too to ensure service-side history is complete.
        const userMessage: ChatMessage = { sender: 'user', text: message, timestamp: new Date().toLocaleTimeString() };
        const currentHistory = this.getChatHistory(agentId);
        this.chatHistories.set(agentId, [...currentHistory, userMessage]);

        let chat = this.chatSessions.get(agentId);
        if (!chat) {
            chat = await this.initializeChat(agentId);
        }

        if (!chat) {
             yield "Error: Could not initialize chat session.";
             return;
        }

        try {
            const responseStream = await chat.sendMessageStream({ message });
            let fullResponse = "";
            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                fullResponse += chunkText;
                yield chunkText;
            }

            // After stream is done, add full agent response to history
            const agentMessage: ChatMessage = { sender: 'agent', text: fullResponse, timestamp: new Date().toLocaleTimeString() };
            this.chatHistories.set(agentId, [...this.getChatHistory(agentId), agentMessage]);

        } catch (error) {
            console.error(`Gemini API error for agent ${agentId}:`, error);
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            yield errorMessage;
            const agentErrorMessage: ChatMessage = { sender: 'agent', text: errorMessage, timestamp: new Date().toLocaleTimeString() };
            // Replace the placeholder user message with the error
            const historyWithoutUserMsg = this.getChatHistory(agentId).slice(0, -1);
            this.chatHistories.set(agentId, [...historyWithoutUserMsg, agentErrorMessage]);
        }
    }
}

export const chatService = new ChatService();