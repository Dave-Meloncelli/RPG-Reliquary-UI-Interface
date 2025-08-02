import React, { useState, useEffect, type FC } from 'react';
import { streamObservabilityData } from '../services/observatoryService';
import type { ObservatoryMetrics, LLMCallLog, AgentTaskLog } from '../types';

const MetricCard: FC<{ title: string; value: string; className?: string }> = ({ title, value, className = '' }) => (
    <div className="bg-slate-800/70 p-4 rounded-lg">
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className={`text-2xl font-bold font-mono ${className}`}>{value}</p>
    </div>
);

const LogPanel: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/30 rounded-lg flex flex-col h-full overflow-hidden">
        <h3 className="text-md font-bold text-indigo-300 p-3 bg-slate-900/50">{title}</h3>
        <div className="flex-grow overflow-y-auto p-3 space-y-2">
            {children}
        </div>
    </div>
);

const LLMCallLogRow: FC<{ log: LLMCallLog }> = ({ log }) => (
    <div className="font-mono text-xs bg-slate-800/50 p-2 rounded">
        <span className="text-slate-500 mr-2">{log.timestamp}</span>
        <span className="text-cyan-400 mr-2">{log.agentId}</span>
        <span className="text-slate-300">called</span>
        <span className="text-purple-400 mx-2">{`${log.provider} (${log.model})`}</span>
        <span className="text-slate-300">| Tokens:</span>
        <span className="text-yellow-400 ml-1">{log.tokens}</span>
        <span className="text-slate-300">, Cost:</span>
        <span className="text-green-400 ml-1">${log.cost.toFixed(5)}</span>
    </div>
);

const AgentTaskLogRow: FC<{ log: AgentTaskLog }> = ({ log }) => (
     <div className="font-mono text-xs bg-slate-800/50 p-2 rounded">
        <span className="text-slate-500 mr-2">{log.timestamp}</span>
        <span className="text-cyan-400 mr-2">{log.agentId}</span>
        <span className="text-slate-300">finished</span>
        <span className="text-orange-400 mx-2">{log.taskType}</span>
        <span className="text-slate-300">in</span>
        <span className="text-yellow-400 ml-1">{log.duration}ms</span>
    </div>
);

const ObservatoryApp: React.FC = () => {
    const [metrics, setMetrics] = useState<ObservatoryMetrics>({ totalLLMCalls: 0, estimatedCost: 0, avgTaskDuration: 0 });
    const [llmLogs, setLlmLogs] = useState<LLMCallLog[]>([]);
    const [agentTasks, setAgentTasks] = useState<AgentTaskLog[]>([]);

    useEffect(() => {
        const dataStream = streamObservabilityData();
        let isMounted = true;

        const processStream = async () => {
            for await (const data of dataStream) {
                if (!isMounted) break;
                setMetrics(data.metrics);
                if (data.newLLMCall) {
                    setLlmLogs(prev => [data.newLLMCall!, ...prev].slice(0, 50));
                }
                if (data.newAgentTask) {
                    setAgentTasks(prev => [data.newAgentTask!, ...prev].slice(0, 50));
                }
            }
        };

        processStream();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Observatory</h2>
                <p className="text-sm text-slate-400">Monitoring & Observability Dashboard</p>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-4">
                <MetricCard title="Total LLM Calls" value={metrics.totalLLMCalls.toLocaleString()} className="text-cyan-400" />
                <MetricCard title="Estimated Cost (Today)" value={`$${metrics.estimatedCost.toFixed(4)}`} className="text-green-400" />
                <MetricCard title="Avg. Task Duration" value={`${metrics.avgTaskDuration.toFixed(0)} ms`} className="text-yellow-400" />
            </div>

            <div className="flex-grow p-4 pt-0 grid grid-cols-2 gap-4 min-h-0">
                <LogPanel title="LLM Usage Stream">
                    {llmLogs.map(log => <LLMCallLogRow key={log.id} log={log} />)}
                </LogPanel>
                <LogPanel title="Agent Task Log">
                    {agentTasks.map(task => <AgentTaskLogRow key={task.id} log={task} />)}
                </LogPanel>
            </div>
        </div>
    );
};

export default ObservatoryApp;