import { loomService } from './loomService';
import { getPersonaProfiles } from './personaService';
import type { SearchResult, SearchableSourceType, Playbook, CodexRule } from "../types/types";

interface SearchableItem {
    id: string;
    title: string;
    fullContent: string;
    sourceType: SearchableSourceType;
    sourceId: string;
}

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(string: string) {
    const SNIPPET_LENGTH = 200;
    
    const startIndex = Math.max(0, contentIndex - 50);
    const endIndex = Math.min(item.fullContent.length, contentIndex + trimmedQuery.length + 50);
    
    const titleMatch = item.title.toLowerCase().includes(trimmedQuery.toLowerCase());
    const contentIndex = item.fullContent.toLowerCase().indexOf(trimmedQuery.toLowerCase());
    
    const trimmedQuery = query.trim();
    
    const personas = this.getPersonas();
    
    const codexRules = this.getCodexRules();
    
    const playbooks = this.getPlaybooks();
    
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


class SearchService {
    private index: SearchableItem[] = [];

    constructor() {
        this.buildIndex();
    }

    private buildIndex() {
        // --- Index Playbooks ---
        playbooks.forEach(scroll => {
            try {
                const playbook: Playbook = JSON.parse(scroll.content);
                const content = [
                    playbook.description,
                    ...playbook.steps.map(s => `${s.name}: ${s.prompt}`)
                ].join('\n');

                this.index.push({
                    id: `playbook-${playbook.id}`,
                    title: playbook.name,
                    fullContent: content,
                    sourceType: 'playbook',
                    sourceId: playbook.id
                });
            } catch (e) {
                console.error(`Failed to parse playbook scroll ${scroll.id}:`, e);
            }
        });

        // --- Index Codex Rules ---
        codexRules.forEach(scroll => {
            try {
                const rule: CodexRule = JSON.parse(scroll.content);
                this.index.push({
                    id: `codex-${rule.id}`,
                    title: rule.title,
                    fullContent: rule.content,
                    sourceType: 'codex',
                    sourceId: rule.id
                });
            } catch (e) {
                console.error(`Failed to parse codex scroll ${scroll.id}:`, e);
            }
        });

        // --- Index Personas ---
        personas.forEach(persona => {
            if (persona.scrollContent) {
                this.index.push({
                    id: `persona-${persona.id}`,
                    title: persona.name,
                    fullContent: persona.scrollContent,
                    sourceType: 'persona',
                    sourceId: persona.id
                });
            }
        });
    }

    public search(query: string): SearchResult[] {
        if (trimmedQuery.length < 2) {
            return [];
        }

        const results: SearchResult[] = [];

        this.index.forEach(item => {

            if (titleMatch || contentIndex > -1) {
                let snippet: string;

                if (contentIndex > -1) {
                    snippet = item.fullContent.substring(startIndex, endIndex);
                    if (startIndex > 0) snippet = '...' + snippet;
                    if (endIndex < item.fullContent.length) snippet = snippet + '...';
                } else {
                    // If match is only in title, take snippet from start of content
                    snippet = item.fullContent.substring(0, SNIPPET_LENGTH) + (item.fullContent.length > SNIPPET_LENGTH ? '...' : '');
                }

                // Highlight matches
                let snippet = snippet.replace(new RegExp(escapeRegExp(trimmedQuery), "gi"), (match) => `<strong class="bg-yellow-500/50 text-yellow-200">${match}</strong>`);

                results.push({
                    id: item.id,
                    title: item.title,
                    snippet,
                    sourceType: item.sourceType,
                    sourceId: item.sourceId,
                });
            }
        });

        return results;
    }
}

export const searchService = new SearchService();
