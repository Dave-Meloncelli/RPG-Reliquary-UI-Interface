import React, { useState, useEffect, useCallback, type FC } from 'react';
import type { N8nWorkflow, WorkflowRun } from '../types';

const StatusBadge: FC<{ status: WorkflowRun['status'] }> = ({ status }) => {
    const styles: Record<WorkflowRun['status'], string> = {
        Success: 'bg-green-500/20 text-green-300',
        Failed: 'bg-red-500/20 text-red-300',
        Running: 'bg-yellow-500/20 text-yellow-300 animate-pulse',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
};

const AutomationHubApp: React.FC = () => {
    const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
    const [runHistory, setRunHistory] = useState<Record<string, WorkflowRun[]>>({});
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = n8nService.subscribe(state => {
            setWorkflows(state.workflows);
            setRunHistory(state.runHistory);
            if (!selectedWorkflowId && state.workflows.length > 0) {
                setSelectedWorkflowId(state.workflows[0].id);
            }
        });
        return unsubscribe;
    }, [selectedWorkflowId]);
    
    const handleRunWorkflow = useCallback(() => {
        if (selectedWorkflowId) {
            n8nService.runWorkflow(selectedWorkflowId);
        }
    }, [selectedWorkflowId]);
    
    const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId);
    const selectedHistory = selectedWorkflowId ? (runHistory[selectedWorkflowId] || []).slice().reverse() : [];
    const isWorkflowRunning = selectedWorkflow ? selectedWorkflow.status === 'Running' : false;

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Automation Hub</h2>
                <p className="text-sm text-slate-400">Monitor and manage external automation workflows (N8N Simulation).</p>
            </div>

            <div className="flex-grow flex min-h-0">
                {/* --- Left Panel: Workflow Library --- */}
                <div className="w-1/3 min-w-[300px] p-4 border-r border-slate-700/50 flex flex-col gap-4">
                    <h3 className="text-md font-bold text-indigo-300">Workflow Library</h3>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                         {workflows.map(wf => (
                            <button
                                key={wf.id}
                                onClick={() => setSelectedWorkflowId(wf.id)}
                                className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                                    selectedWorkflowId === wf.id ? 'bg-indigo-600/50' : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-white truncate">{wf.name}</p>
                                    {wf.status === 'Running' && <StatusBadge status="Running" />}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{wf.description}</p>
                            </button>
                         ))}
                    </div>
                </div>

                {/* --- Right Panel: Details & History --- */}
                <div className="flex-grow p-4 flex flex-col">
                    {selectedWorkflow ? (
                        <>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex-shrink-0">
                                <h3 className="text-xl font-bold text-white">{selectedWorkflow.name}</h3>
                                <p className="text-sm text-slate-400 mt-1">{selectedWorkflow.description}</p>
                                <button
                                    onClick={handleRunWorkflow}
                                    disabled={isWorkflowRunning}
                                    className="w-full mt-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition"
                                >
                                    {isWorkflowRunning ? 'Running...' : 'Run Now'}
                                </button>
                            </div>
                            <h4 className="text-md font-bold text-indigo-300 mt-4 mb-2">Run History</h4>
                            <div className="flex-grow bg-black/30 rounded-md overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="sticky top-0 bg-slate-900/70 backdrop-blur-sm">
                                        <tr>
                                            <th className="p-2">Timestamp</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Duration</th>
                                            <th className="p-2">Logs</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {selectedHistory.map(run => (
                                            <tr key={run.id} className="hover:bg-slate-800/50">
                                                <td className="p-2 font-mono text-xs">{run.timestamp}</td>
                                                <td className="p-2"><StatusBadge status={run.status} /></td>
                                                <td className="p-2 font-mono text-xs">{run.durationMs}ms</td>
                                                <td className="p-2">
                                                    <button className="text-xs text-sky-400 hover:underline">View</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {selectedHistory.length === 0 && <p className="text-slate-500 text-center p-4">No run history for this workflow.</p>}
                            </div>
                        </>
                    ) : (
                         <div className="flex items-center justify-center h-full text-slate-500">
                            <p>Select a workflow to view its details and run history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AutomationHubApp;