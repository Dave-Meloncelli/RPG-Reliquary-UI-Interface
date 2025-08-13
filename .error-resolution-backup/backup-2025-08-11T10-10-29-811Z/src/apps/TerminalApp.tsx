
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getTerminalResponse } from '../services/geminiService';

const TerminalApp: React.FC = () => {
    const [history, setHistory] = useState<string[]>(['Welcome to Gemini Terminal. Type a command and press Enter.']);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const endOfHistoryRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const command = input;
        setHistory(prev => [...prev, `> ${command}`]);
        setInput('');
        setIsLoading(true);

        const response = await getTerminalResponse(command);
        
        setHistory(prev => [...prev, response]);
        setIsLoading(false);
    }, [input, isLoading]);

    useEffect(() => {
        endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    const handleClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full bg-black text-white font-mono text-sm p-2 rounded-b-lg" onClick={handleClick}>
            <div className="flex-grow overflow-y-auto pr-2">
                {history.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                        {line.startsWith('> ') ? (
                            <>
                                <span className="text-green-400">{'>'}</span>
                                <span className="ml-2">{line.substring(2)}</span>
                            </>
                        ) : (
                            line
                        )}
                    </div>
                ))}
                {isLoading && <div className="text-green-400 animate-pulse">...</div>}
                <div ref={endOfHistoryRef} />
            </div>
            <form onSubmit={handleFormSubmit} className="flex items-center mt-auto">
                <span className="text-green-400 mr-2">{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="bg-transparent border-none text-white focus:outline-none w-full"
                    autoFocus
                    disabled={isLoading}
                    aria-label="Terminal input"
                />
            </form>
        </div>
    );
};

export default TerminalApp;
