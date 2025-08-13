// src/apps/DocumentationHub.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip } from '../components/ui/Tooltip';

interface DocumentationNode {
  id: string;
  title: string;
  content: string;
  type: 'guide' | 'api' | 'tutorial' | 'reference' | 'troubleshooting' | 'changelog';
  category: string;
  tags: string[];
  lastUpdated: Date;
  version: string;
  dependencies: string[];
  relatedComponents: string[];
  codeExamples: CodeExample[];
  agentContext: AgentDocContext;
  popularity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
}

interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  output?: string;
  dependencies: string[];
  runnable: boolean;
}

interface AgentDocContext {
  summary: string;
  keyPoints: string[];
  commonQuestions: QAExample[];
  troubleshootingSteps: TroubleshootingStep[];
  relatedTopics: string[];
}

interface QAExample {
  question: string;
  answer: string;
  confidence: number;
  context: string[];
}

interface TroubleshootingStep {
  problem: string;
  solution: string;
  code?: string;
  preventionTips: string[];
}

export const DocumentationHub: React.FC<{ windowId: string }> = ({ windowId }) => {
  const [docs, setDocs] = useState<DocumentationNode[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentationNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize with default documentation
  useEffect(() => {
    const defaultDocs = generateDefaultDocumentation();
    setDocs(defaultDocs);
    setSelectedDoc(defaultDocs[0]);
  }, []);

  const filteredDocs = useMemo(() => {
    return docs.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesType = selectedType === 'all' || doc.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [docs, searchQuery, selectedCategory, selectedType]);

  const categories = useMemo(() => {
    const cats = new Set(docs.map(doc => doc.category));
    return ['all', ...Array.from(cats)];
  }, [docs]);

  const types = useMemo(() => {
    const types = new Set(docs.map(doc => doc.type));
    return ['all', ...Array.from(types)];
  }, [docs]);

  return (
    <div className="h-full bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-700">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documentation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredDocs.map(doc => (
            <DocListItem
              key={doc.id}
              doc={doc}
              isSelected={selectedDoc?.id === doc.id}
              onClick={() => setSelectedDoc(doc)}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedDoc ? (
          <DocumentationViewer
            doc={selectedDoc}
            isEditMode={isEditMode}
            onToggleEdit={() => setIsEditMode(!isEditMode)}
            onSave={(updatedDoc) => {
              setDocs(docs.map(d => d.id === updatedDoc.id ? updatedDoc : d));
              setSelectedDoc(updatedDoc);
              setIsEditMode(false);
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a document to view
          </div>
        )}
      </div>
    </div>
  );
};

const DocListItem: React.FC<{
  doc: DocumentationNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ doc, isSelected, onClick }) => {
  const typeIcons = {
    guide: '📖',
    api: '🔌',
    tutorial: '🎓',
    reference: '📚',
    troubleshooting: '🔧',
    changelog: '📋'
  };

  const difficultyColors = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
  };

  return (
    <div
      className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800 ${
        isSelected ? 'bg-gray-800 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{typeIcons[doc.type]}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{doc.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{doc.category}</span>
            <span className={`text-xs ${difficultyColors[doc.difficulty]}`}>
              {doc.difficulty}
            </span>
            <span className="text-xs text-gray-500">{doc.estimatedReadTime}min</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {doc.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentationViewer: React.FC<{
  doc: DocumentationNode;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onSave: (doc: DocumentationNode) => void;
}> = ({ doc, isEditMode, onToggleEdit, onSave }) => {
  const [editedDoc, setEditedDoc] = useState(doc);

  useEffect(() => {
    setEditedDoc(doc);
  }, [doc]);

  const handleSave = () => {
    onSave(editedDoc);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{doc.title}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
            <span>Version: {doc.version}</span>
            <span>Updated: {doc.lastUpdated.toLocaleDateString()}</span>
            <span>Category: {doc.category}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Tooltip content="Generate AI Context">
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm">
              🤖 AI Context
            </button>
          </Tooltip>
          
          <button
            onClick={onToggleEdit}
            className={`px-3 py-1 rounded text-sm ${
              isEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isEditMode ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEditMode ? (
          <DocumentationEditor doc={editedDoc} onChange={setEditedDoc} />
        ) : (
          <DocumentationContent doc={doc} />
        )}
      </div>
    </div>
  );
};

const DocumentationContent: React.FC<{ doc: DocumentationNode }> = ({ doc }) => (
  <div className="space-y-6">
    {/* Main Content */}
    <div className="prose prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: formatContent(doc.content) }} />
    </div>

    {/* Code Examples */}
    {doc.codeExamples.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold mb-4">Code Examples</h2>
        <div className="space-y-4">
          {doc.codeExamples.map(example => (
            <CodeExampleBlock key={example.id} example={example} />
          ))}
        </div>
      </div>
    )}

    {/* Agent Context */}
    <AgentContextViewer context={doc.agentContext} />

    {/* Related Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dependencies */}
      {doc.dependencies.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Dependencies</h3>
          <div className="space-y-1">
            {doc.dependencies.map(dep => (
              <div key={dep} className="text-sm bg-gray-800 px-2 py-1 rounded">
                {dep}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Components */}
      {doc.relatedComponents.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Related Components</h3>
          <div className="space-y-1">
            {doc.relatedComponents.map(comp => (
              <div key={comp} className="text-sm bg-gray-800 px-2 py-1 rounded">
                {comp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const CodeExampleBlock: React.FC<{ example: CodeExample }> = ({ example }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div
        className="p-3 bg-gray-800 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h4 className="font-medium">{example.title}</h4>
          <p className="text-sm text-gray-400">{example.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">{example.language}</span>
          {example.runnable && (
            <Tooltip content="Run this example">
              <button className="text-green-400 hover:text-green-300">▶️</button>
            </Tooltip>
          )}
          <span>{isExpanded ? '🔽' : '▶️'}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-gray-900">
          <pre className="text-sm overflow-x-auto">
            <code className={`language-${example.language}`}>
              {example.code}
            </code>
          </pre>
          {example.output && (
            <div className="mt-4 p-3 bg-gray-800 rounded">
              <div className="text-sm text-gray-400 mb-2">Output:</div>
              <pre className="text-sm text-green-400">{example.output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AgentContextViewer: React.FC<{ context: AgentDocContext }> = ({ context }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <h3 className="font-medium mb-3 flex items-center gap-2">
      🤖 AI Agent Context
      <Tooltip content="This section provides structured information for AI agent training">
        <span className="text-gray-400">ℹ️</span>
      </Tooltip>
    </h3>
    
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-1">Summary</h4>
        <p className="text-sm text-gray-400">{context.summary}</p>
      </div>

      {/* Key Points */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-1">Key Points</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          {context.keyPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Common Questions */}
      {context.commonQuestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Common Questions</h4>
          <div className="space-y-2">
            {context.commonQuestions.map((qa, idx) => (
              <details key={idx} className="text-sm">
                <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                  {qa.question}
                </summary>
                <div className="mt-1 text-gray-400 pl-4">{qa.answer}</div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const DocumentationEditor: React.FC<{
  doc: DocumentationNode;
  onChange: (doc: DocumentationNode) => void;
}> = ({ doc, onChange }) => {
  // Implementation for editing documentation
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={doc.title}
        onChange={(e) => onChange({ ...doc, title: e.target.value })}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded"
        placeholder="Document title"
      />
      
      <textarea
        value={doc.content}
        onChange={(e) => onChange({ ...doc, content: e.target.value })}
        className="w-full h-64 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
        placeholder="Document content (Markdown supported)"
      />
      
      {/* Additional editing controls would go here */}
    </div>
  );
};

// Helper functions
function formatContent(content: string): string {
  // Convert markdown to HTML (simplified)
  return content
    .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function generateDefaultDocumentation(): DocumentationNode[] {
  return [
    {
      id: 'getting-started',
      title: 'Getting Started with RPG Reliquary UI',
      content: 'Welcome to the RPG Reliquary UI Interface...',
      type: 'guide',
      category: 'basics',
      tags: ['setup', 'installation', 'quickstart'],
      lastUpdated: new Date(),
      version: '1.0.0',
      dependencies: ['React', 'TypeScript', 'Vite'],
      relatedComponents: ['Window Manager', 'App Registry'],
      codeExamples: [],
      agentContext: {
        summary: 'Introduction guide for new users',
        keyPoints: ['Install dependencies', 'Configure environment', 'Run development server'],
        commonQuestions: [],
        troubleshootingSteps: [],
        relatedTopics: ['installation', 'setup', 'configuration']
      },
      popularity: 95,
      difficulty: 'beginner',
      estimatedReadTime: 5
    }
    // Add more default docs...
  ];
}