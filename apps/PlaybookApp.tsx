
import React, { useState, useEffect, type FC } from 'react';
import { playbookService } from '../services/playbookService';
import type { Playbook } from '../types';

const PlaybookList: FC<{
    playbooks: Playbook[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}> = ({ playbooks, selectedId, onSelect }) => (
    <div className="bg-slate-900/50 p-2 rounded-lg space-y-2">
        {playbooks.map(pb => (
            <button
                key={pb.id}
                onClick={() => onSelect(pb.id)}
                className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                    selectedId === pb.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                }`}
            >
                <p className="font-bold">{pb.name}</p>
                <p className="text-xs opacity-80">{pb.description}</p>
            </button>
        ))}
    </div>
);

const PlaybookDetail: FC<{ playbook: Playbook | null }> = ({ playbook }) => {
    if (!playbook) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                <p>Select a playbook to view its details.</p>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            {playbook.steps.map((step, index) => (
                <div key={index} className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-white">{index + 1}. {step.name}</p>
                        <p className="text-sm text-indigo-300">
                            Agent: <span className="font-mono bg-slate-700 px-2 py-0.5 rounded">{step.agentId}</span>
                        </p>
                    </div>
                    <p className="text-sm text-slate-300 pl-2 border-l-2 border-indigo-500/50 whitespace-pre-wrap">
                        {step.prompt}
                    </p>
                </div>
            ))}
        </div>
    );
};

const PlaybookApp: React.FC = () => {
    const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = playbookService.subscribe(allPlaybooks => {
            setPlaybooks(allPlaybooks);
            // If current selection is gone, or if nothing is selected, select the first.
            if (!selectedPlaybookId || !allPlaybooks.some(p => p.id === selectedPlaybookId)) {
                setSelectedPlaybookId(allPlaybooks[0]?.id || null);
            }
        });
        return unsubscribe;
    }, [selectedPlaybookId]);
    
    const selectedPlaybook = playbooks.find(pb => pb.id === selectedPlaybookId) || null;

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Operation Playbook</h2>
                <p className="text-sm text-slate-400">A library of pre-defined multi-agent workflows (Operation Chains).</p>
            </div>
            <div className="flex-grow grid grid-cols-3 gap-4 p-4 min-h-0">
                <div className="col-span-1 overflow-y-auto pr-2">
                    <PlaybookList 
                        playbooks={playbooks} 
                        selectedId={selectedPlaybookId} 
                        onSelect={setSelectedPlaybookId}
                    />
                </div>
                <div className="col-span-2 overflow-y-auto pr-2">
                    <PlaybookDetail playbook={selectedPlaybook} />
                </div>
            </div>
        </div>
    );
};

export default PlaybookApp;