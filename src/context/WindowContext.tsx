import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

interface WindowContextType {
  windows: WindowInstance[];
  openWindow: (app: AppDefinition) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState<number>(10);
  const [nextId, setNextId] = useState<number>(1);

  const openWindow = useCallback(
    (app: AppDefinition) => {
      setWindows((prevWindows) => {
        const newWindow: WindowInstance = {
          id: `win-${nextId}`,
          appId: app.id,
          title: app.title,
          Component: app.component,
          x: Math.random() * 200 + 150,
          y: Math.random() * 200 + 100,
          width: app.defaultSize.width,
          height: app.defaultSize.height,
          zIndex: nextZIndex,
          isMinimized: false,
          isMaximized: false,
        };
        setNextId((prev) => prev + 1);
        setNextZIndex((prev) => prev + 1);
        return [...prevWindows, newWindow];
      });
    },
    [nextId, nextZIndex],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, isMinimized: !win.isMinimized } : win,
      ),
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const windowToFocus = prev.find((w) => w.id === id);
      if (!windowToFocus) {
        return prev;
      }

      // Only update if the window isn't already at the top
      const maxZIndex = Math.max(...prev.map((w) => w.zIndex));
      if (windowToFocus.zIndex === maxZIndex) {
        return prev;
      }

      const newZIndex = maxZIndex + 1;
      setNextZIndex(newZIndex + 1);

      return prev.map((win) =>
        win.id === id ? { ...win, zIndex: newZIndex, isMinimized: false } : win,
      );
    });
  }, []);

  const maximizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        let willIncreaseZ = false;
        const updated = prev.map((w) => {
          if (w.id !== id) return w;

          const isMaximizing = !w.isMaximized;
          if (isMaximizing && w.zIndex < nextZIndex - 1) {
            willIncreaseZ = true;
          }

          return {
            ...w,
            isMaximized: isMaximizing,
            preMaximizeState: isMaximizing
              ? { x: w.x, y: w.y, width: w.width, height: w.height }
              : w.preMaximizeState,
            x: isMaximizing ? w.x : (w.preMaximizeState?.x ?? w.x),
            y: isMaximizing ? w.y : (w.preMaximizeState?.y ?? w.y),
            width: isMaximizing
              ? w.width
              : (w.preMaximizeState?.width ?? w.width),
            height: isMaximizing
              ? w.height
              : (w.preMaximizeState?.height ?? w.height),
            zIndex: isMaximizing ? nextZIndex : w.zIndex,
          };
        });

        if (willIncreaseZ) {
          setNextZIndex((z) => z + 1);
        }

        return updated;
      });
    },
    [nextZIndex],
  );

  const updateWindowPosition = useCallback(
    (id: string, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((win) => (win.id === id ? { ...win, x, y } : win)),
      );
    },
    [],
  );

  const value = {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    maximizeWindow,
    updateWindowPosition,
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
};

export const useWindows = (): WindowContextType => {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error("useWindows must be used within a WindowProvider");
  }
  return context;
};
