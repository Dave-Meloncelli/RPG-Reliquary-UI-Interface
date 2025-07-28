import { GenerateContentParameters } from "@google/genai";
import { RpgBookAnalysis } from "../types";

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000';

// --- Request Queue Implementation ---
interface QueuedRequest<T> {
  fn: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

const MAX_CONCURRENT_REQUESTS = 2;
let activeRequests = 0;
const pendingQueue: QueuedRequest<any>[] = [];

async function dequeueAndRun() {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || pendingQueue.length === 0) return;
  const { fn, resolve, reject } = pendingQueue.shift()!;
  activeRequests++;
  try {
    resolve(await fn());
  } catch (err) {
    reject(err);
  } finally {
    activeRequests--;
    setTimeout(dequeueAndRun, 0);
  }
}

function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    pendingQueue.push({ fn, resolve, reject });
    dequeueAndRun();
  });
}


// --- Standardized Text Generation ---
export const generateText = async (
    contents: GenerateContentParameters['contents'] | string, 
    config?: Partial<GenerateContentParameters['config']>
): Promise<string> => {
    const doRequest = async () => {
        try {
            const payload = typeof contents === 'string'
                ? { prompt: contents, config }
                : { contents, config };

            const response = await fetch(`${API_BASE_URL}/gemini/text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Request failed');
            const data = await response.json();
            return data.text || '';
        } catch (error) {
            console.error('Gemini proxy error in generateText:', error);
            return 'Error: AI processing failed.';
        }
    };
    return await enqueueRequest(doRequest);
};

// --- Standardized Image Generation ---
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    const doRequest = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/gemini/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            if (!response.ok) throw new Error('Request failed');
            const data = await response.json();
            return data.imageDataUrl || '';
        } catch (error) {
            console.error('Gemini proxy error in generateImageFromPrompt:', error);
            return 'Error: Could not generate image.';
        }
    };
    return await enqueueRequest(doRequest);
};

// --- Standardized JSON Generation (Vision) ---
const imageUrlToBase64 = async (url: string): Promise<{ mimeType: string, data: string }> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve({ mimeType, data: reader.result.split(',')[1]});
            } else {
                reject(new Error('Failed to read blob as base64 string.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const analyzeRpgBookCoverWithVision = async (imageUrl: string): Promise<RpgBookAnalysis> => {
    const { mimeType, data: base64Data } = await imageUrlToBase64(imageUrl);

    try {
        const response = await fetch(`${API_BASE_URL}/gemini/vision`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mimeType, data: base64Data })
        });
        if (!response.ok) throw new Error('Request failed');
        return await response.json() as RpgBookAnalysis;
    } catch (error) {
        console.error('Gemini proxy error in analyzeRpgBookCoverWithVision:', error);
        throw new Error('Vision analysis failed');
    }
};
