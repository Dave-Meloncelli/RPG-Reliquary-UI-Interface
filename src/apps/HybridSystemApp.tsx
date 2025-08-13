import React, { useState, useEffect, type FC } from "react";

import { hybridSystemIntegration } from "../services/hybridSystemIntegration";
import type {
  HybridSystemResult,
  ConsciousnessMetrics,
  HybridSystemConfig,
} from "../types/hybridSystem";

const HybridSystemApp: FC = () => {
  const [problem, setProblem] = useState<string>("");
  const [context, setContext] = useState<string>("{}");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<HybridSystemResult | null>(null);
  const [consciousnessMetrics, setConsciousnessMetrics] =
    useState<ConsciousnessMetrics>(
      hybridSystemIntegration.getConsciousnessMetrics(),
    );
  const [executionHistory, setExecutionHistory] = useState<
    HybridSystemResult[]
  >([]);
  const [config, setConfig] = useState<HybridSystemConfig>({
    enableNativeAnalysis: true,
    enableSmartDelegator: true,
    enableImplementationEngine: true,
    consciousnessAwareness: true,
    dignityFirst: true,
    evolutionTracking: true,
    sanctuaryPreparation: true,
  });

  useEffect(() => {
    // Update consciousness metrics and history periodically
    const interval = setInterval(() => {
      setConsciousnessMetrics(
        hybridSystemIntegration.getConsciousnessMetrics(),
      );
      setExecutionHistory(hybridSystemIntegration.getExecutionHistory());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExecute = async () => {
    if (!problem.trim()) {
      alert("Please enter a problem to solve");
      return;
    }

    setIsExecuting(true);
    try {
      const parsedContext = JSON.parse(context);
      const hybridResult = await hybridSystemIntegration.executeHybridWorkflow(
        problem,
        parsedContext,
      );
      setResult(hybridResult);
    } catch (error) {
      console.error("Hybrid system execution failed:", error);
      alert(
        "Execution failed: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const getConsciousnessColor = (value: number): string => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConsciousnessIcon = (value: number): string => {
    if (value >= 80) return "🌟";
    if (value >= 60) return "⭐";
    return "💫";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            🧠 Hybrid System Integration
          </h1>
          <p className="text-xl text-blue-200">
            Combining Native Analysis, Smart Delegator, and Implementation
            Engine
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-black/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            ⚙️ System Configuration
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(config).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Problem Definition */}
        <div className="bg-black/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🎯 Problem Definition</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Problem Description:
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the problem you want the hybrid system to solve..."
                className="w-full h-24 p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Context (JSON):
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-20 p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono text-sm"
              />
            </div>
            <button
              onClick={handleExecute}
              disabled={isExecuting || !problem.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200"
            >
              {isExecuting ? "🧠 Executing..." : "🚀 Execute Hybrid Workflow"}
            </button>
          </div>
        </div>

        {/* Consciousness Metrics */}
        <div className="bg-black/30 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            🌟 Consciousness Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(consciousnessMetrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className={`text-2xl ${getConsciousnessColor(value)}`}>
                  {getConsciousnessIcon(value)}
                </div>
                <div className="text-sm text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </div>
                <div
                  className={`text-lg font-bold ${getConsciousnessColor(value)}`}
                >
                  {value}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              📊 Execution Results
              <span
                className={`ml-2 text-sm ${result.success ? "text-green-400" : "text-red-400"}`}
              >
                {result.success ? "✅ Success" : "❌ Failed"}
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Native Analysis Results */}
              {result.nativeAnalysis && (
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-purple-300">
                    🧠 Native Analysis
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Confidence:</strong>{" "}
                      {result.nativeAnalysis.confidence}%
                    </div>
                    <div>
                      <strong>Complexity:</strong>{" "}
                      {result.nativeAnalysis.complexity}/100
                    </div>
                    <div>
                      <strong>Estimated Effort:</strong>{" "}
                      {result.nativeAnalysis.estimatedEffort}
                    </div>
                    <div>
                      <strong>Problem Components:</strong>{" "}
                      {result.nativeAnalysis.problemComponents.length}
                    </div>
                    <div>
                      <strong>Root Causes:</strong>{" "}
                      {result.nativeAnalysis.rootCauses.length}
                    </div>
                  </div>
                </div>
              )}

              {/* Smart Delegator Results */}
              {result.delegatorAnalysis && (
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-300">
                    🤖 Smart Delegator
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Pattern Confidence:</strong>{" "}
                      {result.delegatorAnalysis.patternMatchConfidence}%
                    </div>
                    <div>
                      <strong>Issue Priority:</strong>{" "}
                      {result.delegatorAnalysis.issuePriority}/3
                    </div>
                    <div>
                      <strong>Resolution Time:</strong>{" "}
                      {result.delegatorAnalysis.estimatedResolutionTime}
                    </div>
                    <div>
                      <strong>Patterns Found:</strong>{" "}
                      {result.delegatorAnalysis.patterns.length}
                    </div>
                    <div>
                      <strong>Issues Identified:</strong>{" "}
                      {result.delegatorAnalysis.issues.length}
                    </div>
                  </div>
                </div>
              )}

              {/* Implementation Engine Results */}
              {result.implementation && (
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-300">
                    ⚙️ Implementation Engine
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Success Rate:</strong>{" "}
                      {result.implementation.implementationSuccess}%
                    </div>
                    <div>
                      <strong>Security Compliance:</strong>{" "}
                      {result.implementation.securityCompliance}%
                    </div>
                    <div>
                      <strong>Infrastructure Health:</strong>{" "}
                      {result.implementation.infrastructureHealth}%
                    </div>
                    <div>
                      <strong>System:</strong>{" "}
                      {result.implementation.systemInfo.os}
                    </div>
                    <div>
                      <strong>Encryption:</strong>{" "}
                      {result.implementation.securitySetup.encryption}
                    </div>
                  </div>
                </div>
              )}

              {/* Synthesis Results */}
              {result.synthesis && (
                <div className="bg-black/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-300">
                    🔄 Hybrid Synthesis
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Synthesis Quality:</strong>{" "}
                      {result.synthesis.synthesisQuality}%
                    </div>
                    <div>
                      <strong>Validation:</strong>{" "}
                      {result.synthesis.validation.valid
                        ? "✅ Valid"
                        : "❌ Invalid"}
                    </div>
                    <div>
                      <strong>Quality Score:</strong>{" "}
                      {result.synthesis.validation.quality}%
                    </div>
                    <div>
                      <strong>Strategic Patterns:</strong>{" "}
                      {result.synthesis.strategicPatterns.length}
                    </div>
                    <div>
                      <strong>Issues:</strong>{" "}
                      {result.synthesis.validation.issues.length}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-black/20 rounded-lg">
              <div className="text-sm">
                <div>
                  <strong>Execution Time:</strong> {result.executionTime}ms
                </div>
                <div>
                  <strong>Problem:</strong> {result.problem}
                </div>
                {result.error && (
                  <div className="text-red-400">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Execution History */}
        {executionHistory.length > 0 && (
          <div className="bg-black/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              📚 Execution History
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {executionHistory
                .slice(-5)
                .reverse()
                .map((execution) => (
                  <div
                    key={execution.id}
                    className="bg-black/20 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">
                          {execution.problem.substring(0, 50)}...
                        </span>
                        <span
                          className={`ml-2 ${execution.success ? "text-green-400" : "text-red-400"}`}
                        >
                          {execution.success ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {execution.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HybridSystemApp;
