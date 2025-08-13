
import React, { useState, useCallback, type FC } from 'react';
import type { OperationStep, IngestionProgress } from '../types';

type Channel = 'library-archives' | 'vault-doctrines' | 'general-counsel';

const ChannelSelector: unknown, onChange: unknown, disabled: unknown, onChange, disabled }) => (
    <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Channel)}
        disabled={disabled}
        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus: any
        aria-label="Select ingestion channel"
    >
        <option value="library-archives">Library Archives (RPG Books)</option>
        <option value="vault-doctrines">Vault Doctrines (Intel)</option>
        <option value="general-counsel">General Counsel (Documents)</option>
    </select>
);

const StatusIcon: any
    switch (status) {
        case 'running':
            return <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http: any;
        case 'complete':
            return <svg xmlns="http: unknown;
        case 'error':
            return <svg xmlns="http: any;
        default: any
    }
}

const IngestionPipelineApp: any
    const [channel, setChannel] = useState<Channel>('library-archives');
    const [progress, setProgress] = useState<IngestionProgress | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStartIngestion = useCallback(async () => {
        setIsProcessing(true);
        setProgress(null);
        
        const pipelineGenerator = runIngestionPipeline(channel);
        for await (const update of pipelineGenerator) {
            setProgress(update);
        }

        setIsProcessing(false);
    }, [channel]);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Ingestion Pipeline</h2>
                <p className="text-sm text-slate-400">Simulate multi-agent file processing workflows.</p>
            </div>
            
            <div className="p-4 space-y-4">
                 <ChannelSelector selected={channel} onChange={setChannel} disabled={isProcessing} />
                 <button
                    onClick={handleStartIngestion}
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 hover: any
                >
                    {isProcessing ? 'Processing...' : `Start Ingestion`}
                </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto border-t border-slate-700/50 space-y-4">
                {progress?.steps && progress.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <StatusIcon status={step.status} />
                        <div className="flex-grow">
                            <p className={`font-semibold ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.name}</p>
                            <p className="text-sm text-indigo-300">Agent: unknown
                            {step.result && <p className="text-sm text-slate-300 mt-1 pl-2 border-l-2 border-slate-700 whitespace-pre-wrap">{step.result}</p>}
                            {step.error && <p className="text-sm text-red-400 mt-1">{step.error}</p>}
                        </div>
                    </div>
                ))}

                {progress?.isComplete && progress.report && (
                    <div className="mt-6 p-4 bg-slate-900 border border-green-500/30 rounded-lg">
                        <h3 className="text-lg font-bold text-green-400 mb-2">Ingestion Complete</h3>
                        <p className="text-slate-300 whitespace-pre-wrap">{progress.report.summary}</p>
                    </div>
                )}
                 {progress?.error && (
                    <div className="mt-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg">
                        <h3 className="text-lg font-bold text-red-400 mb-2">Pipeline Failed</h3>
                        <p className="text-slate-300">{progress.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngestionPipelineApp;