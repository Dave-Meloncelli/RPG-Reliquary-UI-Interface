import React, { useState, useMemo, type FC, useEffect } from 'react';
import { codexService } from '../services/codexService';
import type { CodexRule } from '../types';

const RuleList: FC<{ 
    rules: Record<string, CodexRule[]>;
    selectedId: string | null; 
    onSelect: (id: string) => void;
}> = ({ rules, selectedId, onSelect }) => (
    <div className="space-y-4">
        {Object.entries(rules).map(([category, ruleList]) => (
            <div key={category}>
                <h3 className="text-sm font-bold uppercase text-indigo-300 tracking-wider px-3 pb-2 border-b border-slate-700/50">{category}</h3>
                <div className="mt-2 space-y-1">
                    {ruleList.map(rule => (
                        <button
                            key={rule.id}
                            onClick={() => onSelect(rule.id)}
                            className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                                selectedId === rule.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
                            }`}
                        >
                            <p className="font-semibold text-sm">{rule.title}</p>
                            <p className="text-xs text-slate-400">{rule.id}</p>
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const RuleDetail: FC<{ rule: CodexRule | null }> = ({ rule }) => {
    if (!rule) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                <p>Select a rule from the codex to view its details.</p>
            </div>
        );
    }
    return (
        <div className="p-4 bg-slate-800/50 rounded-lg h-full">
            <h2 className="text-xl font-bold text-white mb-1">{rule.title}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pb-2 border-b border-slate-700">
                <span>ID: <span className="font-mono text-cyan-400">{rule.id}</span></span>
                <span>Ratified: <span className="font-mono text-cyan-400">{rule.ratified}</span></span>
                <span>Body: <span className="font-mono text-cyan-400">{rule.ratifyingBody}</span></span>
            </div>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {rule.content}
            </p>
        </div>
    );
};

const CodexApp: React.FC = () => {
    const [rules, setRules] = useState<CodexRule[]>([]);
    const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = codexService.subscribe(setRules);
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Auto-select the first rule when the list is populated
        if (!selectedRuleId && rules.length > 0) {
            setSelectedRuleId(rules[0].id);
        }
    }, [rules, selectedRuleId]);

    const groupedRules = useMemo(() => {
        return rules.reduce((acc, rule) => {
            (acc[rule.category] = acc[rule.category] || []).push(rule);
            return acc;
        }, {} as Record<string, CodexRule[]>);
    }, [rules]);

    const selectedRule = rules.find(r => r.id === selectedRuleId) || null;

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Vault Codex</h2>
                <p className="text-sm text-slate-400">The official library of system laws, directives, and protocols.</p>
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-0">
                <div className="col-span-1 overflow-y-auto pr-2 bg-slate-900/40 rounded-lg p-2">
                    <RuleList
                        rules={groupedRules}
                        selectedId={selectedRuleId}
                        onSelect={setSelectedRuleId}
                    />
                </div>
                <div className="col-span-2 overflow-y-auto">
                    <RuleDetail rule={selectedRule} />
                </div>
            </div>
        </div>
    );
};

export default CodexApp;
