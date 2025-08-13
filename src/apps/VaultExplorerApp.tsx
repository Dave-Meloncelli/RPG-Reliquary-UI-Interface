import React, { useState, useEffect, type FC } from "react";

import type { SearchResult, SearchableSourceType } from "../types";

const SOURCE_TYPE_STYLES: Record<SearchableSourceType, string> = {
  Playbook: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
  Codex: "bg-green-500/20 text-green-300 border-green-500/50",
  Persona: "bg-purple-500/20 text-purple-300 border-purple-500/50",
  File: "bg-sky-500/20 text-sky-300 border-sky-500/50",
};

const ResultCard: FC<{ result: SearchResult }> = ({ result }) => (
  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-white truncate">{result.title}</h3>
      <span
        className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${SOURCE_TYPE_STYLES[result.sourceType]}`}
      >
        {result.sourceType}
      </span>
    </div>
    <p
      className="text-sm text-slate-400 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: result.snippet }}
    />
  </div>
);

const VaultExplorerApp: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const searchResults = searchService.search(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">Vault Explorer</h2>
        <p className="text-sm text-slate-400">
          Unified search across all system knowledge.
        </p>
      </div>

      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for playbooks, codex rules, agent lore..."
            className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-grow px-4 pb-4 overflow-y-auto">
        {query.length > 1 && results.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>No results found for "{query}".</p>
          </div>
        )}
        {query.length <= 1 && (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Enter a query to search the Vault.</p>
          </div>
        )}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultExplorerApp;
