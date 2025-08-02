import { GoogleGenAI, Type } from "@google/genai";
import { getPersonaProfile } from './personaService';
import { taskQueueService } from './taskQueueService';
import type { AcquisitionProgress, AcquisitionStep, AcquiredBookData, BookDimensions } from '../types';
import { acquiredBookDataSchema } from "../schemas/acquisitionSchema";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ACQUISITION_PLAYBOOK: Omit<AcquisitionStep, 'status' | 'result'>[] = [
    { name: 'Simulated OCR & Dimension Extraction', agentId: 'agent-az86' },
    { name: 'Condition Assessment', agentId: 'agent-az81' },
    { name: 'Market Intelligence', agentId: 'agent-az82' },
    { name: 'Shopify Description Generation', agentId: 'agent-az85' },
];

const PROMPTS: Record<string, string> = {
    'Condition Assessment': `Based on the cover images, assess the physical condition of the book. Use standard collector's terms (e.g., Near Mint, Very Good, Fair). Note any visible wear, such as creases, scuffs, or fading.`,
    'Market Intelligence': `Given the book's identification and condition, provide a brief market analysis. What is its estimated current market value in USD? Is it considered rare or in high demand among collectors? Extract the estimated value as a number.`,
};

const getPart = (dataUrl: string) => ({
    inlineData: {
        mimeType: dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";")),
        data: dataUrl.substring(dataUrl.indexOf(",") + 1),
    }
});

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function* runAcquisitionPipeline(frontImageDataUrl: string, backImageDataUrl: string): AsyncGenerator<AcquisitionProgress> {
    let playbookSteps = [...ACQUISITION_PLAYBOOK];
    const initialSteps: AcquisitionStep[] = playbookSteps.map(op => ({ ...op, status: 'pending' }));

    let progress: AcquisitionProgress = {
        steps: initialSteps,
        isComplete: false,
        councilReviewNeeded: false,
    };
    yield { ...progress };
    
    let acquiredData: AcquiredBookData | null = null;
    let marketValue = 0;

    for (let i = 0; i < progress.steps.length; i++) {
        const step = progress.steps[i];
        const agentProfile = getPersonaProfile(step.agentId);
        if (!agentProfile) {
            step.status = 'error';
            step.error = `Agent profile for ${step.agentId} not found.`;
            progress.error = `Pipeline failed at step: ${step.name}`;
            yield { ...progress };
            return;
        }
        
        const systemInstruction = agentProfile.scrollContent || `You are ${agentProfile.name}. Your expertise is: ${agentProfile.capabilities.join(', ')}.`;

        step.status = 'running';
        yield { ...progress };
        await delay(200);

        try {
            let result = '';
            if (step.name === 'Simulated OCR & Dimension Extraction') {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [
                        { text: 'Analyze the front and back cover of this book. Simulate OCR to extract text data. Also, estimate the physical dimensions as if you were a professional scanner. Provide all information in the specified JSON format.' },
                        getPart(frontImageDataUrl),
                        getPart(backImageDataUrl),
                    ]},
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                authors: { type: Type.ARRAY, items: { type: Type.STRING } },
                                isbn: { type: Type.STRING },
                                publisher: { type: Type.STRING },
                                blurb: { type: Type.STRING, description: "The summary text from the back cover." },
                                dimensions: {
                                    type: Type.OBJECT,
                                    properties: {
                                        width_mm: { type: Type.NUMBER },
                                        height_mm: { type: Type.NUMBER },
                                        thickness_mm: { type: Type.NUMBER },
                                        weight_grams: { type: Type.NUMBER },
                                    }
                                }
                            },
                            required: ['title', 'authors', 'dimensions']
                        },
                        systemInstruction,
                    }
                });
                result = response.text;
                
                // --- ArkType Validation ---
                const parsedJson = JSON.parse(result);
                const { data, problems } = acquiredBookDataSchema(parsedJson);

                if (problems) {
                    console.error("Gemini response validation failed:", problems);
                    // Create a task for review
                    taskQueueService.addTask({
                        source: 'Acquisitions',
                        sourceId: `acq-fail-${Date.now()}`,
                        title: `AI Data Validation Failure`,
                        description: `The AI response for OCR & Dimension Extraction was malformed. Please review. Problems: ${problems}`,
                        priority: 'High',
                        appId: 'acquisitions'
                    });
                    throw new Error(`AI response validation failed: ${problems}`);
                }
                
                // Use validated data
                acquiredData = data;
                progress.acquiredData = acquiredData ?? undefined;

            } else if (step.name === 'Shopify Description Generation') {
                if (!acquiredData) throw new Error("Structured data was not extracted, cannot generate description.");
                const prompt = `You are an expert e-commerce copywriter specializing in rare and collectible RPG books. Using the following structured data, generate a compelling, keyword-rich, and SEO-optimized product description for a Shopify store. The description should be immersive and collector-focused. Structure the output in clean HTML with headings (h3), paragraphs (p), and bulleted lists (ul/li). The template must include: Product Details, Physical Specifications, Market Intelligence, Condition Assessment, and Shipping & Handling.
                
                DATA:
                ${JSON.stringify({ ...acquiredData, marketValue: `$${marketValue.toFixed(2)}` }, null, 2)}`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { systemInstruction }
                });
                result = response.text;
                progress.shopifyDescription = result;
            } else {
                const textPart = { text: PROMPTS[step.name] };
                const contents = { parts: [textPart, getPart(frontImageDataUrl), getPart(backImageDataUrl)] };
                 const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents,
                    config: { systemInstruction }
                });
                result = response.text;
                if (step.name === 'Market Intelligence') {
                    const valueMatch = result.match(/(\d+\.?\d*)/);
                    if (valueMatch) marketValue = parseFloat(valueMatch[1]);
                }
            }
            
            step.status = 'complete';
            step.result = result;

            // --- Quality Gate Logic ---
            if (step.name === 'Market Intelligence' && marketValue > 100) {
                progress.councilReviewNeeded = true;
                const reviewStep: AcquisitionStep = { name: 'Council Review Pending', agentId: 'agent-council', status: 'review_pending', result: `High value item detected ($${marketValue.toFixed(2)}). Escalated for council review.` };
                progress.steps.splice(i + 1, 0, reviewStep);
                
                // --- INTEGRATION WITH TASK HUB ---
                taskQueueService.addTask({
                    source: 'Acquisitions',
                    sourceId: `acq-${Date.now()}`,
                    title: `High-Value Item Review: ${acquiredData?.title || 'Unknown Item'}`,
                    description: `An item with an estimated market value of $${marketValue.toFixed(2)} requires council review before proceeding with listing.`,
                    priority: 'High',
                    appId: 'acquisitions'
                });

                yield { ...progress };
                // In a real app, we would wait for an external trigger here. We'll just complete it for the simulation.
                await delay(2000);
                reviewStep.status = 'complete';
                reviewStep.result = `Council review complete. Approved for listing.`;
            }

        } catch (e) {
            const error = e as Error;
            step.status = 'error';
            step.error = error.message;
            progress.error = `Pipeline failed at step: ${step.name}`;
            yield { ...progress };
            return;
        }

        yield { ...progress };
    }

    progress.isComplete = true;
    yield { ...progress };
}
