

import { ReactNode, ComponentType } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isResizable?: boolean;
  isDraggable?: boolean;
}

export interface AppDefinition {
  id: string;
  name: string;
  description?: string;
  icon: ReactNode;
  category: AppCategory;
  component: ComponentType<AppProps>;
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  isResizable?: boolean;
  isDraggable?: boolean;
  requiresAuth?: boolean;
  dependencies?: string[];
}

export interface AppProps {
  windowId: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isActive?: boolean;
}

export type AppCategory = 
  | 'system' 
  | 'productivity' 
  | 'development' 
  | 'ai' 
  | 'utilities' 
  | 'games' 
  | 'communication'
  | 'monitoring';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SystemInfo {
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  timestamp: number;
}

export interface EventBusEvent {
  type: string;
  payload?: any;
  timestamp: number;
  source?: string;
}

export interface ServiceConfig {
  enabled: boolean;
  retryAttempts?: number;
  timeout?: number;
  baseURL?: string;
}

// Context Types
export interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (appId: string, customProps?: any) => string;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  updateWindow: (windowId: string, updates: Partial<WindowState>) => void;
  bringToFront: (windowId: string) => void;
  getActiveWindow: () => WindowState | null;
}

export interface AppRegistryContextType {
  apps: Record<string, AppDefinition>;
  getApp: (id: string) => AppDefinition | undefined;
  getAppsByCategory: (category: AppCategory) => AppDefinition[];
  registerApp: (app: AppDefinition) => void;
  unregisterApp: (id: string) => void;
}

// Error Types
export interface AppError extends Error {
  code?: string;
  details?: any;
  timestamp: number;
  context?: string;
}

export interface BackendHealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
  uptime?: number;
  services?: Record<string, boolean>;
}

// Utility Types
export type Theme = 'dark' | 'light' | 'auto';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Environment Types
declare global {
  interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_APP_ENV: 'development' | 'production' | 'test';
    readonly VITE_DEBUG_MODE: string;
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_ERROR_REPORTING: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
