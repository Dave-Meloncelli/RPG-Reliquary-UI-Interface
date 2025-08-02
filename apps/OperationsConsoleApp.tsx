
import React, { useState, useEffect, useCallback, type FC } from 'react';
import { playbookService } from '../services/playbookService';
import { operationService } from '../services/operationService';
import type { Playbook, OperationProgress, OperationStep } from '../types';

const StatusIcon: FC<{ status: OperationStep['status'] }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
        case 'complete':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        case 'error':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
        default:
             return <div className="w-5 h-5 flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div></div>
    }
}

const OperationsConsoleApp: React.FC = () => {
    const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(null);
    const [progress, setProgress] = useState<OperationProgress | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const unsubscribePlaybooks = playbookService.subscribe(allPlaybooks => {
            setPlaybooks(allPlaybooks);
            if (!selectedPlaybookId && allPlaybooks.length > 0) {
                setSelectedPlaybookId(allPlaybooks[0].id);
            }
        });
        
        const unsubscribeOps = operationService.subscribe(opProgress => {
            setProgress(opProgress);
            if (opProgress.isComplete || opProgress.error) {
                setIsRunning(false);
            }
        });

        return () => {
            unsubscribePlaybooks();
            unsubscribeOps();
        };
    }, [selectedPlaybookId]);

    const handleExecute = useCallback(() => {
        if (!selectedPlaybookId || isRunning) return;
        setIsRunning(true);
        setProgress(null); // Clear previous progress
        operationService.startOperation(selectedPlaybookId);
    }, [selectedPlaybookId, isRunning]);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Operations Console</h2>
                <p className="text-sm text-slate-400">Select and execute operational playbooks.</p>
            </div>

            <div className="flex-grow flex min-h-0">
                {/* --- Left Panel: Playbook Selection --- */}
                <div className="w-1/3 min-w-[300px] p-4 border-r border-slate-700/50 flex flex-col gap-4">
                    <h3 className="text-md font-bold text-indigo-300">Available Playbooks</h3>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                         {playbooks.map(pb => (
                            <button
                                key={pb.id}
                                onClick={() => setSelectedPlaybookId(pb.id)}
                                disabled={isRunning}
                                className={`w-full text-left p-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    selectedPlaybookId === pb.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                            >
                                <p className="font-bold">{pb.name}</p>
                                <p className="text-xs opacity-80">{pb.description}</p>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleExecute}
                        disabled={!selectedPlaybookId || isRunning}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                        {isRunning ? 'Executing...' : 'Execute Playbook'}
                    </button>
                </div>

                {/* --- Right Panel: Live Log --- */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {!progress && (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>Operation log will appear here upon execution.</p>
                        </div>
                    )}
                    {progress?.steps.map((step, index) => (
                         <div key={index} className="flex items-start gap-3">
                            <StatusIcon status={step.status} />
                            <div className="flex-grow">
                                <p className={`font-semibold ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{index + 1}. {step.name}</p>
                                <p className="text-sm text-indigo-300">Agent: <span className="font-mono bg-slate-700/50 px-1 rounded">{step.agentId}</span></p>
                                {step.result && <p className="text-sm text-slate-300 mt-1 pl-2 border-l-2 border-slate-700 whitespace-pre-wrap">{step.result}</p>}
                                {step.error && <p className="text-sm text-red-400 mt-1">{step.error}</p>}
                            </div>
                        </div>
                    ))}
                     {progress?.isComplete && !progress.error && (
                        <div className="mt-4 p-3 bg-slate-800/50 border border-green-500/30 rounded-lg text-center">
                            <h3 className="font-bold text-green-400">Operation Complete</h3>
                            <p className="text-sm text-slate-400">All playbook steps executed successfully.</p>
                        </div>
                    )}
                    {progress?.error && (
                        <div className="mt-4 p-3 bg-slate-800/50 border border-red-500/30 rounded-lg text-center">
                            <h3 className="font-bold text-red-400">Operation Failed</h3>
                            <p className="text-sm text-slate-400">{progress.error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OperationsConsoleApp;