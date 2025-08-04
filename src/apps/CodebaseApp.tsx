import React, { useState, useEffect, type FC } from 'react';
import { streamCodebaseActivity } from '../services/codebaseService';
import type { GitCommit, WebhookDelivery } from '../types';

const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col h-full overflow-hidden">
        <h3 className="text-md font-bold text-indigo-300 mb-3">{title}</h3>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {children}
        </div>
    </div>
);

const CommitRow: FC<{ commit: GitCommit }> = ({ commit }) => (
    <div className="font-mono text-xs bg-slate-900/50 p-2 rounded">
        <div className="flex justify-between items-center">
            <p className="text-slate-300 truncate">{commit.message}</p>
            <span className="text-yellow-400 ml-2 flex-shrink-0">{commit.id}</span>
        </div>
        <div className="text-slate-500 mt-1">
            <span className="text-cyan-400">{commit.author}</span> committed at {commit.timestamp}
        </div>
    </div>
);

const WebhookRow: FC<{ webhook: WebhookDelivery }> = ({ webhook }) => (
    <div className="font-mono text-xs flex items-center justify-between bg-slate-900/50 p-2 rounded">
        <div>
            <span className="text-slate-500 mr-2">{webhook.timestamp}</span>
            <span className="text-purple-400 capitalize">{webhook.event}</span>
        </div>
        <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full text-xs ${webhook.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
             <div className={`w-2 h-2 rounded-full ${webhook.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {webhook.success ? 'Success' : 'Failed'}
        </div>
    </div>
);

const CodebaseApp: React.FC = () => {
    const [commits, setCommits] = useState<GitCommit[]>([]);
    const [webhooks, setWebhooks] = useState<WebhookDelivery[]>([]);

    useEffect(() => {
        const activityStream = streamCodebaseActivity();
        let isMounted = true;

        const processStream = async () => {
            for await (const data of activityStream) {
                if (!isMounted) break;
                if (data.newCommit) {
                    setCommits(prev => [data.newCommit!, ...prev].slice(0, 50));
                }
                if (data.newWebhook) {
                    setWebhooks(prev => [data.newWebhook!, ...prev].slice(0, 50));
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
                <h2 className="text-lg font-bold text-white">Codebase Monitor</h2>
                <p className="text-sm text-slate-400">Live feed for repository: <span className="font-mono text-cyan-400">agent-zero-vault</span></p>
            </div>

            <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                <Section title="Live Commit Feed">
                    {commits.map(commit => <CommitRow key={commit.id} commit={commit} />)}
                </Section>
                <Section title="Webhook Delivery Status">
                    {webhooks.map(webhook => <WebhookRow key={webhook.id} webhook={webhook} />)}
                </Section>
            </div>
        </div>
    );
};

export default CodebaseApp;
