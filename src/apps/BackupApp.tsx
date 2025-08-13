import React, { useState, useCallback, useEffect, type FC } from "react";

import type { BackupStatus, BackupLogEntry } from "../types";

const StatusDisplay: FC<{ status: BackupStatus }> = ({ status }) => {
  const isSuccess = status.lastBackupStatus === "Success";
  const isNeverRun = status.lastBackupStatus === "Never run";

  const statusColor = isSuccess
    ? "text-green-400"
    : isNeverRun
      ? "text-slate-500"
      : "text-red-400";

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center">
      <p className="text-sm text-slate-400">Last Backup Status</p>
      <p className={`text-xl font-bold mt-1 ${statusColor}`}>
        {status.lastBackupStatus}
      </p>
      {status.lastBackupTimestamp && (
        <p className="text-xs text-slate-500 mt-1">
          at {status.lastBackupTimestamp}
        </p>
      )}
    </div>
  );
};

const LogViewer: FC<{ logs: BackupLogEntry[] }> = ({ logs }) => {
  const logEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-black/40 rounded-lg p-2 flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-1 pr-2">
        {logs.map((log) => (
          <div key={log.id} className="font-mono text-xs">
            <span className="text-slate-500 mr-2">{log.timestamp}</span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

const BackupApp: React.FC = () => {
  const [status, setStatus] = useState<BackupStatus>({
    lastBackupStatus: "Never run",
    lastBackupTimestamp: null,
  });
  const [logs, setLogs] = useState<BackupLogEntry[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleRunBackup = useCallback(async () => {
    if (isBackingUp) return;

    setIsBackingUp(true);
    setLogs([]);

    try {
      const backupGenerator = runBackupProcess();
      for await (const log of backupGenerator) {
        setLogs((prev) => [...prev, log]);
      }
      setStatus({
        lastBackupStatus: "Success",
        lastBackupTimestamp: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Backup failed:", error);
      setStatus({
        lastBackupStatus: "Failed",
        lastBackupTimestamp: new Date().toLocaleString(),
      });
      setLogs((prev) => [
        ...prev,
        {
          id: 999,
          timestamp: new Date().toLocaleTimeString(),
          message: "ERROR: The backup process failed unexpectedly.",
        },
      ]);
    } finally {
      setIsBackingUp(false);
    }
  }, [isBackingUp]);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Backup & Recovery</h2>
        <p className="text-sm text-slate-400">
          Manage and monitor system backup protocols.
        </p>
      </div>

      <div className="p-4 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <StatusDisplay status={status} />
        </div>
        <div className="col-span-2 flex items-center">
          <button
            onClick={handleRunBackup}
            disabled={isBackingUp}
            className="w-full h-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition text-lg flex items-center justify-center gap-2"
          >
            {isBackingUp ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Run Full System Backup"
            )}
          </button>
        </div>
      </div>

      <div className="flex-grow p-4 pt-0 min-h-0">
        <LogViewer logs={logs} />
      </div>
    </div>
  );
};

export default BackupApp;
