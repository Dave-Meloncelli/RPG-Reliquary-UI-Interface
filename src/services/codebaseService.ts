import type { GitCommit, WebhookDelivery } from '../types';

let logIdCounter = 0;

const AUTHORS = ['agent-zero', 'kairos-dev', 'sophia-ethicals', 'erdu-security', 'az86-acq-bot', 'jordan-refactor'];
const VERBS = ['Fix', 'Add', 'Update', 'Refactor', 'Improve', 'Optimize', 'Document', 'Merge', 'Revert'];
const NOUNS = [
    'orchestrator logic', 'agent communication protocol', 'ingestion pipeline', 
    'UI rendering bug', 'security vulnerability', 'API endpoint', 'database schema',
    'fallback strategy', 'logging mechanism', 'council deliberation UI', 'playbook configuration'
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateCommit = (): GitCommit => {
    const author = getRandomItem(AUTHORS);
    const verb = getRandomItem(VERBS);
    const noun = getRandomItem(NOUNS);
    const hash = Math.random().toString(36).substring(2, 9);

    return {
        id: hash,
        timestamp: new Date().toLocaleTimeString(),
        author: author,
        message: `${verb}: ${noun} (#${Math.floor(Math.random() * 500)})`,
    };
};

const generateWebhook = (): WebhookDelivery => {
    return {
        id: `wh-${++logIdCounter}`,
        timestamp: new Date().toLocaleTimeString(),
        event: Math.random() > 0.3 ? 'push' : 'pull_request',
        success: Math.random() > 0.1, // 90% success rate
    };
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function* streamCodebaseActivity(): AsyncGenerator<{
    newCommit?: GitCommit;
    newWebhook?: WebhookDelivery;
}> {
    while (true) {
        await delay(1000 + Math.random() * 2500);
        
        const roll = Math.random();
        let newCommit: GitCommit | undefined;
        let newWebhook: WebhookDelivery | undefined;

        if (roll < 0.7) { // 70% chance for a commit
            newCommit = generateCommit();
        }
        
        if (roll > 0.5) { // 50% chance for a webhook
            newWebhook = generateWebhook();
        }

        if (!newCommit && !newWebhook) {
            newCommit = generateCommit();
        }

        yield {
            newCommit,
            newWebhook,
        };
    }
}
