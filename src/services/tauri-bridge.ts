import { invoke } from "@tauri-apps/api/tauri";

// Types for Tauri backend responses
export interface ProcessInfo {
  pid: number;
  name: string;
  cpu_usage: number;
  memory_usage: number;
  status: string;
}

export interface SystemStatus {
  total_processes: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: number;
}

export interface FileEntry {
  name: string;
  path: string;
  is_directory: boolean;
  size?: number;
  modified?: string;
}

export interface FileContent {
  content: string;
  encoding: string;
  size: number;
}

export interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  size?: string;
  quality?: string;
}

export interface ImageGenerationResponse {
  image_url?: string;
  image_path?: string;
  error?: string;
}

// Tauri System Service
export class TauriSystemService {
  async executeCommand(command: string): Promise<string> {
    return await invoke("execute_command", { command });
  }

  async listProcesses(): Promise<ProcessInfo[]> {
    return await invoke("list_processes");
  }

  async getSystemStatus(): Promise<SystemStatus> {
    return await invoke("get_system_status");
  }

  async manageDocker(action: string, containerName?: string): Promise<string> {
    return await invoke("manage_docker_containers", { action, containerName });
  }

  async restartService(serviceName: string): Promise<string> {
    return await invoke("restart_service", { serviceName });
  }
}

// Tauri File Service
export class TauriFileService {
  async readFileContent(path: string): Promise<FileContent> {
    return await invoke("read_file_content", { path });
  }

  async writeFileContent(path: string, content: string): Promise<void> {
    return await invoke("write_file_content", { path, content });
  }

  async listDirectory(path: string): Promise<FileEntry[]> {
    return await invoke("list_directory", { path });
  }

  async createDirectory(path: string): Promise<void> {
    return await invoke("create_directory", { path });
  }

  async deleteFile(path: string): Promise<void> {
    return await invoke("delete_file", { path });
  }

  async fileExists(path: string): Promise<boolean> {
    return await invoke("file_exists", { path });
  }

  async getFileInfo(path: string): Promise<FileEntry> {
    return await invoke("get_file_info", { path });
  }
}

// Tauri AI Service
export class TauriAIService {
  async callGemini(request: AIRequest): Promise<AIResponse> {
    return await invoke("call_gemini_api", { request });
  }

  async generateImage(
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResponse> {
    return await invoke("generate_image", { request });
  }

  async analyzeSystemState(): Promise<string> {
    return await invoke("analyze_system_state");
  }

  async getAIModels(): Promise<string[]> {
    return await invoke("get_ai_models");
  }

  async saveAPIKey(provider: string, apiKey: string): Promise<void> {
    return await invoke("save_api_key", { provider, apiKey });
  }

  async testAPIConnection(provider: string): Promise<boolean> {
    return await invoke("test_api_connection", { provider });
  }
}

// Singleton instances
export const systemService = new TauriSystemService();
export const fileService = new TauriFileService();
export const aiService = new TauriAIService();

// Check if Tauri is available
export const isTauriAvailable = (): boolean => {
  return typeof window !== "undefined" && "__TAURI__" in window;
};

// Fallback service factory
export const createService = <T>(tauriService: T, webService: T): T => {
  return isTauriAvailable() ? tauriService : webService;
};
