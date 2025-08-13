import React from "react";

import { useWindows } from "../context/WindowContext";

import Window from "./Window";

const Desktop: React.FC = () => {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    focusWindow,
    maximizeWindow,
    updateWindowPosition,
  } = useWindows();

  return (
    <div className="absolute inset-0 w-full h-full">
      {windows
        .filter((win) => !win.isMinimized)
        .map((win) => (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            initialPosition={{ x: win.x, y: win.y }}
            initialSize={{ width: win.width, height: win.height }}
            zIndex={win.zIndex}
            isMaximized={win.isMaximized}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onPositionChange={(x, y) => updateWindowPosition(win.id, x, y)}
          >
            <win.Component />
          </Window>
        ))}
    </div>
  );
};

export default Desktop;
