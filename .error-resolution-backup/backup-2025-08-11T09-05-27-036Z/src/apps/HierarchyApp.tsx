import React, { type FC } from 'react';
import { getAgentHierarchy } from '../services/hierarchyService';
import type { AgentRelationshipNode } from '../types';

const NODE_TYPE_STYLES = {
    primary: 'border-indigo-500 bg-indigo-500/10 text-indigo-300',
    subordinate: 'border-cyan-500 bg-cyan-500/10 text-cyan-300',
    sidekick: 'border-yellow-500 bg-yellow-500/10 text-yellow-300',
};

const AgentNode: FC<{ node: AgentRelationshipNode }> = ({ node }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center">
            {/* Agent Card */}
            <div className={`relative flex flex-col items-center p-3 border-2 rounded-lg shadow-lg min-w-[180px] ${NODE_TYPE_STYLES[node.type]}`}>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex-shrink-0 bg-slate-700 rounded-md flex items-center justify-center text-white">
                        <node.icon />
                    </div>
                    <p className="font-bold text-white text-sm">{node.name}</p>
                </div>
                <p className="text-xs capitalize mt-1">{node.type}</p>
            </div>

            {/* Children Section */}
            {hasChildren && (
                <>
                    {/* Vertical line down from parent */}
                    <div className="w-px h-6 bg-slate-600"></div>
                    <div className="flex justify-center items-start gap-4">
                        {node.children.map(child => (
                             <div key={child.id} className="relative flex flex-col items-center">
                                {/* Horizontal line to children */}
                                <div className="absolute top-0 left-1/2 w-full h-px -translate-x-1/2 bg-slate-600"></div>
                                {/* Vertical line to child */}
                                <div className="absolute top-0 left-1/2 w-px h-6 -translate-x-1/2 bg-slate-600"></div>
                                <div className="mt-6">
                                    <AgentNode node={child} />
                                </div>
                             </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const HierarchyApp: React.FC = () => {
    const hierarchy = getAgentHierarchy();
    
    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Command Hierarchy</h2>
                <p className="text-sm text-slate-400">Visual representation of agent relationships and delegations.</p>
            </div>
            <div className="flex-grow p-8 overflow-auto">
                <div className="flex justify-center items-start gap-8">
                    {hierarchy.map(rootNode => (
                        <AgentNode key={rootNode.id} node={rootNode} />
                    ))}
                </div>
                 {!hierarchy.length && (
                    <div className="text-center text-slate-500">
                        No command structure defined.
                    </div>
                 )}
            </div>
        </div>
    );
};

export default HierarchyApp;
