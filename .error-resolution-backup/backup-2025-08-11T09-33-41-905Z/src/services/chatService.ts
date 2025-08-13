import type { ChatMessage } from "../types/types";

class ChatService {
    private chatHistories: Map<string, ChatMessage[]> = new Map();

    constructor() {
        console.warn('ChatService is using stub implementation');
    }

    public getChatHistory(agentId: string): ChatMessage[] {
        return this.chatHistories.get(agentId) || [];
    }

    public async *sendMessageStream(agentId: string, message: string): AsyncGenerator<string, void, unknown> {
        console.warn('sendMessageStream is stubbed - implement when needed');
        
        const userMessage: ChatMessage = { 
            id: 'msg-' + Date.now(),
            sender: 'user', 
            content: message, 
            timestamp: new Date(),
            type: 'text'
        };
        
        const currentHistory = this.chatHistories.get(agentId) || [];
        this.chatHistories.set(agentId, [...currentHistory, userMessage]);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const responses = [
            `Hello! I received your message: "${message}". This is a mock response.`,
            `I'm an AI assistant (${agentId}) and currently using a stub implementation.`,
            `Please configure the Gemini API key to enable full functionality.`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Simulate streaming response
        const words = response.split(' ');
        let fullResponse = '';
        
        for (const word of words) {
            fullResponse += (fullResponse ? ' ' : '') + word;
            yield word + ' ';
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const agentMessage: ChatMessage = { 
            id: 'msg-' + Date.now() + '-agent',
            sender: agentId, 
            content: fullResponse.trim(), 
            timestamp: new Date(),
            type: 'text'
        };
        
        this.chatHistories.set(agentId, [...this.getChatHistory(agentId), agentMessage]);
    }
}

export const chatService = new ChatService();
