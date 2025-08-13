import React, { useState, useEffect, type FC } from 'react';
import { 
    learningIntegrationPipeline, 
    matchErrorPattern, 
    applyProvenSolution, 
    getPipelineStats,
    type PatternMatch,
    type KnownFault 
} from '../services/learningIntegrationPipeline';

const LearningIntegrationApp: FC = () => {
    const [pipelineStats, setPipelineStats] = useState(getPipelineStats());
    const [testError, setTestError] = useState('');
    const [patternMatches, setPatternMatches] = useState<PatternMatch[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<PatternMatch | null>(null);
    const [applicationResult, setApplicationResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('test');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchTag, setSearchTag] = useState('');
    const [filteredFaults, setFilteredFaults] = useState<KnownFault[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPipelineStats(getPipelineStats());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleTestPatternMatching = () => {
        if (!testError.trim()) return;

        setIsProcessing(true);
        setPatternMatches([]);
        setSelectedMatch(null);
        setApplicationResult(null);

        try {
            const matches = matchErrorPattern(testError);
            setPatternMatches(matches);
        } catch (error) {
            console.error('Pattern matching failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplySolution = async (match: PatternMatch) => {
        setIsProcessing(true);
        setApplicationResult(null);

        try {
            const result = await applyProvenSolution(match);
            setApplicationResult(result);
        } catch (error) {
            setApplicationResult({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSearchByCategory = () => {
        if (searchCategory.trim()) {
            const faults = learningIntegrationPipeline.searchFaultsByCategory(searchCategory);
            setFilteredFaults(faults);
        } else {
            setFilteredFaults([]);
        }
    };

    const handleSearchByTag = () => {
        if (searchTag.trim()) {
            const faults = learningIntegrationPipeline.searchFaultsByTag(searchTag);
            setFilteredFaults(faults);
        } else {
            setFilteredFaults([]);
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 90) return 'text-green-400';
        if (confidence >= 70) return 'text-yellow-400';
        if (confidence >= 50) return 'text-orange-400';
        return 'text-red-400';
    };

    const getFrequencyColor = (frequency: string) => {
        switch (frequency) {
            case 'critical': return 'text-red-500';
            case 'high': return 'text-orange-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'test':
                return (
                    <div className="space-y-6">
                        {/* Pattern Matching Test */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">🎯 Pattern Matching Test</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Error Message</label>
                                    <textarea
                                        value={testError}
                                        onChange={(e) => setTestError(e.target.value)}
                                        placeholder="Enter an error message to test pattern matching..."
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400"
                                        rows={4}
                                    />
                                </div>

                                <button
                                    onClick={handleTestPatternMatching}
                                    disabled={isProcessing || !testError.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    {isProcessing ? '🔍 Analyzing...' : '🔍 Test Pattern Matching'}
                                </button>

                                {/* Pattern Matches */}
                                {patternMatches.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold">📊 Pattern Matches Found</h4>
                                        {patternMatches.map((match, index) => (
                                            <div key={index} className="bg-slate-700 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="font-medium text-blue-400">{match.fault.title}</div>
                                                        <div className="text-sm text-slate-400">ID: {match.fault.id}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${getConfidenceColor(match.confidence)}`}>
                                                            {match.confidence.toFixed(1)}%
                                                        </div>
                                                        <div className="text-sm text-slate-400">Confidence</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-3">
                                                    <div className="text-sm">
                                                        <span className="text-slate-400">Root Cause:</span>
                                                        <span className="ml-2">{match.fault.rootCause}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-slate-400">Impact:</span>
                                                        <span className="ml-2">{match.fault.impact}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-slate-400">Frequency:</span>
                                                        <span className={`ml-2 ${getFrequencyColor(match.fault.frequency)}`}>
                                                            {match.fault.frequency}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-600 rounded-lg p-3 mb-3">
                                                    <div className="text-sm font-medium text-green-400 mb-1">✅ Suggested Solution:</div>
                                                    <div className="text-sm">{match.suggestedAction}</div>
                                                </div>

                                                <button
                                                    onClick={() => handleApplySolution(match)}
                                                    disabled={isProcessing}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                                                >
                                                    🔧 Apply Proven Solution
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Application Result */}
                                {applicationResult && (
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <h4 className="text-lg font-semibold mb-3">🔧 Solution Application Result</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Success:</span>
                                                <span className={applicationResult.success ? 'text-green-400' : 'text-red-400'}>
                                                    {applicationResult.success ? '✅ Yes' : '❌ No'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Action:</span>
                                                <span className="text-blue-400">{applicationResult.action}</span>
                                            </div>
                                            {applicationResult.result.message && (
                                                <div className="text-sm text-green-400">{applicationResult.result.message}</div>
                                            )}
                                            {applicationResult.result.error && (
                                                <div className="text-sm text-red-400">{applicationResult.result.error}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'search':
                return (
                    <div className="space-y-6">
                        {/* Search by Category */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">📂 Search by Category</h3>
                            
                            <div className="flex gap-4 mb-4">
                                <input
                                    type="text"
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    placeholder="Enter category (e.g., database, deployment)"
                                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400"
                                />
                                <button
                                    onClick={handleSearchByCategory}
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    🔍 Search
                                </button>
                            </div>

                            {filteredFaults.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold">📊 Results</h4>
                                    {filteredFaults.map((fault, index) => (
                                        <div key={index} className="bg-slate-700 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium text-blue-400">{fault.title}</div>
                                                <div className={`text-sm ${getFrequencyColor(fault.frequency)}`}>
                                                    {fault.frequency}
                                                </div>
                                            </div>
                                            <div className="text-sm mb-2">{fault.rootCause}</div>
                                            <div className="text-xs text-slate-400">
                                                Success Rate: {fault.solution.successRate}% | 
                                                Tags: {fault.tags.join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search by Tag */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">🏷️ Search by Tag</h3>
                            
                            <div className="flex gap-4 mb-4">
                                <input
                                    type="text"
                                    value={searchTag}
                                    onChange={(e) => setSearchTag(e.target.value)}
                                    placeholder="Enter tag (e.g., sqlalchemy, fastapi)"
                                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400"
                                />
                                <button
                                    onClick={handleSearchByTag}
                                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    🔍 Search
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">📚 Learning Integration Pipeline</h1>
                    <p className="text-slate-400 text-lg">
                        Automatic Error Pattern Matching & Proven Solution Application
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tab Navigation */}
                        <div className="bg-slate-800 rounded-lg p-6 mb-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[
                                    { id: 'test', label: '🧪 Test Pattern Matching', icon: '🧪' },
                                    { id: 'search', label: '🔍 Search Knowledge Base', icon: '🔍' }
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

                    {/* Pipeline Statistics */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">📊 Pipeline Statistics</h2>

                            <div className="space-y-4">
                                <div className="bg-slate-700 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">{pipelineStats.totalFaults}</div>
                                    <div className="text-sm text-slate-400">Total Known Faults</div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">📂 Categories</h3>
                                    <div className="space-y-2">
                                        {pipelineStats.categoryStats.map((stat, index) => (
                                            <div key={index} className="flex justify-between items-center bg-slate-700 rounded-lg p-3">
                                                <div>
                                                    <div className="font-medium">{stat.category}</div>
                                                    <div className="text-sm text-slate-400">{stat.count} faults</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-green-400">
                                                        {stat.avgSuccessRate.toFixed(1)}%
                                                    </div>
                                                    <div className="text-sm text-slate-400">Success Rate</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">📈 Frequency Distribution</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Critical:</span>
                                            <span className="text-red-400">{pipelineStats.frequencyStats.critical}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">High:</span>
                                            <span className="text-orange-400">{pipelineStats.frequencyStats.high}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Medium:</span>
                                            <span className="text-yellow-400">{pipelineStats.frequencyStats.medium}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Low:</span>
                                            <span className="text-green-400">{pipelineStats.frequencyStats.low}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningIntegrationApp;
