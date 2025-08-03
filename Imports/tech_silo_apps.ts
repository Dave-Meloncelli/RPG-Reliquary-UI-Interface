// src/apps/TechSiloManager.tsx
import React, { useState, useEffect } from 'react';
import { Tooltip } from '../components/ui/Tooltip';
import { TechSiloManager, TechSilo, SystemHealth } from '../services/techSilos/TechSiloManager';

interface TechSiloManagerAppProps {
  windowId: string;
  onClose?: () => void;
}

export const TechSiloManagerApp: React.FC<TechSiloManagerAppProps> = ({ windowId, onClose }) => {
  const [siloManager] = useState(() => new TechSiloManager());
  const [silos, setSilos] = useState<TechSilo[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [selectedSilo, setSelectedSilo] = useState<TechSilo | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const updateDashboard = () => {
      setSilos(Array.from(siloManager['silos'].values()));
      setSystemHealth(siloManager.getSystemHealth());
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000);

    siloManager.on('siloCreated', updateDashboard);
    siloManager.on('siloUpdated', updateDashboard);

    return () => {
      clearInterval(interval);
      siloManager.removeAllListeners();
    };
  }, [siloManager]);

  const createPresetSilo = async (type: string) => {
    setIsCreating(true);
    try {
      switch (type) {
        case 'dependency':
          await siloManager.createDependencyTracker('./');
          break;
        case 'version':
          await siloManager.createVersionMonitor(['react', 'typescript', 'vite', 'tailwindcss']);
          break;
        case 'hotfix':
          await siloManager.createHotfixAggregator();
          break;
        case 'agent':
          await siloManager.createAgentTrainer();
          break;
      }
    } finally {
      setIsCreating(false);
    }
  };

  const updateSilo = async (siloId: string) => {
    await siloManager.updateSilo(siloId);
  };

  return (
    <div className="h-full bg-gray-900 text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tech Silo Management</h1>
        <SystemHealthIndicator health={systemHealth} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <QuickCreateButton
          title="Dependency Tracker"
          icon="📦"
          description="Monitor package dependencies and vulnerabilities"
          onClick={() => createPresetSilo('dependency')}
          disabled={isCreating}
        />
        <QuickCreateButton
          title="Version Monitor"
          icon="🔄"
          description="Track new releases and breaking changes"
          onClick={() => createPresetSilo('version')}
          disabled={isCreating}
        />
        <QuickCreateButton
          title="Hotfix Aggregator"
          icon="🚨"
          description="Collect critical fixes and patches"
          onClick={() => createPresetSilo('hotfix')}
          disabled={isCreating}
        />
        <QuickCreateButton
          title="Agent Trainer"
          icon="🤖"
          description="Train AI agents with tech knowledge"
          onClick={() => createPresetSilo('agent')}
          disabled={isCreating}
        />
      </div>

      {/* Silo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {silos.map(silo => (
          <SiloCard
            key={silo.id}
            silo={silo}
            onUpdate={() => updateSilo(silo.id)}
            onSelect={() => setSelectedSilo(silo)}
          />
        ))}
      </div>

      {/* Silo Details Modal */}
      {selectedSilo && (
        <SiloDetailsModal
          silo={selectedSilo}
          onClose={() => setSelectedSilo(null)}
          onUpdate={() => updateSilo(selectedSilo.id)}
        />
      )}
    </div>
  );
};

const SystemHealthIndicator: React.FC<{ health: SystemHealth | null }> = ({ health }) => {
  if (!health) return <div className="text-gray-500">Loading...</div>;

  const statusColors = {
    healthy: 'text-green-400',
    degraded: 'text-yellow-400',
    critical: 'text-red-400'
  };

  return (
    <Tooltip
      content={
        <div>
          <div className="font-medium mb-2">System Health</div>
          <div className="text-sm space-y-1">
            <div>Active Silos: {health.activeSilos}/{health.totalSilos}</div>
            <div>Knowledge Entries: {health.knowledgeEntries.toLocaleString()}</div>
            <div>Training Data: {health.trainingDataPoints.toLocaleString()}</div>
            <div>Avg Response: {health.avgResponseTime}ms</div>
          </div>
        </div>
      }
    >
      <div className={`flex items-center gap-2 ${statusColors[health.overallStatus]}`}>
        <div className={`w-3 h-3 rounded-full bg-current animate-pulse`} />
        <span className="font-medium capitalize">{health.overallStatus}</span>
      </div>
    </Tooltip>
  );
};

