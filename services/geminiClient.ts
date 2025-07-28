import { GoogleGenAI, GenerateContentResponse, Type, GenerateContentParameters } from "@google/genai";
import { RpgBookAnalysis } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

// Initialize AI client only if API key is available
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("GEMINI_API_KEY environment variable not set. Some features may not work.");
}

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
        if (!ai) {
            return "Error: Gemini API key not configured. Please set GEMINI_API_KEY environment variable.";
        }
        
        try {
            const formattedContents = typeof contents === 'string' ? contents : contents;

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: formattedContents,
                config,
            });
            
            if (response.text) {
                return response.text;
            }

            // Fallback for robustness against potential SDK response variations, as per review.
            const candidate = (response as any).candidates?.[0];
            const text = candidate?.content?.parts?.map((p: any) => p.text ?? '').join('') || '';
            
            if (text) return text;
            
            return ''; // Return empty string if no text is found
        } catch (error) {
            console.error("Gemini API error in generateText:", error);
            return `Error: AI processing failed. Please check API key and network.`;
        }
    };
    return await enqueueRequest(doRequest);
};

// --- Standardized Image Generation ---
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    const doRequest = async () => {
        if (!ai) {
            return "Error: Gemini API key not configured. Please set GEMINI_API_KEY environment variable.";
        }
        
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '1:1',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
            return 'Error: No image was generated.';
        } catch (error) {
            console.error("Gemini API error in generateImageFromPrompt:", error);
            return `Error: Could not generate image. ${(error as Error).message}`;
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
    if (!ai) {
        throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY environment variable.");
    }
    
    const { mimeType, data: base64Data } = await imageUrlToBase64(imageUrl);

    const imagePart = {
        inlineData: {
            mimeType,
            data: base64Data,
        },
    };

    const textPart = {
        text: `Analyze this RPG book cover image and extract the following information. Be as accurate as possible.
        1. The exact title.
        2. All author(s) listed on the cover.
        3. Edition information (e.g., "Advanced Dungeons & Dragons", "2nd Edition").
        4. The publisher, if visible.
        5. Any series information (e.g., "Forgotten Realms").
        Return the information in the specified JSON format.`
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [textPart, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The main title of the book." },
                    authors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of authors on the cover." },
                    edition: { type: Type.STRING, description: "The game system or edition." },
                    publisher: { type: Type.STRING, description: "The publisher's name." },
                    series: { type: Type.STRING, description: "The name of the series, if any." },
                },
                required: ['title', 'authors']
            }
        },
    });

    return JSON.parse(response.text) as RpgBookAnalysis;
};
