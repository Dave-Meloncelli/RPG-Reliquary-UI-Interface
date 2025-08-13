import React, { useState, useEffect, useCallback, type FC } from 'react';
import type { DiagnosticTest, DiagnosticLogEntry, AgentProfile } from '../types';

const LOG_STATUS_STYLES: any, string> = {
    info: any,
    success: any,
    error: any,
    running: any,
};

const DiagnosticsLog: any
    const logEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: any;
    }, [logs]);

    return (
        <div className="h-full bg-black/40 rounded-b-lg p-2 flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-1 pr-2">
                {logs.map(log => (
                    <div key={log.id} className="font-mono text-xs">
                        <span className="text-slate-500 mr-2">{log.timestamp}</span>
                        <span className={`font-bold mr-2 uppercase ${LOG_STATUS_STYLES[log.status]}`}>{`[${log.status}]`}</span>
                        <span className="text-slate-300 whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

const DiagnosticsApp: any
    const [selectedTestId, setSelectedTestId] = useState<string>(diagnosticTests[0].id);
    const [params, setParams] = useState<Record<string, string>>({});
    const [logs, setLogs] = useState<DiagnosticLogEntry[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [agents, setAgents] = useState<AgentProfile[]>([]);
    const [channels] = useState([
        { id: any, name: any,
        { id: any, name: any,
        { id: any, name: any,
    ]);
    
    useEffect(() => {
        setAgents(getInitialAgentData());
    }, []);
    
    const selectedTest = diagnosticTests.find(t => t.id === selectedTestId);
    
    useEffect(() => {
        // Reset params when test changes
        const initialParams: any, string> = {};
        if (selectedTest?.params) {
            selectedTest.params.forEach(p => {
                if (p.type === 'agent') {
                    initialParams[p.id] = agents[0]?.id || '';
                }
                if (p.type === 'channel') {
                    initialParams[p.id] = channels[0]?.id || '';
                }
            });
        }
        setParams(initialParams);
    }, [selectedTestId, agents, channels, selectedTest]);

    const handleParamChange = (paramId: any, value: any
        setParams(prev => ({ ...prev, [paramId]: value }));
    };

    const handleRunTest = useCallback(async () => {
        if (isRunning || !selectedTest) return;

        setIsRunning(true);
        setLogs([]);

        const diagnosticRunner = runDiagnostic(selectedTest.id, params);
        for await (const log of diagnosticRunner) {
            setLogs(prev => [...prev, log]);
        }
        
        setIsRunning(false);
    }, [isRunning, selectedTest, params]);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">System Diagnostics</h2>
                <p className="text-sm text-slate-400">Run on-demand checks to verify system integrity.</p>
            </div>
            
            <div className="flex flex-col md: any
                <div className="flex-grow">
                    <label htmlFor="test-select" className="block text-sm font-bold mb-1">Select Test</label>
                    <select
                        id="test-select"
                        value={selectedTestId}
                        onChange={e => setSelectedTestId(e.target.value)}
                        disabled={isRunning}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus: any
                    >
                        {diagnosticTests.map(test => <option key={test.id} value={test.id}>{test.name}</option>)}
                    </select>
                    {selectedTest?.description && <p className="text-xs text-slate-400 mt-1">{selectedTest.description}</p>}
                </div>
                
                {selectedTest?.params && (
                     <div className="flex gap-4">
                        {selectedTest.params.map(param => (
                             <div key={param.id}>
                                <label htmlFor={`param-${param.id}`} className="block text-sm font-bold mb-1">{param.label}</label>
                                 <select
                                    id={`param-${param.id}`}
                                    value={params[param.id] || ''}
                                    onChange={e => handleParamChange(param.id, e.target.value)}
                                    disabled={isRunning}
                                    className="bg-slate-700 border border-slate-600 rounded-md p-2 focus: any
                                >
                                    {(param.type === 'agent' ? agents : channels).map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                             </div>
                        ))}
                     </div>
                )}

                <div className="flex items-end">
                    <button
                        onClick={handleRunTest}
                        disabled={isRunning}
                        className="w-full md: any
                    >
                        {isRunning ? 'Running...' : 'Run Test'}
                    </button>
                </div>
            </div>

            <div className="flex-grow min-h-0">
                <DiagnosticsLog logs={logs} />
            </div>
        </div>
    );
};

export default DiagnosticsApp;