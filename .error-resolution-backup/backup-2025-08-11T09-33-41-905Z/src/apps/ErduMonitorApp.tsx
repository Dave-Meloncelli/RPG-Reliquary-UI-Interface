import React, { useState, useEffect, useCallback, type FC } from 'react';
import type { ErduLogEntry, SystemStatus, IncidentResponseProgress, LogLevel, OperationStep } from '../types';

const LOG_LEVEL_STYLES: Record<LogLevel, { text: string; bg: string; border: string }> = {
    INFO: { text: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    WARN: { text: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    ERROR: { text: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    CRITICAL: { text: 'text-red-600', bg: 'bg-red-900/40', border: 'border-red-600/50' },
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

const StatusIcon: FC<{ status: string }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
        case 'complete':
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'error':
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
    }
};

const ErduMonitorApp: FC = () => {
    const [logs, setLogs] = useState<ErduLogEntry[]>([]);
    const [status, setStatus] = useState<SystemStatus>({ integrity: 85, threatLevel: 15 });
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
                            <StatusMeter label="Threat Level" value={status.threatLevel} colorClass={threatColor.replace('text-', 'bg-')} />
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex-grow flex flex-col">
                        <h3 className="text-md font-bold text-indigo-300 mb-3">Incident Response</h3>
                        <button
                            onClick={handleIncidentResponse}
                            disabled={isResponding}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            {isResponding ? 'Protocol Active...' : 'Trigger Incident Response'}
                        </button>
                        <div className="mt-4 flex-grow overflow-y-auto space-y-3 pr-2">
                            {incidentProgress?.steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <StatusIcon status={step.status} />
                                    <div className="flex-grow">
                                        <p className={`font-semibold text-sm ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.name}</p>
                                        <p className="text-xs text-indigo-300">Agent: any
                                            {step.result && <p className="text-xs text-slate-300 mt-1 pl-2 border-l-2 border-slate-700">{step.result}</p>}
                                            {step.error && <p className="text-xs text-red-400 mt-1">{step.error}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ErduMonitorApp;
