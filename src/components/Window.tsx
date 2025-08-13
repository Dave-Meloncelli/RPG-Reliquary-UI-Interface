import React, { useState, useRef, useEffect, type ReactNode } from "react";

import ErrorBoundary from "./ErrorBoundary";

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (x: number, y: number) => void;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  initialPosition,
  initialSize,
  zIndex,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current || isMaximized) return; // Disable dragging when maximized
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !windowRef.current || isMaximized) return;
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Constrain to viewport
      newX = Math.max(
        0,
        Math.min(newX, window.innerWidth - windowRef.current.offsetWidth),
      );
      newY = Math.max(
        0,
        Math.min(newY, window.innerHeight - windowRef.current.offsetHeight),
      );

      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onPositionChange, isMaximized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        left: "0px",
        top: "0px",
        width: "100%",
        height: "calc(100% - 6rem)", // Leave space for dock
        zIndex,
        transition: "width 0.2s ease-in-out, height 0.2s ease-in-out",
      }
    : {
        left: `${initialPosition.x}px`,
        top: `${initialPosition.y}px`,
        width: `${initialSize.width}px`,
        height: `${initialSize.height}px`,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="absolute bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl flex flex-col"
      style={windowStyle}
      onMouseDown={onFocus}
    >
      <div
        className={`h-8 bg-slate-900/70 rounded-t-lg flex items-center justify-between px-2 ${isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold text-slate-300 select-none">
          {title}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-400 focus:outline-none"
          ></button>
          <button
            onClick={onMaximize}
            className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-400 focus:outline-none"
          ></button>
          <button
            onClick={onClose}
            className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 focus:outline-none"
          ></button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  );
};

export default Window;
