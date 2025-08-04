import React, { useState, useEffect, useCallback, useRef, type FC } from 'react';
import { getPersonaProfiles } from '../services/personaService';
import { chatService } from '../services/chatService';
import type { AgentProfile, ChatMessage } from '../types';

// Agent List Component
const AgentChatList: FC<{ agents: AgentProfile[]; selectedAgentId: string | null; onSelect: (agent: AgentProfile) => void; disabled: boolean }> = ({ agents, selectedAgentId, onSelect, disabled }) => (
    <div className="w-1/3 min-w-[250px] border-r border-slate-700/50 flex flex-col bg-slate-900/50">
        <h2 className="text-lg font-bold p-3 bg-slate-900/70 border-b border-slate-700/50 text-white flex-shrink-0">
            Companions
        </h2>
        <ul className="overflow-y-auto">
            {agents.map(agent => (
                <li key={agent.id}>
                    <button
                        onClick={() => onSelect(agent)}
                        disabled={disabled}
                        className={`w-full text-left p-3 flex items-center gap-3 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                            selectedAgentId === agent.id 
                                ? 'bg-indigo-600/30 border-l-4 border-indigo-500' 
                                : 'border-l-4 border-transparent hover:bg-slate-800/50'
                        }`}
                    >
                        <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-white"><agent.icon /></div>
                        <div>
                            <p className="font-bold text-white">{agent.name}</p>
                            <p className="text-xs text-slate-400 truncate">{agent.title || agent.role}</p>
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

// Message Component
const MessageBubble: FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 max-w-xl text-sm leading-relaxed shadow-md ${
                isUser ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};

// Main App Component
const CompanionChatApp: React.FC = () => {
    const [agents, setAgents] = useState<AgentProfile[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const profiles = getPersonaProfiles();
        setAgents(profiles);
        if (profiles.length > 0) {
            // Automatically select the first agent if none is selected
            setSelectedAgent(prev => prev || profiles[0]);
        }
    }, []);

    useEffect(() => {
        if (selectedAgent) {
            setMessages(chatService.getChatHistory(selectedAgent.id));
        }
    }, [selectedAgent]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectAgent = (agent: AgentProfile) => {
        if (!isStreaming) {
            setSelectedAgent(agent);
        }
    };
    
    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedAgent || isStreaming) return;

        const userMessage: ChatMessage = { sender: 'user', text: input, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsStreaming(true);

        const agentResponsePlaceholder: ChatMessage = { sender: 'agent', text: '', timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, agentResponsePlaceholder]);

        const stream = chatService.sendMessageStream(selectedAgent.id, currentInput);
        
        for await (const chunk of stream) {
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.sender === 'agent') {
                    // Update the last message (the placeholder) with the new chunk
                    return [...prev.slice(0, -1), { ...lastMessage, text: lastMessage.text + chunk }];
                }
                return prev; // Should not happen in normal flow
            });
        }
        
        setIsStreaming(false);
    }, [input, selectedAgent, isStreaming]);

    return (
        <div className="flex h-full bg-slate-900/80 text-slate-200 font-sans">
            <AgentChatList 
                agents={agents}
                selectedAgentId={selectedAgent?.id || null}
                onSelect={handleSelectAgent}
                disabled={isStreaming}
            />
            <div className="flex-grow flex flex-col">
                {selectedAgent ? (
                    <>
                        <div className="p-3 border-b border-slate-700/50 bg-slate-900 flex items-center gap-3">
                             <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-white"><selectedAgent.icon /></div>
                             <div>
                                <p className="font-bold text-white">{selectedAgent.name}</p>
                                <p className="text-xs text-slate-400">{selectedAgent.title}</p>
                             </div>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, index) => (
                                <MessageBubble key={`${selectedAgent.id}-${index}`} message={msg} />
                            ))}
                             {isStreaming && messages[messages.length - 1]?.sender === 'agent' && (
                                <div className="flex items-start gap-3 justify-start">
                                    <div className="rounded-lg p-3 max-w-xl text-sm leading-relaxed bg-slate-700">
                                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-slate-700/50 bg-slate-900">
                             <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`Message ${selectedAgent.name}...`}
                                    disabled={isStreaming}
                                    className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    aria-label="Chat message input"
                                />
                                <button type="submit" disabled={!input.trim() || isStreaming} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 text-white font-bold p-2 rounded-md transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L11.25 9.25v1.5L4.643 12.02a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L16.25 12.25a.75.75 0 000-1.5L3.105 2.289z" /></svg>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-slate-500">
                        <p>Select a companion to begin a conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanionChatApp;