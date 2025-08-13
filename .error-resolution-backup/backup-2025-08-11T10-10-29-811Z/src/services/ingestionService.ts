/**
 * Ingestion Service
 * 
 * Clean implementation for content ingestion pipeline
 */

import { generateText } from './geminiClient';
import type { OperationStep, IngestionReport, IngestionProgress } from "../types/types";

const MOCK_FILE_CONTENT = {
    'library-archives': "A mysterious tome bound in black leather, titled 'The Whispering Shadows'. It contains chapters on forgotten spells, ancient rituals, and descriptions of creatures from the abyss. The table of contents lists sections like 'Summoning Minor Horrors' and 'The Language of the Void'.",
    'vault-doctrines': "System Alert Log AZ-01-B. Timestamp: 2024-01-15T14:30:00Z. Incident: Unauthorized access attempt detected on primary security node. Response: Automated lockdown initiated. Status: Resolved. Impact: Minimal.",
    'general-counsel': "This document outlines a trade agreement between the 'Starlight Merchants Guild' and the 'Ironforged Clan'. Key points include exclusive rights to transport moonstone ore through the clan's mountain passes in exchange for a 15% share of profits and security guarantees."
};

type Channel = keyof typeof MOCK_FILE_CONTENT;

const OPERATIONS: Record<Channel, Omit<OperationStep, 'status' | 'result'>[]> = {
    'library-archives': [
        { name: 'Initial Scan & Identification', agentId: 'content-analyzer' },
        { name: 'Lore & Entity Extraction', agentId: 'entity-extractor' },
        { name: 'Market Analysis', agentId: 'market-analyst' },
        { name: 'Generate Content Summary', agentId: 'content-summarizer' }
    ],
    'vault-doctrines': [
        { name: 'Triage & Severity Analysis', agentId: 'incident-analyzer' },
        { name: 'Identify Affected Systems', agentId: 'system-mapper' },
        { name: 'Propose Resolution Plan', agentId: 'resolution-planner' }
    ],
    'general-counsel': [
        { name: 'Extract Key Points & Terms', agentId: 'legal-extractor' },
        { name: 'Ethical & Precedent Analysis', agentId: 'ethical-analyzer' },
        { name: 'Generate Executive Summary', agentId: 'executive-summarizer' }
    ]
};

const PROMPTS: Record<string, (content: string) => string> = {
    'Initial Scan & Identification': (c) => `Based on this content, identify the type of book (e.g., RPG Sourcebook, Spellbook), its likely game system, and any titles. Be creative. Content: ${c}`,
    'Lore & Entity Extraction': (c) => `Extract key RPG entities (monsters, spells, important items, factions) from this text. List up to 5. Content: ${c}`,
    'Market Analysis': (c) => `Estimate the market value and collector interest for a book with this content. Give a price in Gold Pieces and a brief reason. Content: ${c}`,
    'Generate Content Summary': (c) => `Write a compelling 2-sentence summary for a catalog listing based on this content. Content: ${c}`,
    'Triage & Severity Analysis': (c) => `Analyze this system log. What is the incident's severity level (Low, Medium, High, Critical) and potential impact? Content: ${c}`,
    'Identify Affected Systems': (c) => `Based on the incident report, which systems or protocols are directly or indirectly affected? Content: ${c}`,
    'Propose Resolution Plan': (c) => `Outline a 3-step resolution plan for the incident described. Content: ${c}`,
    'Extract Key Points & Terms': (c) => `Extract the 3 most important points or terms from this document. Content: ${c}`,
    'Ethical & Precedent Analysis': (c) => `Briefly analyze the ethical implications or historical precedents related to this document. Content: ${c}`,
    'Generate Executive Summary': (c) => `Write a one-sentence summary of the document's purpose for a busy executive. Content: ${c}`
};

const getStepResult = async (stepName: string, content: string): Promise<string> => {
    const prompt = PROMPTS[stepName];
    if (!prompt) {
        throw new Error(`No prompt found for step: ${stepName}`);
    }

    const response = await generateText(prompt(content));

    if (response.startsWith('Error:')) {
        throw new Error(`AI processing failed for step: ${stepName}`);
    }

    return response.trim();
};

export async function* runIngestionPipeline(channel: Channel): AsyncGenerator<IngestionProgress, IngestionReport> {
    const initialSteps: OperationStep[] = OPERATIONS[channel].map(step => ({
        name: step.name,
        agentId: step.agentId,
        status: 'pending'
    }));

    let progress: IngestionProgress = {
        steps: initialSteps,
        isComplete: false,
        currentStep: 0,
        totalSteps: initialSteps.length,
        error: null
    };

    yield { ...progress };

    const finalReport: IngestionReport = {
        channel,
        timestamp: new Date(),
        steps: [],
        summary: '',
        details: {}
    };

    for (let i = 0; i < progress.steps.length; i++) {
        // Set step to running
        progress.steps[i].status = 'running';
        progress.currentStep = i;
        yield { ...progress };

        await new Promise(resolve => setTimeout(resolve, 500)); // UI update delay

        try {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500)); // Simulate work

            const content = MOCK_FILE_CONTENT[channel];
            const result = await getStepResult(progress.steps[i].name, content);

            progress.steps[i].status = 'complete';
            progress.steps[i].result = result;
            finalReport.details[progress.steps[i].name] = result;

        } catch (error: any) {
            progress.steps[i].status = 'error';
            progress.steps[i].error = error.message;
            progress.error = `Pipeline failed at step: ${progress.steps[i].name}`;
            yield { ...progress };
            return finalReport;
        }

        yield { ...progress };
    }

    // Mark as complete
    progress.isComplete = true;
    progress.currentStep = progress.totalSteps;
    yield { ...progress };

    // Generate final summary
    finalReport.steps = progress.steps;
    finalReport.summary = `Successfully processed ${channel} content through ${progress.totalSteps} steps`;

    return finalReport;
}
