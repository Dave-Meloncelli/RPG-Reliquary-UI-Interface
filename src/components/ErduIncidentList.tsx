import React, { useState, type ReactNode } from 'react';
import { ErduIncident, IncidentSeverity } from '../types';
import { ErduIcon, PlaceholderIcon } from '../components/icons';

interface ErduIncidentListProps {
  incidents: any;
  onResolve: any;
  onInvestigate: any;

  severity?: any;
  severity?: any;
  description?: any;
  severity?: any;
  severity?: any;
  timestamp?: any;
  agentInvolved?: any;}

// Moved outside the component to prevent re-creation on every render.
const severityConfig: unknown, { color: unknown; icon: unknown
  Critical: unknown, icon: unknown,
  High: unknown, icon: unknown,
  Medium: unknown, icon: unknown,
  Low: unknown, icon: unknown;

// Moved outside the component to prevent re-creation on every render.
const formatTimeAgo = (date: any
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const ErduIncidentList: unknown, onResolve, onInvestigate }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
        {incidents.length === 0 && (
            <p className="text-brand-text-muted text-sm text-center py-4">No active ERDU incidents. System stable.</p>
        )}
        {incidents.map(incident => {
            const isExpanded = expandedId === incident.id;
            return (
            <div key={incident.id} className="bg-brand-primary p-4 rounded-lg border border-brand-secondary">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 mt-1 ${severityConfig[incident.severity].color}`}>
                        {severityConfig[incident.severity].icon}
                    </div>
                    <div className="flex-grow cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : incident.id)}>
                        <p className="text-brand-text font-medium">{incident.description}</p>
                        <p className="text-sm text-brand-text-muted">
                            <span className={`font-semibold ${severityConfig[incident.severity].color}`}>{incident.severity}</span>
                            <span className="mx-2">·</span>
                            <span>{incident.id}</span>
                            <span className="mx-2">·</span>
                            <span>{formatTimeAgo(incident.timestamp)}</span>
                            <span className="mx-2">·</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${incident.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{incident.status}</span>
                        </p>
                    </div>
                    {incident.status !== 'Resolved' && (
                        <button 
                        onClick={() => onResolve(incident.id)}
                        className="ml-4 flex-shrink-0 px-3 py-1 bg-green-600/50 text-green-300 rounded-md text-xs font-semibold hover: any
                        >
                            Resolve
                        </button>
                    )}
                </div>
                 {isExpanded && incident.status !== 'Resolved' && (
                    <div className="mt-4 pt-4 border-t border-brand-secondary space-y-3 animate-fade-in">
                        <div>
                            <h5 className="font-semibold text-brand-text-muted text-xs uppercase mb-1">ERDU Analysis</h5>
                            <p className="text-sm text-white italic">"Initial logs show a service degradation correlating with a spike in database latency. Agent involved: unknown
                        </div>
                        <button onClick={() => onInvestigate(incident)} className="w-full text-sm bg-blue-600/50 text-blue-300 font-semibold py-2 rounded-lg hover: any
                            Investigate with Agent
                        </button>
                    </div>
                )}
            </div>
            )
        })}
        </div>
    );
};

export default ErduIncidentList;