import React, { useState, useEffect, useCallback, type FC } from 'react';
import { getInitialAgentData } from '../services/agentData';
import { runSymposium, symposiumConfig } from '../services/symposiumService';
import type { AgentProfile, SymposiumMessage } from '../types';

const AgentSelector: FC<{
    agents: AgentProfile[];
    selected: string[];
    onChange: (id: string) => void;
    suggested: string[];
    disabled: boolean;
}> = ({ agents, selected, onChange, suggested, disabled }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {agents.map(agent => (
            <label key={agent.id} className={`flex items-center gap-2 p-2 rounded-md transition-colors ${selected.includes(agent.id) ? 'bg-indigo-600/50' : 'bg-slate-800 hover:bg-slate-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                    type="checkbox"
                    checked={selected.includes(agent.id)}
                    onChange={() => onChange(agent.id)}
                    disabled={disabled}
                    className="form-checkbox h-4 w-4 bg-slate-700 border-slate-500 text-indigo-500 rounded focus:ring-indigo-400"
                />
                <agent.icon />
                <span className="font-semibold">{agent.name}</span>
                {suggested.includes(agent.id) && <span className="text-xs text-yellow-400 ml-auto">(Suggested)</span>}
            </label>
        ))}
    </div>
);

const MessageBubble: FC<{ msg: SymposiumMessage }> = ({ msg }) => (
    <div className={`flex items-start gap-3 w-full ${msg.isSummary ? 'justify-center' : ''}`}>
        {!msg.isSummary && (
            <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-white">
                <msg.agentIcon />
            </div>
        )}
        <div className={`rounded-lg p-3 max-w-xl ${msg.isSummary ? 'bg-slate-900 border border-yellow-500/30 w-full' : 'bg-slate-800 shadow-lg'}`}>
            <p className={`font-bold text-sm mb-1 ${msg.isSummary ? 'text-yellow-400' : 'text-cyan-400'}`}>
                {msg.isSummary ? `Summary by ${msg.agentName}` : msg.agentName}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
        </div>
    </div>
);

const SymposiumApp: React.FC = () => {
    const [allAgents, setAllAgents] = useState<AgentProfile[]>([]);
    const [topic, setTopic] = useState('');
    const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
    const [suggestedAgentIds, setSuggestedAgentIds] = useState<string[]>([]);
    const [messages, setMessages] = useState<SymposiumMessage[]>([]);
    const [isDiscussing, setIsDiscussing] = useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAllAgents(getInitialAgentData());
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const keywords = topic.toLowerCase().split(' ');
        const suggestions = new Set<string>();
        for (const [key, agentIds] of Object.entries(symposiumConfig.topicRouting)) {
            if (keywords.some(kw => kw.includes(key))) {
                agentIds.forEach(id => suggestions.add(id));
            }
        }
        setSuggestedAgentIds(Array.from(suggestions));
    }, [topic]);

    const handleAgentSelection = (agentId: string) => {
        setSelectedAgentIds(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(agentId)) {
                newSelection.delete(agentId);
            } else {
                if (newSelection.size < symposiumConfig.maxParticipants) {
                    newSelection.add(agentId);
                }
            }
            return Array.from(newSelection);
        });
    };
    
    const startDiscussion = useCallback(async () => {
        if (!topic.trim() || selectedAgentIds.length === 0 || isDiscussing) return;
        
        setIsDiscussing(true);
        setMessages([]);
        
        const participants = allAgents.filter(agent => selectedAgentIds.includes(agent.id));
        
        const discussionGenerator = runSymposium(topic, participants);
        for await (const message of discussionGenerator) {
            setMessages(prev => [...prev, message]);
        }
        
        setIsDiscussing(false);
    }, [topic, selectedAgentIds, allAgents, isDiscussing]);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Symposium</h2>
                <p className="text-sm text-slate-400">Facilitate multi-agent discussions on any topic.</p>
            </div>

            <div className="flex-grow flex min-h-0">
                {/* --- Config Panel --- */}
                <div className="w-1/3 min-w-[300px] p-4 border-r border-slate-700/50 flex flex-col gap-4 overflow-y-auto">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-bold mb-2">1. Propose a Topic</label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., The ethics of autonomous agents"
                            disabled={isDiscussing}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">2. Select Participants ({selectedAgentIds.length}/{symposiumConfig.maxParticipants})</label>
                        <AgentSelector
                            agents={allAgents}
                            selected={selectedAgentIds}
                            onChange={handleAgentSelection}
                            suggested={suggestedAgentIds}
                            disabled={isDiscussing}
                        />
                    </div>
                    <div className="mt-auto">
                        <button
                            onClick={startDiscussion}
                            disabled={!topic.trim() || selectedAgentIds.length === 0 || isDiscussing}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition"
                        >
                            {isDiscussing ? 'Discussion in Progress...' : 'Start Symposium'}
                        </button>
                    </div>
                </div>

                {/* --- Discussion Panel --- */}
                <div className="flex-grow p-4 overflow-y-auto flex flex-col items-center">
                    <div className="w-full space-y-4">
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} msg={msg} />
                        ))}
                    </div>
                    {!isDiscussing && messages.length === 0 && (
                        <div className="m-auto text-center text-slate-500">
                            <p className="text-lg">The discussion will appear here.</p>
                            <p>Complete the setup and start the symposium.</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default SymposiumApp;