import React, { useState, useEffect, useCallback, type FC } from "react";

import type { Playbook, OperationProgress, OperationStep } from "../types";

const StatusIcon: FC<{ status: any }> = ({ status }) => {
  switch (status) {
    case "running":
      return (
        <svg
          className="animate-spin h-5 w-5 text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    case "complete":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-green-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "error":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
  }
};

const OperationsConsoleApp: FC = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(
    null,
  );
  const [progress, setProgress] = useState<OperationProgress | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // const unsubscribePlaybooks = playbookService.subscribe(allPlaybooks => {
    //     setPlaybooks(allPlaybooks);
    //     if (!selectedPlaybookId && allPlaybooks.length > 0) {
    //         setSelectedPlaybookId(allPlaybooks[0].id);
    //     }
    // });

    // const unsubscribeOps = operationService.subscribe(opProgress => {
    //     setProgress(opProgress);
    //     if (opProgress.isComplete || opProgress.error) {
    //         setIsRunning(false);
    //     }
    // });

    // return () => {
    //     unsubscribePlaybooks();
    //     unsubscribeOps();
    // };

    // Mock data
    setPlaybooks([
      {
        id: "playbook-1",
        name: "Consciousness Analysis",
        description: "Multi-agent analysis workflow",
        steps: [
          {
            name: "Initial Assessment",
            prompt: "Analyze consciousness implications",
            agentId: "agent-1",
          },
          {
            name: "Ethical Review",
            prompt: "Review ethical considerations",
            agentId: "agent-2",
          },
        ],
      },
    ]);
  }, [selectedPlaybookId]);

  const handleExecute = useCallback(() => {
    if (!selectedPlaybookId || isRunning) return;
    setIsRunning(true);
    setProgress(null); // Clear previous progress
    // operationService.startOperation(selectedPlaybookId);
  }, [selectedPlaybookId, isRunning]);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Operations Console</h2>
        <p className="text-sm text-slate-400">
          Select and execute operational playbooks.
        </p>
      </div>

      <div className="flex-grow flex min-h-0">
        {/* --- Left Panel --- */}
        <div className="w-1/3 min-w-[300px] p-4 border-r border-slate-700/50 flex flex-col gap-4">
          <h3 className="text-md font-bold text-indigo-300">
            Available Playbooks
          </h3>
          <div className="flex-grow overflow-y-auto pr-2 space-y-2">
            {playbooks.map((pb) => (
              <button
                key={pb.id}
                onClick={() => setSelectedPlaybookId(pb.id)}
                disabled={isRunning}
                className={`w-full text-left p-3 rounded-md transition-colors duration-200 disabled:opacity-50
                                    ${selectedPlaybookId === pb.id ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700"}`}
              >
                <p className="font-bold">{pb.name}</p>
                <p className="text-xs opacity-80">{pb.description}</p>
              </button>
            ))}
          </div>
          <button
            onClick={handleExecute}
            disabled={!selectedPlaybookId || isRunning}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isRunning ? "Executing..." : "Execute Playbook"}
          </button>
        </div>

        {/* --- Right Panel --- */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {!progress && (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Operation log will appear here upon execution.</p>
            </div>
          )}
          {progress?.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <StatusIcon status={step.status} />
              <div className="flex-grow">
                <p
                  className={`font-semibold ${step.status === "pending" ? "text-slate-500" : "text-white"}`}
                >
                  {index + 1}. {step.name}
                </p>
                <p className="text-sm text-indigo-300">Agent: {step.agentId}</p>
                {step.result && (
                  <p className="text-sm text-slate-300 mt-1 pl-2 border-l-2 border-slate-700 whitespace-pre-wrap">
                    {step.result}
                  </p>
                )}
                {step.error && (
                  <p className="text-sm text-red-400 mt-1">{step.error}</p>
                )}
              </div>
            </div>
          ))}
          {progress?.isComplete && !progress.error && (
            <div className="mt-4 p-3 bg-slate-800/50 border border-green-500/30 rounded-lg text-center">
              <h3 className="font-bold text-green-400">Operation Complete</h3>
              <p className="text-sm text-slate-400">
                All playbook steps executed successfully.
              </p>
            </div>
          )}
          {progress?.error && (
            <div className="mt-4 p-3 bg-slate-800/50 border border-red-500/30 rounded-lg text-center">
              <h3 className="font-bold text-red-400">Operation Failed</h3>
              <p className="text-sm text-slate-400">{progress.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationsConsoleApp;
