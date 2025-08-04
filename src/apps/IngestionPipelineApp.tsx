
import React, { useState, useCallback, type FC } from 'react';
import { runIngestionPipeline } from '../services/ingestionService';
import type { OperationStep, IngestionProgress } from '../types';

type Channel = 'library-archives' | 'vault-doctrines' | 'general-counsel';

const ChannelSelector: FC<{ selected: Channel, onChange: (c: Channel) => void, disabled: boolean }> = ({ selected, onChange, disabled }) => (
    <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Channel)}
        disabled={disabled}
        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="Select ingestion channel"
    >
        <option value="library-archives">Library Archives (RPG Books)</option>
        <option value="vault-doctrines">Vault Doctrines (Intel)</option>
        <option value="general-counsel">General Counsel (Documents)</option>
    </select>
);

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

const IngestionPipelineApp: React.FC = () => {
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
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-200"
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
                            <p className="text-sm text-indigo-300">Agent: <span className="font-mono bg-slate-700/50 px-1 rounded">{step.agentId}</span></p>
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