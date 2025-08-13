import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  type FC,
} from "react";

import type {
  AcquisitionProgress,
  AcquisitionStep,
  AcquiredBookData,
} from "../types";

type AppState =
  | "idle"
  | "capturing_front"
  | "capturing_back"
  | "processing"
  | "complete";

const StatusIcon: FC<{ status: any }> = ({ status }) => {
  switch (status) {
    case "running":
      return (
        <svg
          className="animate-spin h-5 w-5 text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    case "complete":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-green-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "review_pending":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-yellow-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
    case "error":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-red-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
  }
};

const ControlSlider: FC<{ label: any }> = ({ label }) => (
  <div>
    <label className="text-xs text-slate-400">{label}</label>
    <input
      type="range"
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const WatermarkedImage: FC<{ src?: any }> = ({ src }) => (
  <div className="relative w-full aspect-[3/4] bg-black/20 rounded-md flex items-center justify-center">
    {src ? (
      <img
        src={src}
        alt="Book Cover"
        className="max-w-full max-h-full object-contain"
      />
    ) : (
      <p className="text-slate-500 text-sm">Image</p>
    )}
    {src && (
      <div className="absolute bottom-2 right-2 p-1 bg-black/50 rounded text-white text-xs opacity-70">
        <span>LOGO</span>
      </div>
    )}
  </div>
);

const AcquisitionsApp: FC = () => {
  const [appState, setAppState] = useState<AppState>("idle");
  const [frontImageDataUrl, setFrontImageDataUrl] = useState<string | null>(
    null,
  );
  const [backImageDataUrl, setBackImageDataUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<AcquisitionProgress | null>(null);
  const [manualPrice, setManualPrice] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isProcessing = appState === "processing";

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
    if (appState === "capturing_front" || appState === "capturing_back") {
      startCamera();
    } else {
      cleanupStream();
    }
    return cleanupStream;
  }, [appState, cleanupStream]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      if (appState === "capturing_front") {
        setFrontImageDataUrl(dataUrl);
        setAppState("capturing_back");
      } else if (appState === "capturing_back") {
        setBackImageDataUrl(dataUrl);
        setAppState("idle");
      }
    }
  };

  const handleStartAcquisition = useCallback(async () => {
    if (!frontImageDataUrl || !backImageDataUrl || isProcessing) return;

    setAppState("processing");
    setProgress(null);
    setManualPrice("");

    const pipelineGenerator = runAcquisitionPipeline(
      frontImageDataUrl,
      backImageDataUrl,
    );
    for await (const update of pipelineGenerator) {
      setProgress(update);
    }

    setAppState("complete");
  }, [frontImageDataUrl, backImageDataUrl, isProcessing]);

  const handleReset = () => {
    setAppState("idle");
    setFrontImageDataUrl(null);
    setBackImageDataUrl(null);
    setProgress(null);
    setManualPrice("");
  };

  const marketIntelStep = progress?.steps.find(
    (s) => s.name === "Market Intelligence",
  );

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Acquisitions Portal</h2>
        <p className="text-sm text-slate-400">
          Scan-to-Store: AI-powered acquisition, enrichment, and listing.
        </p>
      </div>

      <div className="flex-grow flex min-h-0">
        {/* --- Left Panel: Scanner Control --- */}
        <div className="w-1/3 p-4 border-r border-slate-700/50 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-md font-bold text-indigo-300">
            Scanner Control Panel
          </h3>
          <div className="bg-black/30 rounded-md aspect-video flex items-center justify-center p-1">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAppState("capturing_front")}
              disabled={isProcessing || appState === "capturing_front"}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-xs"
            >
              Capture Front
            </button>
            <button
              onClick={() => setAppState("capturing_back")}
              disabled={isProcessing || appState === "capturing_back"}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-xs"
            >
              Capture Back
            </button>
          </div>

          {(appState === "capturing_front" ||
            appState === "capturing_back") && (
            <button
              onClick={handleCapture}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Capture Image
            </button>
          )}

          <div className="p-3 bg-slate-800/50 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold">Smart Presets (Simulated)</h4>
            <select className="w-full bg-slate-700 border border-slate-600 rounded-md p-1 text-xs">
              <option>Full Auto</option>
              <option>Glossy Covers Pro</option>
            </select>
            <ControlSlider label="Lighting Adjustment" />
            <ControlSlider label="Zoom Level" />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="border border-slate-700 p-1 rounded-md">
              <WatermarkedImage src={frontImageDataUrl} />
            </div>
            <div className="border border-slate-700 p-1 rounded-md">
              <WatermarkedImage src={backImageDataUrl} />
            </div>
          </div>
          {appState !== "complete" ? (
            <button
              onClick={handleStartAcquisition}
              disabled={!frontImageDataUrl || !backImageDataUrl || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {isProcessing ? "Processing..." : "Start Acquisition Process"}
            </button>
          ) : (
            <button
              onClick={() => setAppState("idle")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Start New Acquisition
            </button>
          )}
        </div>

        {/* --- Right Panel: Workflow Monitor --- */}
        <div className="w-2/3 p-4 overflow-y-auto space-y-4">
          {appState !== "complete" ? (
            <>
              <h3 className="text-md font-bold text-indigo-300">
                Workflow Monitor
              </h3>
              {!progress && (
                <div className="text-slate-500">
                  Awaiting acquisition process start...
                </div>
              )}
              {progress?.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 bg-slate-800/40 rounded-md"
                >
                  <StatusIcon status={step.status} />
                  <div>
                    <p
                      className={`font-semibold text-sm ${step.status === "pending" ? "text-slate-500" : "text-white"}`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-indigo-300">
                      Agent: {step.agentId || "System"}
                    </p>
                    {step.result && (
                      <p className="text-xs text-slate-400 mt-1 italic">
                        "{step.result.substring(0, 100)}..."
                      </p>
                    )}
                    {step.error && (
                      <p className="text-sm text-red-400 mt-1">{step.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <h3 className="text-md font-bold text-indigo-300">
                Final Product Listing
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <WatermarkedImage src={frontImageDataUrl} />
                </div>
                <div className="col-span-2 bg-slate-800/50 p-3 rounded-lg space-y-2">
                  <h4 className="font-bold text-cyan-400">Extracted Data</h4>
                  <p className="text-xs">
                    <strong>Title:</strong> Sample Book Title
                  </p>
                  <p className="text-xs">
                    <strong>Dimensions:</strong> 8.5" x 11"
                  </p>
                  <h4 className="font-bold text-cyan-400 pt-2">Pricing</h4>
                  <p className="text-xs whitespace-pre-wrap">
                    {marketIntelStep?.result}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <label
                      htmlFor="manual-price"
                      className="text-sm font-semibold text-slate-400"
                    >
                      Set Price ($):
                    </label>
                    <input
                      id="manual-price"
                      type="number"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                      placeholder="e.g., 49.99"
                      className="w-full bg-slate-700 border border-slate-500 rounded-md p-1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 p-3 bg-slate-800/50 border border-green-500/30 rounded-lg">
                <h3 className="font-bold text-green-400 mb-2">
                  Generated Shopify Description
                </h3>
                <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed">
                  <p>Sample product description for Shopify listing...</p>
                </div>
                <button
                  disabled={!manualPrice}
                  className="w-full mt-4 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Publish to Shopify for ${manualPrice || "..."} (Simulated)
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
