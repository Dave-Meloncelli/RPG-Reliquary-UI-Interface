
import React from 'react';
import type { OpenFile } from '../../apps/SystemEditorApp';
import MonacoWrapper from './MonacoWrapper';

interface EditorPaneProps {
    openFiles: OpenFile[];
    activeFilePath: string | null;
    onSelectTab: (path: string) => void;
    onCloseTab: (path: string) => void;
    onContentChange?: (path: string, value: string) => void;
    onSave?: (path: string) => void;
    activeFile: OpenFile | null;
}

const EditorPane: FC<EditorPaneProps> = ({ openFiles, activeFilePath, onSelectTab, onCloseTab, onContentChange, onSave, activeFile }) => {
    return (
        <div className="flex flex-col h-full bg-slate-800">
            {/* Tabs */}
            <div className="flex items-end bg-slate-900/60 flex-shrink-0">
                {openFiles.map(file => (
                    <div
                        key={file.path}
                        className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-t-2 ${
                            activeFilePath === file.path
                                ? 'bg-slate-800 border-indigo-500'
                                : 'bg-transparent border-transparent hover:bg-slate-800/50'
                        }`}
                        onClick={() => onSelectTab(file.path)}
                    >
                        <span>{file.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(file.path);
                            }}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-600"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                 {activeFile && onSave && (
                    <div className="ml-auto p-1">
                        <button onClick={() => onSave(activeFile.path)} className="px-3 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">Save</button>
                    </div>
                )}
            </div>

            {/* Editor Area */}
            <div className="flex-grow relative">
                {activeFile ? (
                     <MonacoWrapper
                        key={activeFile.path} // Force re-mount on file change
                        path={activeFile.path}
                        defaultValue={activeFile.content}
                        onChange={(val) => onContentChange?.(activeFile.path, val)}
                     />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Select a file to begin editing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorPane;
