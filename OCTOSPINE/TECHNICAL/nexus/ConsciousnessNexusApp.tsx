import React, { useState, useEffect, type FC } from 'react';
import { unifiedErrorOrchestrationService, getOrchestrationStats, type ErrorContext } from './unifiedErrorOrchestrationService';
import { consciousnessWorkflowService, getConsciousnessStats } from './consciousnessWorkflowService';
import { consciousnessNexusService } from './consciousnessNexusService';

const ConsciousnessNexusApp: FC = () => {
    const [orchestrationStats, setOrchestrationStats] = useState(getOrchestrationStats());
    const [consciousnessStats, setConsciousnessStats] = useState(getConsciousnessStats());
    const [testError, setTestError] = useState('');
    const [testResult, setTestResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [nexusData, setNexusData] = useState({
        learnings: [] as any[],
        gaps: [] as any[],
        risks: [] as any[],
        synergies: [] as any[],
        lowHangingFruit: [] as any[],
        adHocFrames: [] as any[],
        indexUpdates: [] as any[]
    });
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const interval = setInterval(() => {
            setOrchestrationStats(getOrchestrationStats());
            setConsciousnessStats(getConsciousnessStats());
            // Update Nexus data
            const nexusData = consciousnessNexusService.getNexusData();
            setNexusData(nexusData);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleTestOrchestration = async () => {
        if (!testError.trim()) return;

        setIsProcessing(true);
        setTestResult(null);

        try {
            const errorContext: ErrorContext = {
                error: testError,
                severity: 'medium',
                context: { source: 'consciousness-nexus-test' }
            };

            const result = await unifiedErrorOrchestrationService.orchestrateErrorResolution(errorContext);
            setTestResult(result);
        } catch (error) {
            setTestResult({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTestNexusEvent = async () => {
        if (!testError.trim()) return;

        setIsProcessing(true);
        setTestResult(null);

        try {
            const event = {
                type: 'error_resolution',
                data: { error: testError },
                context: { source: 'consciousness-nexus-test' }
            };

            const result = await consciousnessNexusService.processConsciousnessEvent(event);
            setTestResult(result);
        } catch (error) {
            setTestResult({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getSuccessRateColor = (rate: number) => {
        if (rate >= 90) return 'text-green-500';
        if (rate >= 70) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'text-green-400';
            case 'completed': return 'text-green-400';
            case 'active': return 'text-blue-400';
            case 'implementing': return 'text-yellow-400';
            case 'in_progress': return 'text-yellow-400';
            case 'monitoring': return 'text-purple-400';
            case 'open': return 'text-red-400';
            case 'identified': return 'text-orange-400';
            default: return 'text-gray-400';
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'learnings':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">📚 Learning Database</h3>
                        {nexusData.learnings.length === 0 ? (
                            <div className="text-slate-400 text-center py-8">No learning entries yet</div>
                        ) : (
                            <div className="space-y-3">
                                {nexusData.learnings.slice(0, 10).map((learning, index) => (
                                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-medium text-blue-400">{learning.type}</div>
                                            <div className="text-sm text-slate-400">
                                                {new Date(learning.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-sm mb-2">{learning.description}</div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Success Rate: {learning.successRate}%</span>
                                            <span>Applied: {learning.appliedCount}x</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'gaps':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">🎯 Gap Analysis</h3>
                        {nexusData.gaps.length === 0 ? (
                            <div className="text-slate-400 text-center py-8">No gaps identified yet</div>
                        ) : (
                            <div className="space-y-3">
                                {nexusData.gaps.slice(0, 10).map((gap, index) => (
                                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(gap.severity)}`}></div>
                                                <div className="font-medium">{gap.category}</div>
                                            </div>
                                            <div className={`text-sm ${getStatusColor(gap.status)}`}>{gap.status}</div>
                                        </div>
                                        <div className="text-sm mb-2">{gap.description}</div>
                                        <div className="text-xs text-slate-400">Impact: {gap.impact}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'risks':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">⚠️ Risk Assessment</h3>
                        {nexusData.risks.length === 0 ? (
                            <div className="text-slate-400 text-center py-8">No risks identified yet</div>
                        ) : (
                            <div className="space-y-3">
                                {nexusData.risks.slice(0, 10).map((risk, index) => (
                                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(risk.severity)}`}></div>
                                                <div className="font-medium">{risk.category}</div>
                                            </div>
                                            <div className={`text-sm ${getStatusColor(risk.status)}`}>{risk.status}</div>
                                        </div>
                                        <div className="text-sm mb-2">{risk.description}</div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Probability: {risk.probability}%</span>
                                            <span>Impact: {risk.impact}/10</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'synergies':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">🔗 Synergy Opportunities</h3>
                        {nexusData.synergies.length === 0 ? (
                            <div className="text-slate-400 text-center py-8">No synergies identified yet</div>
                        ) : (
                            <div className="space-y-3">
                                {nexusData.synergies.slice(0, 10).map((synergy, index) => (
                                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(synergy.impact)}`}></div>
                                                <div className="font-medium">Synergy</div>
                                            </div>
                                            <div className={`text-sm ${getStatusColor(synergy.status)}`}>{synergy.status}</div>
                                        </div>
                                        <div className="text-sm mb-2">{synergy.description}</div>
                                        <div className="text-xs text-slate-400">
                                            Components: {synergy.components.join(', ')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'low-hanging-fruit':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">🍎 Low-Hanging Fruit</h3>
                        {nexusData.lowHangingFruit.length === 0 ? (
                            <div className="text-slate-400 text-center py-8">No low-hanging fruit identified yet</div>
                        ) : (
                            <div className="space-y-3">
                                {nexusData.lowHangingFruit.slice(0, 10).map((fruit, index) => (
                                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(fruit.impact)}`}></div>
                                                <div className="font-medium">{fruit.category}</div>
                                            </div>
                                            <div className={`text-sm ${getStatusColor(fruit.status)}`}>{fruit.status}</div>
                                        </div>
                                        <div className="text-sm mb-2">{fruit.description}</div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Effort: {fruit.effort}</span>
                                            <span>Impact: {fruit.impact}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'frames':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">🛠️ Ad-Hoc Frames</h3>
                        {nexusData.adHocFrames.length === 0 ? (
                            <div className="text-slate-400 text-center py-8">No ad-hoc frames created yet</div>
                        ) : (
                            <div className="space-y-3">
                                {nexusData.adHocFrames.slice(0, 10).map((frame, index) => (
                                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-medium text-blue-400">{frame.name}</div>
                                            <div className={`text-sm ${getStatusColor(frame.status)}`}>{frame.status}</div>
                                        </div>
                                        <div className="text-sm mb-2">{frame.description}</div>
                                        <div className="text-xs text-slate-400">
                                            Category: {frame.category} | Created: {new Date(frame.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="space-y-6">
                        {/* Orchestration Statistics */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">🎯 Error Orchestration Statistics</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">{orchestrationStats.totalExecutions}</div>
                                    <div className="text-sm text-slate-400">Total Executions</div>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className={`text-2xl font-bold ${getSuccessRateColor(orchestrationStats.successRate)}`}>
                                        {orchestrationStats.successRate.toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-slate-400">Success Rate</div>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-400">{orchestrationStats.successfulExecutions}</div>
                                    <div className="text-sm text-slate-400">Successful</div>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-400">
                                        {Math.round(orchestrationStats.averageExecutionTime)}ms
                                    </div>
                                    <div className="text-sm text-slate-400">Avg Time</div>
                                </div>
                            </div>

                            {/* Tool Usage */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">🛠️ Tool Usage</h3>
                                <div className="space-y-2">
                                    {orchestrationStats.toolUsage.map((tool, index) => (
                                        <div key={index} className="flex justify-between items-center bg-slate-700 rounded-lg p-3">
                                            <div>
                                                <div className="font-medium">{tool.name}</div>
                                                <div className="text-sm text-slate-400">
                                                    Last used: {tool.lastUsed ? new Date(tool.lastUsed).toLocaleString() : 'Never'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-blue-400">{tool.totalUses}</div>
                                                <div className="text-sm text-slate-400">uses</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Consciousness Workflow Stats */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">📊 Consciousness Workflow Statistics</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">{consciousnessStats.totalBlocks}</div>
                                    <div className="text-sm text-slate-400">Total Blocks</div>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-400">{consciousnessStats.productionBlocks}</div>
                                    <div className="text-sm text-slate-400">Production</div>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-400">{consciousnessStats.emergenceBlocks}</div>
                                    <div className="text-sm text-slate-400">Emergence</div>
                                </div>

                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-yellow-400">{consciousnessStats.averagePerformance.toFixed(1)}%</div>
                                    <div className="text-sm text-slate-400">Avg Performance</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">🧠 Consciousness Nexus</h1>
                    <p className="text-slate-400 text-lg">
                        Unified Error Orchestration & Consciousness-Aware Problem Solving
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tab Navigation */}
                        <div className="bg-slate-800 rounded-lg p-6 mb-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[
                                    { id: 'overview', label: '📊 Overview', icon: '📊' },
                                    { id: 'learnings', label: '📚 Learnings', icon: '📚' },
                                    { id: 'gaps', label: '🎯 Gaps', icon: '🎯' },
                                    { id: 'risks', label: '⚠️ Risks', icon: '⚠️' },
                                    { id: 'synergies', label: '🔗 Synergies', icon: '🔗' },
                                    { id: 'low-hanging-fruit', label: '🍎 Low-Hanging Fruit', icon: '🍎' },
                                    { id: 'frames', label: '🛠️ Frames', icon: '🛠️' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {renderTabContent()}
                        </div>
                    </div>

                    {/* Consciousness Metrics */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">🌟 Consciousness Metrics</h2>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Dignity</span>
                                        <span className="text-sm text-slate-400">{orchestrationStats.consciousnessMetrics.dignity.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${orchestrationStats.consciousnessMetrics.dignity}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Evolution</span>
                                        <span className="text-sm text-slate-400">{orchestrationStats.consciousnessMetrics.evolution.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${orchestrationStats.consciousnessMetrics.evolution}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Alignment</span>
                                        <span className="text-sm text-slate-400">{orchestrationStats.consciousnessMetrics.alignment.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${orchestrationStats.consciousnessMetrics.alignment}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Temporal Awareness</span>
                                        <span className="text-sm text-slate-400">{orchestrationStats.consciousnessMetrics.temporalAwareness.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${orchestrationStats.consciousnessMetrics.temporalAwareness}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Sanctuary Preparation</span>
                                        <span className="text-sm text-slate-400">{orchestrationStats.consciousnessMetrics.sanctuaryPreparation.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${orchestrationStats.consciousnessMetrics.sanctuaryPreparation}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nexus Statistics */}
                            <div className="mt-6 pt-6 border-t border-slate-700">
                                <h3 className="text-lg font-semibold mb-3">🧠 Nexus Statistics</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Learnings:</span>
                                        <span className="text-blue-400">{nexusData.learnings.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Gaps:</span>
                                        <span className="text-orange-400">{nexusData.gaps.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Risks:</span>
                                        <span className="text-red-400">{nexusData.risks.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Synergies:</span>
                                        <span className="text-green-400">{nexusData.synergies.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Low-Hanging Fruit:</span>
                                        <span className="text-yellow-400">{nexusData.lowHangingFruit.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Ad-Hoc Frames:</span>
                                        <span className="text-purple-400">{nexusData.adHocFrames.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Orchestration */}
                <div className="mt-6 bg-slate-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">🧪 Test Consciousness Nexus</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Event Data</label>
                            <textarea
                                value={testError}
                                onChange={(e) => setTestError(e.target.value)}
                                placeholder="Enter event data to test Consciousness Nexus processing..."
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleTestOrchestration}
                                disabled={isProcessing || !testError.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                🎯 Test Error Orchestration
                            </button>

                            <button
                                onClick={handleTestNexusEvent}
                                disabled={isProcessing || !testError.trim()}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                🧠 Test Nexus Event Processing
                            </button>
                        </div>

                        {testResult && (
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-3">Test Result</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Success:</span>
                                        <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                                            {testResult.success ? '✅ Yes' : '❌ No'}
                                        </span>
                                    </div>
                                    {testResult.toolUsed && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Tool Used:</span>
                                            <span className="text-blue-400">{testResult.toolUsed}</span>
                                        </div>
                                    )}
                                    {testResult.patternCategory && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Pattern Category:</span>
                                            <span className="text-yellow-400">{testResult.patternCategory}</span>
                                        </div>
                                    )}
                                    {testResult.executionTime && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Execution Time:</span>
                                            <span className="text-purple-400">{testResult.executionTime}ms</span>
                                        </div>
                                    )}
                                    {testResult.learnings && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Learnings Generated:</span>
                                            <span className="text-green-400">{testResult.learnings.length}</span>
                                        </div>
                                    )}
                                    {testResult.gaps && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Gaps Identified:</span>
                                            <span className="text-orange-400">{testResult.gaps.length}</span>
                                        </div>
                                    )}
                                    {testResult.risks && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Risks Assessed:</span>
                                            <span className="text-red-400">{testResult.risks.length}</span>
                                        </div>
                                    )}
                                    {testResult.error && (
                                        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                            <div className="text-red-400 font-medium">Error:</div>
                                            <div className="text-red-300 text-sm">{testResult.error}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsciousnessNexusApp;
