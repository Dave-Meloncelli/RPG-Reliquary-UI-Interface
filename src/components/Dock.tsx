import React from "react";

import { type AppDefinition } from "../constants";
import { useWindows } from "../context/WindowContext";

interface DockProps {
  apps: AppDefinition[];
}

const Dock: React.FC<DockProps> = ({ apps }) => {
  const { openWindow } = useWindows();

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <div className="flex items-center justify-center space-x-2 bg-slate-700/40 backdrop-blur-md p-2 rounded-2xl border border-slate-600/60 shadow-lg">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openWindow(app)}
            className="w-14 h-14 p-2 bg-slate-800/50 rounded-xl hover:bg-indigo-500/50 transition-all duration-200 ease-in-out transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title={app.title}
          >
            <app.icon />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dock;
