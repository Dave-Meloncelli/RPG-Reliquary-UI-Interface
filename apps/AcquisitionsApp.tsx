import React, { useState, useCallback, useRef, useEffect, type FC } from 'react';
import { runAcquisitionPipeline } from '../services/acquisitionService';
import type { AcquisitionProgress, AcquisitionStep, AcquiredBookData } from '../types';

type AppState = 'idle' | 'capturing_front' | 'capturing_back' | 'processing' | 'complete';

const StatusIcon: FC<{ status: AcquisitionStep['status'] }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
        case 'complete':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
        case 'review_pending':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
        case 'error':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
        default:
             return <div className="w-5 h-5 flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div></div>
    }
}

const ControlSlider: FC<{ label: string }> = ({ label }) => (
    <div>
        <label className="text-xs text-slate-400">{label}</label>
        <input type="range" className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
    </div>
);

const WatermarkedImage: FC<{ src: string | null }> = ({ src }) => (
    <div className="relative w-full aspect-[3/4] bg-black/20 rounded-md flex items-center justify-center">
        {src ? <img src={src} alt="Book Cover" className="max-w-full max-h-full object-contain" /> : <p className="text-slate-500 text-sm">Image</p>}
        {src && (
            <div className="absolute bottom-2 right-2 p-1 bg-black/50 rounded text-white text-xs opacity-70">
                <span>LOGO</span>
            </div>
        )}
    </div>
);

