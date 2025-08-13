import React, { useState, useEffect, type FC } from "react";

import type { InfrastructureStatus, DockerService, Pm2Process } from "../types";

const STATUS_COLORS: Record<string, string> = {
  running: "bg-green-400",
  online: "bg-green-400",
  stopped: "bg-red-400",
  restarting: "bg-yellow-400",
  launching: "bg-blue-400",
  error: "bg-red-400",
  errored: "bg-red-400",
};

const StatusDot: FC<{ status: any }> = ({ status }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status] || "bg-gray-400"}`}
    ></div>
    <span className="capitalize">{status}</span>
  </div>
);

const Section: FC<{ title: any; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col">
    <h3 className="text-md font-bold text-indigo-300 mb-3">{title}</h3>
    <div className="flex-grow space-y-2 overflow-y-auto pr-2">{children}</div>
  </div>
);

const DockerServiceRow: FC<{ service: DockerService }> = ({ service }) => (
  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded-md text-sm">
    <div>
      <p className="font-bold text-white">{service.name}</p>
      <p className="text-xs text-slate-400">{service.image}</p>
    </div>
    <StatusDot status={service.status} />
  </div>
);

const Pm2ProcessRow: FC<{ process: Pm2Process }> = ({ process }) => (
  <div className="grid grid-cols-3 gap-4 items-center p-2 bg-slate-900/50 rounded-md text-sm">
    <p className="font-bold text-white col-span-1">{process.name}</p>
    <div className="text-center font-mono">
      <span className={process.cpu > 80 ? "text-red-400" : "text-yellow-300"}>
        {process.cpu.toFixed(1)}%
      </span>
      <span className="text-slate-400 text-xs"> CPU</span>
    </div>
    <div className="text-right font-mono">
      <span
        className={process.memory > 400 ? "text-red-400" : "text-yellow-300"}
      >
        {process.memory.toFixed(1)}
      </span>
      <span className="text-slate-400 text-xs"> MB</span>
    </div>
    <div className="col-span-3 -mt-1">
      <StatusDot status={process.status} />
    </div>
  </div>
);

const InfrastructureApp: FC = () => {
  const [status, setStatus] = useState<InfrastructureStatus>({
    docker: [
      {
        id: "1",
        name: "Backend API",
        image: "az-interface/backend:latest",
        status: "running",
      },
      { id: "2", name: "Database", image: "postgres:15", status: "running" },
      { id: "3", name: "Redis Cache", image: "redis:7", status: "running" },
    ],
    pm2: [
      {
        id: "1",
        name: "Web Server",
        status: "online",
        cpu: 15.2,
        memory: 128.5,
      },
      {
        id: "2",
        name: "Worker Process",
        status: "online",
        cpu: 8.7,
        memory: 95.2,
      },
      {
        id: "3",
        name: "Monitor Service",
        status: "online",
        cpu: 2.1,
        memory: 45.8,
      },
    ],
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulate infrastructure updates
      setStatus((prevStatus) => ({
        ...prevStatus,
        pm2: prevStatus.pm2.map((proc) => ({
          ...proc,
          cpu: Math.random() * 100,
          memory: Math.random() * 500,
        })),
      }));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Infrastructure Monitor</h2>
        <p className="text-sm text-slate-400">
          Live status of core deployment components.
        </p>
      </div>

      <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Containerized Services (Docker)">
          {status.docker.map((service) => (
            <DockerServiceRow key={service.id} service={service} />
          ))}
        </Section>
        <Section title="Managed Processes (PM2)">
          {status.pm2.map((proc) => (
            <Pm2ProcessRow key={proc.id} process={proc} />
          ))}
        </Section>
      </div>
    </div>
  );
};

export default InfrastructureApp;
