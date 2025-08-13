
import React, { useState, useEffect, type FC } from 'react';
import { curatorService } from '../services/curatorService';
import { n8nService } from '../services/n8nService';
import type { CuratorTarget, CuratedData, CuratedBook } from '../types';

const TABS: Array<keyof CuratedData> = ['bookList', 'priceHistory', 'series', 'gossipAndLore', 'blogPosts'];
const TAB_NAMES: Record<keyof CuratedData, string> = {
    bookList: 'Book List',
    priceHistory: 'Pricing Info',
    series: 'Series',
    gossipAndLore: 'Gossip & Lore',
    blogPosts: 'Blogs',
};

const BookListTable: FC<{ books: CuratedBook[], onSelectionChange: (selectedIsbns: any[]) => void }> = ({ books, onSelectionChange }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleSelect = (isbn: any) => {
        const newSelection = new Set(selected);
        if (newSelection.has(isbn)) {
            newSelection.delete(isbn);
        } else {
            newSelection.add(isbn);
        }
        setSelected(newSelection);
        onSelectionChange(Array.from(newSelection));
    };
    
    return (
        <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-slate-900/70 backdrop-blur-sm">
                <tr>
                    <th className="p-2 w-8"></th>
                    <th className="p-2">Title</th>
                    <th className="p-2">ISBN</th>
                    <th className="p-2">Source</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {books.map(book => (
                    <tr key={book.isbn} className="hover:bg-slate-800/50">
                        <td className="p-2 text-center">
                            <input type="checkbox" checked={selected.has(book.isbn)} onChange={() => handleSelect(book.isbn)} className="form-checkbox h-4 w-4 bg-slate-700 border-slate-500 text-indigo-500 rounded focus:ring-indigo-400" />
                        </td>
                        <td className="p-2 font-semibold text-white">{book.title}</td>
                        <td className="p-2 font-mono text-xs">{book.isbn}</td>
                        <td className="p-2"><a href={book.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-xs">{book.sourceName}</a></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const CuratorApp: React.FC = () => {
    const [targets, setTargets] = useState<CuratorTarget[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<CuratorTarget | null>(null);
    const [curatedData, setCuratedData] = useState<CuratedData | null>(null);
    const [activeTab, setActiveTab] = useState<keyof CuratedData>(TABS[0]);
    const [newTargetUrl, setNewTargetUrl] = useState('');
    const [selectedBookIsbns, setSelectedBookIsbns] = useState<string[]>([]);
    const [placeholderStatus, setPlaceholderStatus] = useState<'idle' | 'running' | 'success'>('idle');

    useEffect(() => {
        const unsubscribe = curatorService.subscribe((state) => {
            const allTargets = state.targets;
            setTargets(allTargets);
            if (!selectedTarget && allTargets.length > 0) {
                setSelectedTarget(allTargets[0]);
            } else if (selectedTarget) {
                const updatedTarget = allTargets.find(t => t.id === selectedTarget.id);
                if(updatedTarget) {
                    setSelectedTarget(updatedTarget);
                    setCuratedData(state.data[updatedTarget.id] || null);
                } else {
                    setSelectedTarget(allTargets[0] || null);
                }
            }
        });
        return unsubscribe;
    }, [selectedTarget]);
    
    useEffect(() => {
        if (selectedTarget) {
            setCuratedData(curatorService.getDataForTarget(selectedTarget.id));
            setActiveTab(TABS[0]);
        } else {
            setCuratedData(null);
        }
        setSelectedBookIsbns([]);
    }, [selectedTarget]);

    const handleAddTarget = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTargetUrl.trim()) {
            curatorService.addTarget(newTargetUrl.trim());
            setNewTargetUrl('');
        }
    };
    
    const handleCreatePlaceholders = () => {
        if (selectedBookIsbns.length === 0) return;
        setPlaceholderStatus('running');
        n8nService.runWorkflowWithInput('wf-create-placeholders', {
            sourceApp: 'Curator',
            payload: { isbns: selectedBookIsbns },
        });
        setTimeout(() => {
            setPlaceholderStatus('success');
            setTimeout(() => setPlaceholderStatus('idle'), 2000);
        }, 3000); // Simulate workflow time
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">The Curator</h2>
                <p className="text-sm text-slate-400">Manage proactive intelligence gathering and data silos.</p>
            </div>
            <div className="flex-grow flex min-h-0">
                {/* Left Panel: Targets */}
                <div className="w-1/3 min-w-[300px] p-4 border-r border-slate-700/50 flex flex-col gap-4">
                     <form onSubmit={handleAddTarget} className="flex gap-2">
                        <input
                            type="text"
                            value={newTargetUrl}
                            onChange={(e) => setNewTargetUrl(e.target.value)}
                            placeholder="Add new publisher URL..."
                            className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-sm font-bold">+</button>
                    </form>
                    <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                         {targets.map(target => (
                            <button
                                key={target.id}
                                onClick={() => setSelectedTarget(target)}
                                className={`w-full text-left p-3 rounded-md transition-colors relative ${selectedTarget?.id === target.id ? 'bg-indigo-600/50' : 'bg-slate-800 hover:bg-slate-700'}`}
                            >
                                {target.isNewDiscovery && <span className="absolute top-1 right-1 text-xs bg-yellow-500 text-black font-bold px-2 rounded-full">New</span>}
                                <p className="font-bold text-white truncate">{target.name}</p>
                                <p className={`text-xs ${target.isNewDiscovery ? 'text-yellow-300' : 'text-slate-400'}`}>
                                    {target.isNewDiscovery ? 'Needs Validation' : `Last Scraped: ${target.lastScraped}`}
                                </p>
                            </button>
                         ))}
                    </div>
                </div>

                {/* Right Panel: Data Silos */}
                <div className="flex-grow flex flex-col p-4">
                    {selectedTarget ? (
                        <>
                            {selectedTarget.isNewDiscovery && (
                                <div className="p-3 mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-yellow-300">New Source Discovered</h4>
                                        <p className="text-xs text-yellow-400">Validate this source to add it to regular monitoring.</p>
                                    </div>
                                    <button onClick={() => curatorService.validateTarget(selectedTarget.id)} className="bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded-md text-sm">Validate</button>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedTarget.name}</h3>
                                    <p className="text-sm text-slate-500">Next Scrape: {selectedTarget.nextScrape}</p>
                                </div>
                                 <button onClick={() => curatorService.removeTarget(selectedTarget.id)} className="text-xs text-red-400 hover:bg-red-500/20 p-2 rounded-md">Remove</button>
                            </div>
                            <div className="flex border-b border-slate-700">
                                {TABS.map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-white'}`}>
                                        {TAB_NAMES[tab]}
                                    </button>
                                ))}
                            </div>
                             {activeTab === 'bookList' && (
                                <div className="mt-2">
                                    <button 
                                        onClick={handleCreatePlaceholders}
                                        disabled={selectedBookIsbns.length === 0 || placeholderStatus !== 'idle'}
                                        className="w-full bg-green-700 hover:bg-green-600 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md text-sm transition"
                                    >
                                        {placeholderStatus === 'running' ? 'Processing...' : placeholderStatus === 'success' ? 'Placeholders Created!' : `Create Placeholder Listings (${selectedBookIsbns.length})`}
                                    </button>
                                </div>
                            )}
                            <div className="flex-grow bg-black/20 mt-2 rounded-md p-2 overflow-y-auto">
                                {!curatedData ? <p>Loading data...</p> : (
                                    activeTab === 'bookList' 
                                    ? <BookListTable books={curatedData.bookList} onSelectionChange={setSelectedBookIsbns} />
                                    : <pre className="whitespace-pre-wrap font-mono text-xs p-2">{JSON.stringify(curatedData[activeTab], null, 2)}</pre>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>Select a target to view its data silos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CuratorApp;