const QuickCreateButton: React.FC<{
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ title, icon, description, onClick, disabled }) => (
  <Tooltip content={description}>
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-left transition-colors disabled:opacity-50"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium text-sm">{title}</div>
    </button>
  </Tooltip>
);

const SiloCard: React.FC<{
  silo: TechSilo;
  onUpdate: () => void;
  onSelect: () => void;
}> = ({ silo, onUpdate, onSelect }) => {
  const statusColors = {
    active: 'border-green-500 bg-green-500/10',
    syncing: 'border-yellow-500 bg-yellow-500/10',
    error: 'border-red-500 bg-red-500/10',
    deprecated: 'border-gray-500 bg-gray-500/10'
  };

  const typeIcons = {
    dependency_tracker: '📦',
    version_monitor: '🔄',
    hotfix_aggregator: '🚨',
    community_forum: '💬',
    documentation_hub: '📚',
    security_scanner: '🔒',
    performance_monitor: '⚡',
    issue_tracker: '🐛',
    release_planner: '📋',
    agent_trainer: '🤖'
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[silo.status]} cursor-pointer`} onClick={onSelect}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[silo.type]}</span>
          <div>
            <h3 className="font-medium">{silo.name}</h3>
            <p className="text-xs text-gray-400">{silo.type.replace('_', ' ')}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded capitalize ${silo.status === 'active' ? 'bg-green-600' : silo.status === 'error' ? 'bg-red-600' : 'bg-yellow-600'}`}>
          {silo.status}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-3">{silo.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Updated: {silo.lastUpdated.toLocaleTimeString()}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate(); }}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Update
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="font-medium">{silo.aiContext.knowledgeBase.length}</div>
          <div className="text-gray-400">Knowledge</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{silo.aiContext.trainingData.length}</div>
          <div className="text-gray-400">Training</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{Math.round(silo.aiContext.confidence * 100)}%</div>
          <div className="text-gray-400">Confidence</div>
        </div>
      </div>
    </div>
  );
};

const SiloDetailsModal: React.FC<{
  silo: TechSilo;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ silo, onClose, onUpdate }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{silo.name}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration */}
        <div>
          <h3 className="font-medium mb-3">Configuration</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">Type:</span> {silo.type}</div>
            <div><span className="text-gray-400">Status:</span> {silo.status}</div>
            <div><span className="text-gray-400">Auto Update:</span> {silo.config.autoUpdate ? 'Yes' : 'No'}</div>
            <div><span className="text-gray-400">Schedule:</span> {silo.config.updateInterval}</div>
            <div><span className="text-gray-400">Sources:</span> {silo.config.sources.length}</div>
          </div>
        </div>

        {/* Health Metrics */}
        <div>
          <h3 className="font-medium mb-3">Health Metrics</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">Successful Updates:</span> {silo.healthMetrics.successfulUpdates}</div>
            <div><span className="text-gray-400">Failed Updates:</span> {silo.healthMetrics.failedUpdates}</div>
            <div><span className="text-gray-400">Avg Response Time:</span> {silo.healthMetrics.avgResponseTime}ms</div>
            <div><span className="text-gray-400">Uptime:</span> {silo.healthMetrics.uptime}%</div>
          </div>
        </div>

        {/* AI Context */}
        <div className="md:col-span-2">
          <h3 className="font-medium mb-3">AI Training Context</h3>
          <div className="bg-gray-900 rounded p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-medium">{silo.aiContext.knowledgeBase.length}</div>
                <div className="text-xs text-gray-400">Knowledge Entries</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{silo.aiContext.trainingData.length}</div>
                <div className="text-xs text-gray-400">Training Examples</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{Math.round(silo.aiContext.confidence * 100)}%</div>
                <div className="text-xs text-gray-400">Confidence Score</div>
              </div>
            </div>
            
            {silo.aiContext.contextSummary && (
              <div>
                <div className="text-sm font-medium mb-2">Context Summary</div>
                <div className="text-sm text-gray-300">{silo.aiContext.contextSummary}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onUpdate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
          Update Now
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">
          Close
        </button>
      </div>
    </div>
  </div>
);