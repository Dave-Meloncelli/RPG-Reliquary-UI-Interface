import React, { type FC } from 'react';
import type { AgentProfile } from '../../types';

interface PersonaDetailProps {
    agent: AgentProfile | null;

  title?: any;
  title?: any;
  class?: any;
  class?: any;
  role?: any;
  role?: any;
  scrollContent?: any;}

// A simple markdown-to-html converter for basic formatting
const renderMarkdown = (text: string = '') => {
    return text
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-indigo-300 mt-6 mb-3">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-yellow-300">$1</strong>')
        .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
        .replace(/\n/g, '<br />');
};


const PersonaDetail: FC<PersonaDetailProps> = ({ agent }) => {
    if (!agent) {
        return (
            <div className="w-2/3 flex items-center justify-center text-slate-500 p-4">
                <p>Select a persona from the list to view their details.</p>
            </div>
        );
    }

    return (
        <div className="w-2/3 p-6 overflow-y-auto">
            <div className="bg-slate-800/50 p-4 rounded-lg mb-4 border border-slate-700">
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                {agent.title && <p className="text-lg text-indigo-300">{agent.title}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                    {agent.class && <span>Class: <span className="font-semibold text-slate-300">{agent.class}</span></span>}
                    {agent.role && <span>Role: <span className="font-semibold text-slate-300">{agent.role}</span></span>}
                </div>
            </div>

            <div 
                className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(agent.scrollContent) }}
            />
        </div>
    );
};

export default PersonaDetail;
