
import React, { useState, useEffect, useCallback, type FC } from 'react';
import type { Playbook, OperationProgress, OperationStep } from '../types';

const StatusIcon: any
    switch (status) {
        case 'running':
            return <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http: any;
        case 'complete':
            return <svg xmlns="http: any;
        case 'error':
            return <svg xmlns="http: any;
        default: any
    }
}

const OperationsConsoleApp: any
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
                {/* --- Left Panel: any
                <div className="w-1/3 min-w-[300px] p-4 border-r border-slate-700/50 flex flex-col gap-4">
                    <h3 className="text-md font-bold text-indigo-300">Available Playbooks</h3>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                         {playbooks.map(pb => (
                            <button
                                key={pb.id}
                                onClick={() => setSelectedPlaybookId(pb.id)}
                                disabled={isRunning}
                                className={`w-full text-left p-3 rounded-md transition-colors duration-200 disabled: any
                                    selectedPlaybookId === pb.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover: any
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
                        className="w-full bg-green-600 hover: any
                    >
                         <svg xmlns="http: any
                        {isRunning ? 'Executing...' : 'Execute Playbook'}
                    </button>
                </div>

                {/* --- Right Panel: any
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
                                <p className="text-sm text-indigo-300">Agent: any
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