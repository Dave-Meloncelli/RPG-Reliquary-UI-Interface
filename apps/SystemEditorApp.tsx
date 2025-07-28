
import React, { useState, useCallback } from 'react';
import { fileSystemService } from '../services/fileSystemService';
import FileExplorer from '../components/editor/FileExplorer';
import EditorPane from '../components/editor/EditorPane';

export interface OpenFile {
    path: string;
    name: string;
    content: string;
}

const SystemEditorApp: React.FC = () => {
    const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
    const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
    const [consoleOutput, setConsoleOutput] = useState<string[]>(['Welcome to the Vault OS build system.']);
    const [isDeploying, setIsDeploying] = useState(false);
    const fileTree = fileSystemService.getTree();

    const handleOpenFile = useCallback((path: string, name: string) => {
        // Don't re-open if already open
        if (openFiles.some(f => f.path === path)) {
            setActiveFilePath(path);
            return;
        }

        const content = fileSystemService.getFileContent(path);
        if (content !== null) {
            const newFile: OpenFile = { path, name, content };
            setOpenFiles(prev => [...prev, newFile]);
            setActiveFilePath(path);
        }
    }, [openFiles]);

    const handleCloseFile = useCallback((path: string) => {
        const fileIndex = openFiles.findIndex(f => f.path === path);
        if (fileIndex === -1) return;

        const newOpenFiles = openFiles.filter(f => f.path !== path);
        setOpenFiles(newOpenFiles);

        if (activeFilePath === path) {
            if (newOpenFiles.length > 0) {
                // Set active to the previous file, or the first one
                const newActiveIndex = Math.max(0, fileIndex - 1);
                setActiveFilePath(newOpenFiles[newActiveIndex].path);
            } else {
                setActiveFilePath(null);
            }
        }
    }, [openFiles, activeFilePath]);

    const handleContentChange = useCallback((path: string, newContent: string) => {
      setOpenFiles(prev => prev.map(f => (f.path === path ? { ...f, content: newContent } : f)));
    }, []);

    const handleSaveActiveFile = useCallback((path: string) => {
      const file = openFiles.find(f => f.path === path);
      if (!file) return;
      const ok = fileSystemService.saveFileContent(path, file.content);
      setConsoleOutput(prev => [...prev, ok ? `[EDITOR] Saved ${file.name}` : `[EDITOR] Failed to save ${file.name}`]);
    }, [openFiles]);

    const handleDeploy = useCallback(async () => {
        setIsDeploying(true);
        setConsoleOutput(['[SYSTEM] Initiating simulated deployment...']);

        const steps = [
            'Running pre-flight checks...',
            'Linting codebase... OK',
            'Compiling TypeScript modules...',
            'Transpiling JSX... OK',
            'Bundling assets...',
            'Minifying JavaScript... OK',
            'Finalizing package...',
            '[SUCCESS] Simulated deployment complete. System restart not required.'
        ];
        
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
            setConsoleOutput(prev => [...prev, `[BUILD] ${step}`]);
        }
        
        setIsDeploying(false);
    }, []);

    const activeFile = openFiles.find(f => f.path === activeFilePath) || null;

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="flex-grow flex min-h-0">
                {/* File Explorer */}
                <div className="w-1/5 min-w-[200px] bg-slate-900/50 border-r border-slate-700/50 overflow-y-auto">
                    <FileExplorer node={fileTree} onFileSelect={handleOpenFile} basePath="" />
                </div>

                {/* Editor & Console */}
                <div className="flex-grow flex flex-col">
                    <div className="flex-grow h-2/3">
                       <EditorPane 
                            openFiles={openFiles}
                            activeFilePath={activeFilePath}
                            onSelectTab={setActiveFilePath}
                            onCloseTab={handleCloseFile}
                            onContentChange={handleContentChange}
                            onSave={handleSaveActiveFile}
                            activeFile={activeFile}
                       />
                    </div>
                    <div className="h-1/3 flex flex-col border-t border-slate-700/50">
                        <div className="flex justify-between items-center p-2 bg-slate-800/60 flex-shrink-0">
                            <h3 className="font-bold text-sm">Console</h3>
                            <button 
                                onClick={handleDeploy}
                                disabled={isDeploying}
                                className="px-3 py-1 text-xs font-bold rounded-md bg-green-600 hover:bg-green-500 disabled:bg-slate-600 transition"
                            >
                                {isDeploying ? 'Deploying...' : 'Deploy'}
                            </button>
                        </div>
                        <div className="flex-grow bg-black/40 p-2 overflow-y-auto font-mono text-xs">
                            {consoleOutput.map((line, i) => (
                                <p key={i} className="whitespace-pre-wrap">{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemEditorApp;
