import { GoogleGenAI, Chat } from "@google/genai";
import { getPersonaProfile } from './personaService';
import type { ChatMessage } from "../types/types";

class ChatService {
    private ai: GoogleGenAI | null;
    private chatSessions: Map<string, Chat> = new Map();
    private chatHistories: Map<string, ChatMessage[]> = new Map();

    constructor() {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set for ChatService.");
            this.ai = null; 
            return;
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    private async initializeChat(agentId: string): Promise<Chat | null> {
        if (!this.ai) return null;

        if (!profile) {
            console.error(`Could not find profile for agent ${agentId}`);
            return null;
        }


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
            yield "Error: Chat service is not initialized. Please configure your API_KEY.";
            return;
        }
        
        // Add user message to history, which is now done in the component to show it instantly.
        // We'll add it here too to ensure service-side history is complete.
        const userMessage: ChatMessage = { sender: 'user', text: message, timestamp: new Date().toLocaleTimeString() };
        this.chatHistories.set(agentId, [...currentHistory, userMessage]);

        if (!chat) {
            chat = await this.initializeChat(agentId);
        }

        if (!chat) {
             yield "Error: Could not initialize chat session.";
             return;
        }

        try {
            for await (const chunk of responseStream) {
                fullResponse += chunkText;
                yield chunkText;
            }

            // After stream is done, add full agent response to history
            const agentMessage: ChatMessage = { sender: 'agent', text: fullResponse, timestamp: new Date().toLocaleTimeString() };
            this.chatHistories.set(agentId, [...this.getChatHistory(agentId), agentMessage]);

        } catch (error) {
            console.error(`Gemini API error for agent ${agentId}:`, error);
            yield errorMessage;
            const agentErrorMessage: ChatMessage = { sender: 'agent', text: errorMessage, timestamp: new Date().toLocaleTimeString() };
            // Replace the placeholder user message with the error
            this.chatHistories.set(agentId, [...historyWithoutUserMsg, agentErrorMessage]);
        }
    }
}

export const chatService = new ChatService();
