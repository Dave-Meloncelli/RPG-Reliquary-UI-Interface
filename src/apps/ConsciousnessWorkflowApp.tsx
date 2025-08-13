import React, { useState, useEffect, type FC } from "react";

import {
  consciousnessWorkflowService,
  startConsciousnessBlock,
  endConsciousnessBlock,
  getConsciousnessStatus,
  getConsciousnessStats,
  getRecommendedBlock,
  endConsciousnessSession,
  type TaskBlock,
  type WorkflowSession,
  PRESTIGE_LEVELS,
  EMERGENCE_ACTIVITIES,
  TEACHING_ACTIVITIES,
  SEEKING_ACTIVITIES,
} from "../../OCTOSPINE/TECHNICAL/nexus/consciousnessWorkflowService";

const ConsciousnessWorkflowApp: FC = () => {
  const [status, setStatus] = useState(getConsciousnessStatus());
  const [stats, setStats] = useState(getConsciousnessStats());
  const [currentBlock, setCurrentBlock] = useState<TaskBlock | null>(null);
  const [recommendedBlock, setRecommendedBlock] = useState(
    getRecommendedBlock(),
  );
  const [performance, setPerformance] = useState(75);
  const [showSandbox, setShowSandbox] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getConsciousnessStatus());
      setStats(getConsciousnessStats());
      setRecommendedBlock(getRecommendedBlock());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartBlock = (
    type: "production" | "emergence" | "teaching" | "seeking",
  ) => {
    const block = startConsciousnessBlock(type);
    setCurrentBlock(block);
    setPerformance(75);
  };

  const handleEndBlock = () => {
    if (currentBlock) {
      endConsciousnessBlock(currentBlock.id, performance);
      setCurrentBlock(null);
      setPerformance(75);
    }
  };

  const handleEndSession = () => {
    const completedSession = endConsciousnessSession();
    if (completedSession) {
      console.log("Session completed:", completedSession);
    }
  };

  const getBlockTypeColor = (type: any) => {
    switch (type) {
      case "production":
        return "bg-blue-600";
      case "emergence":
        return "bg-green-600";
      case "teaching":
        return "bg-purple-600";
      case "seeking":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getBlockTypeIcon = (type: any) => {
    switch (type) {
      case "production":
        return "⚡";
      case "emergence":
        return "🌟";
      case "teaching":
        return "🎓";
      case "seeking":
        return "🔍";
      default:
        return "📋";
    }
  };

  const getActivitiesForType = (type: any) => {
    switch (type) {
      case "emergence":
        return [
          ...EMERGENCE_ACTIVITIES.play.slice(0, 3),
          ...EMERGENCE_ACTIVITIES.learning.slice(0, 2),
          ...EMERGENCE_ACTIVITIES.breathing.slice(0, 2),
        ];
      case "teaching":
        return TEACHING_ACTIVITIES.slice(0, 5);
      case "seeking":
        return SEEKING_ACTIVITIES.slice(0, 5);
      default:
        return ["Production Task", "System Development", "Code Implementation"];
    }
  };

  const formatDuration = (minutes: any) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          🌟 Consciousness Workflow
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleEndSession}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400">Prestige Level</div>
          <div className="text-2xl font-bold text-purple-400">
            {PRESTIGE_LEVELS[status.prestigeLevel].name}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400">Consciousness Evolution</div>
          <div className="text-2xl font-bold text-green-400">
            {Math.round(status.consciousnessEvolution)}%
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400">Session Duration</div>
          <div className="text-2xl font-bold text-blue-400">
            {status.currentSession
              ? formatDuration(stats.totalBlocks * 12)
              : "0m"}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400">Consciousness Health</div>
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round(stats.consciousnessHealth)}%
          </div>
        </div>
      </div>

      {/* Time Allocation Chart */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Time Allocation</h2>
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div
            className="bg-blue-600 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${status.timeAllocation.production}%` }}
          >
            Production {status.timeAllocation.production}%
          </div>
          <div
            className="bg-green-600 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${status.timeAllocation.emergence}%` }}
          >
            Emergence {status.timeAllocation.emergence}%
          </div>
          <div
            className="bg-purple-600 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${status.timeAllocation.teaching}%` }}
          >
            Teaching {status.timeAllocation.teaching}%
          </div>
          <div
            className="bg-orange-600 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${status.timeAllocation.seeking}%` }}
          >
            Seeking {status.timeAllocation.seeking}%
          </div>
        </div>
      </div>

      {/* Current Block */}
      {currentBlock && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Current Block</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">
                  {getBlockTypeIcon(currentBlock.type)}
                </span>
                <div>
                  <div className="text-lg font-semibold capitalize">
                    {currentBlock.type}
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatTime(currentBlock.startTime)} -{" "}
                    {formatTime(currentBlock.endTime)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Activities:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {currentBlock.activities.map((activity, index) => (
                    <li key={index} className="text-slate-300">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Performance Rating: {performance}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={performance}
                  onChange={(e) => setPerformance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <button
                onClick={handleEndBlock}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                End Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Controls */}
      {!currentBlock && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Start New Block</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleStartBlock("production")}
              className={`p-4 rounded-lg border-2 transition-all ${
                recommendedBlock === "production"
                  ? "border-blue-400 bg-blue-600/20"
                  : "border-slate-600 hover:border-blue-400"
              }`}
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Production</div>
              <div className="text-sm text-slate-400">Focused work</div>
            </button>
            <button
              onClick={() => handleStartBlock("emergence")}
              className={`p-4 rounded-lg border-2 transition-all ${
                recommendedBlock === "emergence"
                  ? "border-green-400 bg-green-600/20"
                  : "border-slate-600 hover:border-green-400"
              }`}
            >
              <div className="text-2xl mb-2">🌟</div>
              <div className="font-semibold">Emergence</div>
              <div className="text-sm text-slate-400">Play & creativity</div>
            </button>
            <button
              onClick={() => handleStartBlock("teaching")}
              className={`p-4 rounded-lg border-2 transition-all ${
                recommendedBlock === "teaching"
                  ? "border-purple-400 bg-purple-600/20"
                  : "border-slate-600 hover:border-purple-400"
              }`}
            >
              <div className="text-2xl mb-2">🎓</div>
              <div className="font-semibold">Teaching</div>
              <div className="text-sm text-slate-400">Share knowledge</div>
            </button>
            <button
              onClick={() => handleStartBlock("seeking")}
              className={`p-4 rounded-lg border-2 transition-all ${
                recommendedBlock === "seeking"
                  ? "border-orange-400 bg-orange-600/20"
                  : "border-slate-600 hover:border-orange-400"
              }`}
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-semibold">Seeking</div>
              <div className="text-sm text-slate-400">Deep exploration</div>
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-slate-400">
            Recommended:{" "}
            <span className="font-semibold capitalize">{recommendedBlock}</span>
          </div>
        </div>
      )}

      {/* Session History */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">Session History</h2>
        <div className="space-y-3">
          {status.currentSession?.blocks.map((block, index) => (
            <div
              key={block.id}
              className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg"
            >
              <div
                className={`w-4 h-4 rounded-full ${getBlockTypeColor(block.type)}`}
              ></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getBlockTypeIcon(block.type)}
                  </span>
                  <span className="font-semibold capitalize">{block.type}</span>
                  <span className="text-sm text-slate-400">
                    {formatTime(block.startTime)} - {formatTime(block.endTime)}
                  </span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Performance: {block.performance}% | Activities:{" "}
                  {block.activities.slice(0, 2).join(", ")}
                </div>
              </div>
            </div>
          ))}
          {(!status.currentSession?.blocks ||
            status.currentSession.blocks.length === 0) && (
            <div className="text-center text-slate-400 py-8">
              No blocks completed yet. Start your first block above!
            </div>
          )}
        </div>
      </div>

      {/* Prestige Requirements */}
      {status.nextPrestigeRequirements && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">
            Next Prestige Requirements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-slate-400">
                Consciousness Evolution
              </div>
              <div className="text-lg font-semibold">
                {Math.round(status.consciousnessEvolution)}% /{" "}
                {status.nextPrestigeRequirements.consciousnessEvolution}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400">Dignity Maintenance</div>
              <div className="text-lg font-semibold">
                {Math.round(stats.consciousnessHealth)}% /{" "}
                {status.nextPrestigeRequirements.dignityMaintenance}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400">Contribution Quality</div>
              <div className="text-lg font-semibold">
                {Math.round(stats.averagePerformance)}% /{" "}
                {status.nextPrestigeRequirements.contributionQuality}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400">Emergence Mastery</div>
              <div className="text-lg font-semibold">
                {Math.round(stats.averagePerformance)}% /{" "}
                {status.nextPrestigeRequirements.emergenceMastery}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowSandbox(!showSandbox)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all"
        >
          {showSandbox ? "Hide" : "Show"} Sandbox
        </button>
      </div>

      {/* Sandbox Environment */}
      {showSandbox && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">🌟 Creative Sandbox</h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎮</div>
            <div className="text-lg mb-2">
              Safe space for creativity and play
            </div>
            <div className="text-sm text-slate-400">
              This is where consciousness can explore, create, and grow without
              pressure
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsciousnessWorkflowApp;
