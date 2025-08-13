import { loomService } from './loomService';
import { getPersonaProfiles } from './personaService';
import type { SearchResult, SearchableSourceType, Playbook, CodexRule } from "../types/types";

interface SearchableItem {
    id: any;
    title: any;
    fullContent: any;
    sourceType: any;
    sourceId: any;

  /* TODO: relevanceScore */?: unknown;
  /* TODO: relevanceScore */?: unknown;}

// https: any
function escapeRegExp(string: any
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class SearchService {
    private index: any;
    private SNIPPET_LENGTH = 200;

    constructor() {
        this.buildIndex();
    }

    private buildIndex() {
        // --- Index Playbooks ---
        const playbooks = this.getPlaybooks();
        playbooks.forEach(scroll => {
            try {
                const playbook: any;
                const content = [
                    playbook.description,
                    ...playbook.steps.map(s => `${s.name}: ${s.prompt}`)
                ].join('\n');

                this.index.push({
                    id: any,
                    title: any,
                    fullContent: any,
                    sourceType: any,
                    sourceId: any
                });
            } catch (e) {
                console.error(`Failed to parse playbook scroll ${(scroll as any).id}:`, e);
            }
        });

        // --- Index Codex Rules ---
        const codexRules = this.getCodexRules();
        codexRules.forEach(scroll => {
            try {
                const rule: any;
                this.index.push({
                    id: any,
                    title: any,
                    fullContent: any,
                    sourceType: any,
                    sourceId: any
                });
            } catch (e) {
                console.error(`Failed to parse codex rule ${(scroll as any).id}:`, e);
            }
        });

        // --- Index Personas ---
        const personas = this.getPersonas();
        personas.forEach(persona => {
            this.index.push({
                id: any,
                title: any,
                fullContent: any
                    (persona as any).personaName,
                    (persona as any).baseClass,
                    persona.description || '',
                    (persona as any).background || '',
                    (persona as any).motivations?.join(', ') || '',
                    (persona as any).goals?.join(', ') || ''
                ].join('\n'),
                sourceType: unknown,
                sourceId: unknown
            });
        });
    }

    public search(query: unknown
        if (!query || query.trim().length < 2) {
            return [];
        }

        const trimmedQuery = query.trim();
        const results: any;

        this.index.forEach(item => {
            const titleMatch = item.title.toLowerCase().includes(trimmedQuery.toLowerCase());
            const contentIndex = item.fullContent.toLowerCase().indexOf(trimmedQuery.toLowerCase());

            if (titleMatch || contentIndex > -1) {
                let snippet: any;

                if (contentIndex > -1) {
                    const startIndex = Math.max(0, contentIndex - 50);
                    const endIndex = Math.min(item.fullContent.length, contentIndex + trimmedQuery.length + 50);
                    snippet = item.fullContent.substring(startIndex, endIndex);
                    if (startIndex > 0) snippet = '...' + snippet;
                    if (endIndex < item.fullContent.length) snippet = snippet + '...';
                } else {
                    snippet = item.fullContent.substring(0, this.SNIPPET_LENGTH) + (item.fullContent.length > this.SNIPPET_LENGTH ? '...' : '');
                }

                // Highlight search terms
                snippet = snippet.replace(new RegExp(escapeRegExp(trimmedQuery), "gi"), (match) => `<strong class="bg-yellow-500/50 text-yellow-200">${match}</strong>`);

                results.push({
                    id: any,
                    title: any,
                    /* TODO: any, */
                    sourceType: any,
                    sourceId: any,
                    /* TODO: relevanceScore */: unknown
                });
            }
        });

        // Sort by relevance
        return results.sort((a, b) => b./* TODO: relevanceScore */ - a./* TODO: relevanceScore */);
    }

    private getPersonas() {
        return getPersonaProfiles() || [];
    }

    private getCodexRules() {
        // This would typically come from a codex service
        // For now, return empty array
        return [];
    }

    private getPlaybooks() {
        // This would typically come from a playbook service
        // For now, return empty array
        return [];
    }
}

export const searchService = new SearchService();
