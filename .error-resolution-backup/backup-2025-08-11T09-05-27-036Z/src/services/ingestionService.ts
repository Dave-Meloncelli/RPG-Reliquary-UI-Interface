import { generateText } from './geminiClient';
import type { OperationStep, IngestionReport, IngestionProgress } from "../types/types";

const MOCK_FILE_CONTENT = {
    'library-archives': "A mysterious tome bound in black leather, titled 'The Whispering Shadows'. It contains chapters on forgotten spells, ancient rituals, and descriptions of creatures from the abyss. The table of contents lists sections like 'Summoning Minor Horrors' and 'The Language of the Void'.",
    'vault-doctrines': "System Alert Log AZ-01-B. Timestamp: 2401.33. Significant energy fluctuations detected near Sector Gamma. Agent ERDU reports anomalous data patterns consistent with a reality fracture. Agent Codex cross-references this with the 'Nightfall Protocol'. Recommend immediate investigation by a tactical team.",
    'general-counsel': "This document outlines a trade agreement between the 'Starlight Merchants Guild' and the 'Ironforged Clan'. Key points include exclusive rights to transport moonstone ore through the clan's mountain passes in exchange for a 15% share of profits and security guarantees.",
};

type Channel = keyof typeof MOCK_FILE_CONTENT;

const OPERATIONS: Record<Channel, Omit<OperationStep, 'status' | 'result'>[]> = {
    'library-archives': [
        { name: 'Initial Scan & Identification', agentId: 'agent-az86' },
        { name: 'Lore & Entity Extraction', agentId: 'agent-az85' },
        { name: 'Market Analysis', agentId: 'agent-az82' },
        { name: 'Generate Content Summary', agentId: 'agent-az85' },
    ],
    'vault-doctrines': [
        { name: 'Triage & Severity Analysis', agentId: 'agent-erdu' },
        { name: 'Identify Affected Systems', agentId: 'agent-codex' },
        { name: 'Propose Resolution Plan', agentId: 'agent-architect' },
    ],
    'general-counsel': [
        { name: 'Extract Key Points & Terms', agentId: 'agent-jordan' },
        { name: 'Ethical & Precedent Analysis', agentId: 'agent-sophia' },
        { name: 'Generate Executive Summary', agentId: 'agent-jordan' },
    ],
};

const PROMPTS: Record<string, (content: string) => string> = {
    'Initial Scan & Identification': (c) => `Based on this content, identify the type of book (e.g., RPG Sourcebook, Spellbook), its likely game system, and any titles. Be creative. Content: "${c}"`,
    'Lore & Entity Extraction': (c) => `Extract key RPG entities (monsters, spells, important items, factions) from this text. List up to 5. Content: "${c}"`,
    'Market Analysis': (c) => `Estimate the market value and collector interest for a book with this content. Give a price in Gold Pieces and a brief reason. Content: "${c}"`,
    'Generate Content Summary': (c) => `Write a compelling 2-sentence summary for a catalog listing based on this content. Content: "${c}"`,
    'Triage & Severity Analysis': (c) => `Analyze this system log. What is the incident's severity level (Low, Medium, High, Critical) and potential impact? Content: "${c}"`,
    'Identify Affected Systems': (c) => `Based on the incident report, which systems or protocols are directly or indirectly affected? Content: "${c}"`,
    'Propose Resolution Plan': (c) => `Outline a 3-step resolution plan for the incident described. Content: "${c}"`,
    'Extract Key Points & Terms': (c) => `Extract the 3 most important points or terms from this document. Content: "${c}"`,
    'Ethical & Precedent Analysis': (c) => `Briefly analyze the ethical implications or historical precedents related to this document. Content: "${c}"`,
    'Generate Executive Summary': (c) => `Write a one-sentence summary of the document's purpose for a busy executive. Content: "${c}"`,
};

const getStepResult = async (stepName: string, content: string): Promise<string> => {
    if(response.startsWith('Error:')) {
        throw new Error(`AI processing failed for step: ${stepName}.`);
    }
    return response.trim();
};


export async function* runIngestionPipeline(channel: Channel): AsyncGenerator<IngestionProgress> {
    const initialSteps: OperationStep[] = operationSteps.map(op => ({ ...op, status: 'pending' }));
    
    let progress: IngestionProgress = {
        steps: initialSteps,
        isComplete: false,
    };
    yield { ...progress };

    const finalReport: IngestionReport = { summary: '', details: {} };

    for (let i = 0; i < progress.steps.length; i++) {
        // --- Set step to running ---
        progress.steps[i].status = 'running';
        yield { ...progress };
        await delay(500); // UI update delay

        try {
            await delay(1000 + Math.random() * 1500); // Simulate work

            progress.steps[i].status = 'complete';
            progress.steps[i].result = result;
            finalReport.details[progress.steps[i].name] = result;

        } catch (e) {
            progress.steps[i].status = 'error';
            progress.steps[i].error = error.message;
            progress.error = `Pipeline failed at step: ${progress.steps[i].name}`;
            yield { ...progress };
            return;
        }

        yield { ...progress };
    }
    
    // --- Generate final summary ---
    finalReport.summary = summary;

    progress.isComplete = true;
    progress.report = finalReport;
    yield { ...progress };
}
