
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';

const ImageGeneratorApp: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        const result = await generateImage(prompt);

        if (result.startsWith('data:image')) {
            setImageUrl(result);
        } else {
            setError(result);
        }
        setIsLoading(false);
    }, [prompt, isLoading]);
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerate();
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans p-4 overflow-y-auto">
            <h2 className="text-lg font-bold text-center mb-4 text-white">Image Generator</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A futuristic cityscape at sunset..."
                    className="w-full h-24 p-2 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    disabled={isLoading}
                    aria-label="Image generation prompt"
                />
                <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-200"
                >
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>
            
            <div className="flex-grow mt-4 flex items-center justify-center bg-black/30 rounded-md overflow-hidden min-h-0">
                {isLoading && (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating image...</span>
                    </div>
                )}
                {error && <p className="text-red-400 p-4 text-center">{error}</p>}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
                )}
                 {!isLoading && !error && !imageUrl && (
                    <p className="text-slate-500">Your generated image will appear here.</p>
                 )}
            </div>
        </div>
    );
};

export default ImageGeneratorApp;
