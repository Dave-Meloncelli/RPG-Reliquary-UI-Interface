
import React, { useRef, useEffect, FC } from 'react';
import * as monaco from 'monaco-editor';

// Since we are using an import map with the ?worker suffix,
// monaco-editor's ESM build will automatically handle the worker loading.
// We just need to ensure the base path is configured if it's not at the root.

interface MonacoWrapperProps {
    path: string;
    defaultValue: string;
    onChange?: (value: string) => void;
}

const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'json':
            return 'json';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'md':
            return 'markdown';
        default:
            return 'plaintext';
    }
};

const MonacoWrapper: FC<MonacoWrapperProps> = ({ path, defaultValue, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
                value: defaultValue,
                language: getLanguageFromPath(path),
                theme: 'vs-dark',
                automaticLayout: true,
                readOnly: false, // For now, allow editing.
                minimap: { enabled: true },
                fontSize: 14,
                wordWrap: 'on',
            });
            
            monacoInstanceRef.current.onDidChangeModelContent(() => {
                onChange?.(monacoInstanceRef.current?.getValue() || '');
            });
        }

        return () => {
            if (monacoInstanceRef.current) {
                monacoInstanceRef.current.dispose();
                monacoInstanceRef.current = null;
            }
        };
    }, [path, defaultValue, onChange]);

    return <div ref={editorRef} className="w-full h-full absolute" />;
};

export default MonacoWrapper;
