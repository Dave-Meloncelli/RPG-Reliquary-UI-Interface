// Mock file system data - simplified version without external dependencies

export interface FileSystemNode {
  name: string;
  content?: string;
  children?: FileSystemNode[];
}

// Mock content for file system data
const mockFileContent = {
  index_tsx: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  App_tsx: `import React from 'react';
import Desktop from './Desktop';
import Dock from './Dock';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900">
      <Desktop />
      <Dock />
    </div>
  );
};

export default App;`,

  types_ts: `export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}`,

  README_md: `# AZ Interface

A comprehensive AI agent platform with desktop-style interface.

## Features
- Multi-agent AI system
- Desktop-style UI
- 39+ applications
- Real-time collaboration`,

  package_json: `{
  "name": "az-interface",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}`,
};

export const fileSystemData: FileSystemNode = {
  name: "az-interface",
  children: [
    {
      name: "src",
      children: [
        {
          name: "index.tsx",
          content: mockFileContent.index_tsx,
        },
        {
          name: "components",
          children: [
            {
              name: "App.tsx",
              content: mockFileContent.App_tsx,
            },
            {
              name: "Desktop.tsx",
              content: "// Desktop component implementation",
            },
            {
              name: "Dock.tsx",
              content: "// Dock component implementation",
            },
          ],
        },
        {
          name: "types",
          children: [
            {
              name: "types.ts",
              content: mockFileContent.types_ts,
            },
          ],
        },
        {
          name: "services",
          children: [
            {
              name: "geminiService.ts",
              content: "// Gemini AI service implementation",
            },
            {
              name: "personaService.ts",
              content: "// Persona management service",
            },
          ],
        },
        {
          name: "apps",
          children: [
            {
              name: "TerminalApp.tsx",
              content: "// Terminal application component",
            },
            {
              name: "AcquisitionsApp.tsx",
              content: "// Acquisitions application component",
            },
          ],
        },
      ],
    },
    {
      name: "public",
      children: [
        {
          name: "index.html",
          content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AZ Interface</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`,
        },
      ],
    },
    {
      name: "package.json",
      content: mockFileContent.package_json,
    },
    {
      name: "README.md",
      content: mockFileContent.README_md,
    },
    {
      name: "vite.config.ts",
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});`,
    },
  ],
};

export default fileSystemData;
