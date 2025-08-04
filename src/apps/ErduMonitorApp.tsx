import React, { useState, useEffect, useCallback, type FC } from 'react';
import { streamErduEvents, runIncidentResponse } from '../services/erduService';
import type { ErduLogEntry, SystemStatus, IncidentResponseProgress, LogLevel, OperationStep } from '../types';

const LOG_LEVEL_STYLES: Record<LogLevel, { text: string; bg: string; border: string }> = {
    INFO: { text: 'text-sky-300', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    WARN: { text: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    ERROR: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    CRITICAL: { text: 'text-red-300 font-bold', bg: 'bg-red-500/20', border: 'border-red-500/30' },
};

const StatusMeter: FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div>
        <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-semibold text-slate-300">{label}</span>
            <span className={`font-mono font-bold ${colorClass}`}>{value.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const EventLog: FC<{ logs: ErduLogEntry[] }> = ({ logs }) => (
    <div className="h-full bg-black/30 rounded-md p-2 flex flex-col-reverse overflow-y-auto">
        <div className="space-y-2 pr-2">
            {logs.map(log => (
                <div key={log.id} className={`p-2 rounded border text-xs font-mono ${LOG_LEVEL_STYLES[log.level].bg} ${LOG_LEVEL_STYLES[log.level].border}`}>
                    <span className="mr-2 text-slate-500">{log.timestamp}</span>
                    <span className={`mr-2 font-bold ${LOG_LEVEL_STYLES[log.level].text}`}>{`[${log.level}]`}</span>
                    <span className="text-slate-300">{log.message}</span>
                </div>
            ))}
        </div>
    </div>
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

const ErduMonitorApp: React.FC = () => {
    const [logs, setLogs] = useState<ErduLogEntry[]>([]);
    const [status, setStatus] = useState<SystemStatus>({ integrity: 100, threatLevel: 0 });
    const [incidentProgress, setIncidentProgress] = useState<IncidentResponseProgress | null>(null);
    const [isResponding, setIsResponding] = useState(false);

    useEffect(() => {
        const eventGenerator = streamErduEvents();
        const intervalId = setInterval(async () => {
            const { value, done } = await eventGenerator.next();
            if (done) {
                clearInterval(intervalId);
                return;
            }
            if (value) {
                setLogs(prev => [value.log, ...prev.slice(0, 99)]);
                setStatus(value.status);
            }
        }, 1500);

        return () => clearInterval(intervalId);
    }, []);

    const handleIncidentResponse = useCallback(async () => {
        setIsResponding(true);
        setIncidentProgress(null);
        
        const responseGenerator = runIncidentResponse();
        for await (const update of responseGenerator) {
            setIncidentProgress(update);
        }

        setIsResponding(false);
    }, []);

    const integrityColor = status.integrity > 70 ? 'bg-green-500' : status.integrity > 40 ? 'bg-yellow-500' : 'bg-red-500';
    const threatColor = status.threatLevel > 70 ? 'text-red-400' : status.threatLevel > 40 ? 'text-yellow-400' : 'text-green-400';

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">ERDU Monitor</h2>
                <p className="text-sm text-slate-400">Emergency Response & Defense Unit Live Feed</p>
            </div>
            
            <div className="flex-grow p-4 grid grid-cols-5 gap-4 min-h-0">
                <div className="col-span-3 h-full">
                    <EventLog logs={logs} />
                </div>
                <div className="col-span-2 flex flex-col gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-md font-bold text-indigo-300 mb-3">System Status</h3>
                        <div className="space-y-4">
                            <StatusMeter label="Integrity" value={status.integrity} colorClass={integrityColor} />
                             <StatusMeter label="Threat Level" value={status.threatLevel} colorClass={threatColor.replace('text-','bg-')} />
                        </div>
                    </div>
                     <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex-grow flex flex-col">
                        <h3 className="text-md font-bold text-indigo-300 mb-3">Incident Response</h3>
                        <button
                            onClick={handleIncidentResponse}
                            disabled={isResponding}
                            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-200 shadow-md"
                        >
                            {isResponding ? 'Protocol Active...' : 'Trigger Incident Response'}
                        </button>
                        <div className="mt-4 flex-grow overflow-y-auto space-y-3 pr-2">
                             {incidentProgress?.steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <StatusIcon status={step.status} />
                                    <div className="flex-grow">
                                        <p className={`font-semibold text-sm ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.name}</p>
                                        <p className="text-xs text-indigo-300">Agent: <span className="font-mono bg-slate-700/50 px-1 rounded">{step.agentId}</span></p>
                                        {step.result && <p className="text-xs text-slate-300 mt-1 pl-2 border-l-2 border-slate-700">{step.result}</p>}
                                        {step.error && <p className="text-xs text-red-400 mt-1">{step.error}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErduMonitorApp;