const AcquisitionsApp: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('idle');
    const [frontImageDataUrl, setFrontImageDataUrl] = useState<string | null>(null);
    const [backImageDataUrl, setBackImageDataUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState<AcquisitionProgress | null>(null);
    const [manualPrice, setManualPrice] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const isProcessing = appState === 'processing';

    const cleanupStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const startCamera = async () => {
        cleanupStream();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera error:", err);
        }
    };
    
    useEffect(() => {
        if (appState === 'capturing_front' || appState === 'capturing_back') {
            startCamera();
        } else {
            cleanupStream();
        }
        return cleanupStream;
    }, [appState, cleanupStream]);


    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            if (appState === 'capturing_front') {
                setFrontImageDataUrl(dataUrl);
                setAppState('capturing_back');
            } else if (appState === 'capturing_back') {
                setBackImageDataUrl(dataUrl);
                setAppState('idle');
            }
        }
    };
    
    const handleStartAcquisition = useCallback(async () => {
        if (!frontImageDataUrl || !backImageDataUrl || isProcessing) return;

        setAppState('processing');
        setProgress(null);
        setManualPrice('');
        
        const pipelineGenerator = runAcquisitionPipeline(frontImageDataUrl, backImageDataUrl);
        for await (const update of pipelineGenerator) {
            setProgress(update);
        }

        setAppState('complete');
    }, [frontImageDataUrl, backImageDataUrl, isProcessing]);
    
    const handleReset = () => {
        setAppState('idle');
        setFrontImageDataUrl(null);
        setBackImageDataUrl(null);
        setProgress(null);
        setManualPrice('');
    };

    const marketIntelStep = progress?.steps.find(s => s.name === 'Market Intelligence');

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">Acquisitions Portal</h2>
                <p className="text-sm text-slate-400">Scan-to-Store: Automated book scanning, enrichment, and listing.</p>
            </div>

            <div className="flex-grow flex min-h-0">
                {/* --- Left Panel: Scanner Control Panel --- */}
                <div className="w-1/3 p-4 border-r border-slate-700/50 flex flex-col gap-4 overflow-y-auto">
                    <h3 className="text-md font-bold text-indigo-300">Scanner Control Panel</h3>
                    <div className="bg-black/30 rounded-md aspect-video flex items-center justify-center p-1">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setAppState('capturing_front')} disabled={isProcessing || appState === 'capturing_front'} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm disabled:opacity-50">Scan Front Cover</button>
                        <button onClick={() => setAppState('capturing_back')} disabled={isProcessing || appState === 'capturing_back'} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm disabled:opacity-50">Scan Back Cover</button>
                    </div>

                    {(appState === 'capturing_front' || appState === 'capturing_back') && (
                         <button onClick={handleCapture} className="w-full bg-blue-600 hover:bg-blue-500 font-bold p-3 rounded-md">Capture</button>
                    )}
                    
                    <div className="p-3 bg-slate-800/50 rounded-lg space-y-3">
                         <h4 className="text-sm font-semibold">Smart Presets (Simulated)</h4>
                         <select className="w-full bg-slate-700 border border-slate-600 rounded-md p-1 text-xs"><option>Full Auto</option><option>Glossy Covers Pro</option></select>
                         <ControlSlider label="Lighting Adjustment" />
                         <ControlSlider label="Zoom Level" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="border border-slate-700 p-1 rounded-md"><WatermarkedImage src={frontImageDataUrl} /></div>
                        <div className="border border-slate-700 p-1 rounded-md"><WatermarkedImage src={backImageDataUrl} /></div>
                    </div>
                     {appState !== 'complete' ? (
                         <button onClick={handleStartAcquisition} disabled={!frontImageDataUrl || !backImageDataUrl || isProcessing} className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-md">
                            {isProcessing ? 'Processing...' : 'Start Acquisition Process'}
                        </button>
                    ) : (
                         <button onClick={handleReset} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-md">
                            Start New Acquisition
                        </button>
                    )}
                </div>

                {/* --- Right Panel: Workflow Monitor --- */}
                <div className="w-2/3 p-4 overflow-y-auto space-y-4">
                     {appState !== 'complete' ? (
                         <>
                            <h3 className="text-md font-bold text-indigo-300">Workflow Monitor</h3>
                            {!progress && <div className="text-slate-500">Awaiting acquisition process start...</div>}
                            {progress?.steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-3 p-2 bg-slate-800/40 rounded-md">
                                    <StatusIcon status={step.status} />
                                    <div>
                                        <p className={`font-semibold text-sm ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{step.name}</p>
                                        <p className="text-xs text-indigo-300">Agent: <span className="font-mono bg-slate-700/50 px-1 rounded">{step.agentId}</span></p>
                                        {step.result && <p className="text-xs text-slate-400 mt-1 italic">"{step.result.substring(0, 100)}..."</p>}
                                        {step.error && <p className="text-sm text-red-400 mt-1">{step.error}</p>}
                                    </div>
                                </div>
                            ))}
                         </>
                     ) : (
                         <>
                             <h3 className="text-md font-bold text-indigo-300">Final Product Listing</h3>
                             <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1"><WatermarkedImage src={frontImageDataUrl} /></div>
                                <div className="col-span-2 bg-slate-800/50 p-3 rounded-lg space-y-2">
                                     <h4 className="font-bold text-cyan-400">Extracted Data</h4>
                                     <p className="text-xs"><strong>Title:</strong> {progress?.acquiredData?.title}</p>
                                     <p className="text-xs"><strong>Dimensions:</strong> {progress?.acquiredData?.dimensions ? `${progress.acquiredData.dimensions.width_mm}x${progress.acquiredData.dimensions.height_mm}mm` : 'N/A'}</p>
                                     <h4 className="font-bold text-cyan-400 pt-2">Pricing</h4>
                                     <p className="text-xs whitespace-pre-wrap">{marketIntelStep?.result}</p>
                                      <div className="flex items-center gap-2 pt-2">
                                        <label htmlFor="manual-price" className="text-sm font-semibold text-slate-400">Set Price ($):</label>
                                        <input id="manual-price" type="number" value={manualPrice} onChange={e => setManualPrice(e.target.value)} placeholder="e.g., 49.99" className="w-full bg-slate-700 border border-slate-500 rounded-md p-1"/>
                                     </div>
                                </div>
                             </div>
                             <div className="mt-2 p-3 bg-slate-800/50 border border-green-500/30 rounded-lg">
                                <h3 className="font-bold text-green-400 mb-2">Generated Shopify Description</h3>
                                <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: progress?.shopifyDescription || '' }} />
                                <button disabled={!manualPrice} className="w-full mt-4 bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded-md disabled:bg-slate-600 disabled:cursor-not-allowed">
                                    Publish to Shopify for ${manualPrice || '...'} (Simulated)
                                </button>
                             </div>
                         </>
                     )}
                </div>
            </div>
        </div>
    );
};

export default AcquisitionsApp;