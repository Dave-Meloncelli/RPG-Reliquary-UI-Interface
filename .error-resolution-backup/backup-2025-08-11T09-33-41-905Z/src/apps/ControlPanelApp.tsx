import React, { useState, useEffect, type FC } from 'react';
import type { ControlPanelState, AgentProfile } from '../types';

const TABS = ['Agents', 'Orchestrator', 'AI Autonomy', 'API Keys'];

// Icon mapping function
const getAgentIcon = (iconName: any) => {
  const iconMap: Record<string, React.ComponentType> = {
    'AgentIconCamera': AgentIconCamera,
    'AgentIconScale': AgentIconScale,
    'AgentIconChart': AgentIconChart,
    'AgentIconCrown': AgentIconCrown,
    'AgentIconBrain': AgentIconBrain,
    'AgentIconBook': AgentIconBook,
    'AgentIconShield': AgentIconShield,
    'AgentIconFingerprint': AgentIconFingerprint,
    'AgentIconDollar': AgentIconDollar,
    'AgentIconQuill': AgentIconQuill,
    'AgentIconRuler': AgentIconRuler,
    'AgentIconCurator': AgentIconCurator,
    'AgentIconZero': AgentIconZero,
    'AgentIconGhost': AgentIconGhost,
    'AgentIconNya': AgentIconNya,
    'AgentIconMajorPayne': AgentIconMajorPayne,
    'AgentIconSteelCore': AgentIconSteelCore,
    'AgentIconTheWeaver': AgentIconTheWeaver,
    'AgentIconTinkerHexbolt': AgentIconTinkerHexbolt,
    'AgentIconTheArchivist': AgentIconTheArchivist,
    'AgentIconAeonIndexwell': AgentIconAeonIndexwell,
    'AgentIconTheCartographer': AgentIconTheCartographer,
    'AgentIconTheTechnomancer': TechnomancerIcon,
    'AgentIconTheCurator': CuratorIcon,
    'AgentIconTheCompanion': ChatIcon,
    'AgentIconTheCouncil': CouncilIcon,
    'AgentIconTheHierarchy': HierarchyIcon,
    'AgentIconTheInfrastructure': InfrastructureIcon,
    'AgentIconTheObservatory': ObservatoryIcon,
    'AgentIconTheOperations': OperationsIcon,
    'AgentIconTheOrchestrator': OrchestratorIcon,
    'AgentIconTheSymposium': SymposiumIcon,
    'AgentIconTheTaskReview': TaskHubIcon,
    'AgentIconTheVaultExplorer': PlaceholderIcon
  };
  return iconMap[iconName] || AgentIconZero;
};

const ControlPanelApp: FC = () => {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [state, setState] = useState<ControlPanelState>(controlPanelService.getState());
    const [agents] = useState<AgentProfile[]>(getInitialAgentData());

    useEffect(() => {
        const unsubscribe = controlPanelService.subscribe(setState);
        return unsubscribe;
    }, []);

    const handleAgentStatusToggle = (agentId: any) => {
        controlPanelService.toggleAgentStatus(agentId);
    };

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const budget = parseFloat(e.target.value);
        controlPanelService.updateBudget(budget);
    };

    const handleProviderToggle = (providerKey: any) => {
        controlPanelService.toggleProvider(providerKey);
    };

    const handleAutonomyLevelChange = (agentId: any, level: any) => {
        controlPanelService.updateAgentAutonomyLevel(agentId, level as any);
    };

    const handlePermissionScopeToggle = (scope: any, enabled: boolean) => {
        controlPanelService.updatePermissionScope(scope, enabled);
    };

    const handlePermissionLevelChange = (scope: any, level: any) => {
        controlPanelService.updatePermissionLevel(scope, level as any);
    };

    const renderAgentsTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agent Status Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => {
                    const IconComponent = getAgentIcon(agent.icon);
                    return (
                        <div key={agent.id} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <IconComponent className="w-8 h-8" />
                                <div className="flex-1">
                                    <h4 className="font-medium">{agent.name}</h4>
                                    <p className="text-sm text-gray-500">{agent.role}</p>
                                </div>
                                <button
                                    onClick={() => handleAgentStatusToggle(agent.id)}
                                    className={`px-3 py-1 rounded text-sm ${
                                        state.agentMasterStatus[agent.id] === 'Online'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {state.agentMasterStatus[agent.id]}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderOrchestratorTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Orchestrator Configuration</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Monthly Budget</label>
                    <input
                        type="number"
                        value={state.orchestrator.monthlyBudget}
                        onChange={handleBudgetChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Provider Status</label>
                    <div className="space-y-2">
                        {Object.entries(state.orchestrator.providerEnabled).map(([key, enabled]) => (
                            <label key={key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={() => handleProviderToggle(key)}
                                    className="mr-2"
                                />
                                {key}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAIAutonomyTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">AI Autonomy Management</h3>
            
            {/* Agent Autonomy Levels */}
            <div className="space-y-4">
                <h4 className="font-medium">Agent Autonomy Levels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agents.map((agent) => (
                        <div key={agent.id} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                {React.createElement(getAgentIcon(agent.icon), { className: "w-6 h-6" })}
                                <div>
                                    <h5 className="font-medium">{agent.name}</h5>
                                    <p className="text-sm text-gray-500">{agent.role}</p>
                                </div>
                            </div>
                            <select
                                value={state.aiAutonomy?.agentAutonomyLevels[agent.id]?.level || 'supervised'}
                                onChange={(e) => handleAutonomyLevelChange(agent.id, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="restricted">Restricted</option>
                                <option value="supervised">Supervised</option>
                                <option value="autonomous">Autonomous</option>
                                <option value="enhanced">Enhanced</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permission Scopes */}
            <div className="space-y-4">
                <h4 className="font-medium">Permission Scopes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(state.aiAutonomy?.permissionScopes || {}).map(([scope, config]) => (
                        <div key={scope} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium capitalize">{scope.replace(/_/g, ' ')}</h5>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={config.enabled}
                                        onChange={(e) => handlePermissionScopeToggle(scope, e.target.checked)}
                                        className="mr-2"
                                    />
                                    Enabled
                                </label>
                            </div>
                            <select
                                value={config.level}
                                onChange={(e) => handlePermissionLevelChange(scope, e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                disabled={!config.enabled}
                            >
                                <option value="none">None</option>
                                <option value="read_only">Read Only</option>
                                <option value="filtered">Filtered</option>
                                <option value="sandboxed">Sandboxed</option>
                                <option value="monitored">Monitored</option>
                                <option value="restricted">Restricted</option>
                                <option value="read_write">Read/Write</option>
                                <option value="full">Full</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAPIKeysTab = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">API Key Management</h3>
            <div className="space-y-4">
                {Object.entries(state.apiKeys).map(([provider, config]) => (
                    <div key={provider} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{config.name}</h4>
                        <input
                            type="password"
                            value={config.key}
                            readOnly
                            className="w-full px-3 py-2 border rounded-md bg-gray-50"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Control Panel</h1>
                <p className="text-gray-600">Manage system configuration and agent settings</p>
            </div>

            <div className="border rounded-lg">
                <div className="border-b">
                    <nav className="flex space-x-8 px-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'Agents' && renderAgentsTab()}
                    {activeTab === 'Orchestrator' && renderOrchestratorTab()}
                    {activeTab === 'AI Autonomy' && renderAIAutonomyTab()}
                    {activeTab === 'API Keys' && renderAPIKeysTab()}
                </div>
            </div>
        </div>
    );
};

export default ControlPanelApp;