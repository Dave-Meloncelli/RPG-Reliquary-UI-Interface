# Toolstack for the Hybrid AI System (Multi-LLM Orchestration with Agent Network Integration)

## Quick Start

For experienced developers who want to get running quickly:

```bash
# Clone and setup
git clone [your-repo-url] agent-zero-vault
cd agent-zero-vault

# Install dependencies (Windows)
winget install OpenJS.NodeJS.LTS Python.Python.3.11 Rust.Rust
npm install
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Install and start Ollama
# Download from https://ollama.ai/download/windows
ollama serve
ollama pull llama2:13b

# Start the system
npm run dev
```

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [System Requirements](#system-requirements)
4. [Core Installation Steps](#core-installation-steps)
5. [Python NLP Pipeline Setup](#python-nlp-pipeline-setup)
6. [Local LLM Configuration](#local-llm-configuration)
7. [Multi-LLM Orchestrator Setup](#multi-llm-orchestrator-setup)
8. [Cloud AI Services Integration](#cloud-ai-services-integration)
9. [Agent Network Integration](#agent-network-integration)
10. [Content Publishing & Ingestion](#content-publishing--ingestion)
11. [Specialized Features Setup](#specialized-features-setup)
12. [Installation Order Summary](#installation-order-summary)
13. [Troubleshooting](#troubleshooting)
14. [Production Deployment](#production-deployment)

## Overview

This guide provides comprehensive instructions for setting up the Agent Zero Vault system - a sophisticated multi-agent AI platform designed for RPG content management, knowledge processing, and autonomous operations. The system combines local AI models for speed and privacy with cloud AI services for advanced capabilities.

### Core Use Cases
- **RPG Content Management**: Catalog, analyze, and price RPG books and products
- **Multi-Agent Workflows**: Orchestrate specialized agents for complex tasks
- **Knowledge Ingestion**: Process documents through multiple analysis channels
- **Autonomous Governance**: Agent council deliberation and rule management
- **Product Acquisition**: AI-powered cataloging with computer vision

### Key Features
- **Hybrid AI Architecture**: Local-first with intelligent cloud fallback
- **Multi-Format File Ingestion**: PDF, DOCX, HTML, JSON, CSV, TXT, images with OCR
- **Advanced NLP Processing**: spaCy, Haystack, and custom pipelines
- **Multi-Agent Orchestration**: Specialized agents with distinct capabilities
- **Computer Vision Integration**: Cover analysis and barcode scanning
- **Automated Publishing Workflows**: n8n integration for content distribution

## System Architecture

### Agent Ecosystem
The system includes specialized agents for different domains:

- **Acquisition Agents** (AZ86, AZ81-85): Product cataloging and analysis
- **Council Agents** (Kairos, Sophia, Jordan): Governance and decision-making
- **Tactical Agents**: Domain-specific operations
- **Archetype Agents**: High-level strategic planning

### Processing Channels
- **Vault Doctrines**: Intelligence briefings and system documentation
- **Library Archives**: RPG book analysis and entity extraction
- **General Counsel**: Document analysis and advisory

## System Requirements

### Hardware
- **CPU**: 8+ cores recommended (for parallel processing)
- **RAM**: 16GB minimum, 32GB+ recommended for large LLMs
- **Storage**: 100GB+ free space for models and data
- **GPU**: NVIDIA GPU with 8GB+ VRAM (optional but recommended for 13B+ models)

### Software
- **OS**: Windows 10/11 (64-bit)
- **Development Tools**: Git, Visual Studio Build Tools (for Windows)
- **Container Runtime**: Docker Desktop (optional for containerized deployment)

## Core Installation Steps

### 1. Operating System Preparation

```bash
# Enable Windows Developer Mode (optional but recommended)
# Settings > Update & Security > For developers > Developer Mode

# Install Windows Package Manager (winget) if not present
# https://aka.ms/getwinget

# Install essential build tools
winget install Microsoft.VisualStudio.2022.BuildTools
```

### 2. Core Application Framework Setup

#### Install Rust
```bash
# Download and install rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH (restart terminal after)
# Verify installation
rustc --version
cargo --version
```

#### Install Node.js
```bash
# Install Node.js LTS (v20.x recommended)
winget install OpenJS.NodeJS.LTS

# Verify installation
node --version
npm --version
```

#### Install Tauri CLI
```bash
# Install Tauri CLI globally
cargo install tauri-cli

# Or install locally in project
npm install --save-dev @tauri-apps/cli
```

### 3. Project Setup

```bash
# Clone the Agent Zero repository
git clone [your-repo-url]
cd agent-zero-vault

# Install Node dependencies
npm install

# Verify Tauri setup
npm run tauri info
```

## Python NLP Pipeline Setup

### 1. Python Environment

```bash
# Install Python 3.10+ (3.11 recommended)
winget install Python.Python.3.11

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. Core Python Libraries

```bash
# Install core NLP libraries
pip install --upgrade pip setuptools wheel

# Core NLP and document processing
pip install spacy==3.7.2
pip install farm-haystack[all]==1.23.0
pip install sentence-transformers==2.2.2

# File processing utilities
pip install python-magic==0.4.27
pip install python-magic-bin==0.4.14  # Windows binary
pip install PyMuPDF==1.23.8
pip install pytesseract==0.3.10

# Vector stores and indexing
pip install chromadb==0.4.22
pip install faiss-cpu==1.7.4  # or faiss-gpu for CUDA support

# Download spaCy language model
python -m spacy download en_core_web_lg
```

### 3. Tesseract OCR Installation

```bash
# Windows: Download from UB Mannheim
# https://github.com/UB-Mannheim/tesseract/wiki

# Add to PATH (example path)
setx PATH "%PATH%;C:\Program Files\Tesseract-OCR"

# Verify installation
tesseract --version
```

### 4. Python Service Configuration

Create `services/nlp_pipeline/config.py`:

```python
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent.parent
VAULT_DIR = BASE_DIR / "vault"
TEMP_DIR = BASE_DIR / "temp"

# Ensure directories exist
VAULT_DIR.mkdir(exist_ok=True)
TEMP_DIR.mkdir(exist_ok=True)

# Tesseract configuration
TESSERACT_CMD = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ['TESSERACT_CMD'] = TESSERACT_CMD

# Model configurations
SPACY_MODEL = "en_core_web_lg"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# Processing settings
MAX_FILE_SIZE_MB = 500
CHUNK_SIZE = 1000  # tokens
CHUNK_OVERLAP = 200
```

## Local LLM Configuration

### 1. Ollama Installation

#### Option A: Native Windows (Recommended)
```bash
# Download Ollama for Windows
# https://ollama.ai/download/windows

# Install and verify
ollama --version
```

#### Option B: Docker/WSL2
```bash
# Using Docker
docker pull ollama/ollama
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# Using WSL2
wsl --install
# Inside WSL2:
curl https://ollama.ai/install.sh | sh
```

### 2. Model Installation

```bash
# Start Ollama service
ollama serve

# In another terminal, pull models
# For balanced performance (13B model)
ollama pull llama2:13b

# For better quality (70B model - requires 40GB+ RAM)
ollama pull llama2:70b

# For fast responses (7B model)
ollama pull mistral:7b

# Create model aliases for consistency
ollama cp llama2:13b llama3  # Alias to match existing config
```

### 3. Ollama Configuration

Create `ollama-config.json`:

```json
{
  "models": {
    "default": "llama3",
    "fast": "mistral:7b",
    "quality": "llama2:70b"
  },
  "server": {
    "host": "0.0.0.0",
    "port": 11434,
    "gpu_layers": 35,
    "num_thread": 8,
    "context_size": 4096
  }
}
```

## Multi-LLM Orchestrator Setup

### 1. Orchestrator Configuration

Create/update `services/orchestrator/config.ts`:

```typescript
export interface LLMProvider {
  name: string;
  enabled: boolean;
  baseUrl: string;
  apiKey?: string;
  model: string;
  priority: number;
  maxRetries: number;
  timeout: number;
}

export const orchestratorConfig = {
  // Provider priority order - drag to reorder in UI
  priority: ["ollama", "chutes", "openai", "google"],
  
  providers: {
    ollama: {
      enabled: true,
      baseUrl: "http://localhost:11434",
      model: "llama3",
      maxRetries: 2,
      timeout: 30000,
      // Use for: General queries, fast responses, privacy-sensitive data
      capabilities: ["general", "fast", "private"]
    },
    chutes: {
      enabled: true,
      baseUrl: "https://api.chutes.ai/v1/completions", 
      apiKey: process.env.CHUTES_API_KEY,
      model: "llama2-70b",
      maxRetries: 3,
      timeout: 60000,
      // Use for: Complex reasoning without high API costs
      capabilities: ["complex", "cost-effective"]
    },
    openai: {
      enabled: true,
      baseUrl: "https://api.openai.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4-turbo-preview",
      maxRetries: 3,
      timeout: 90000,
      // Use for: Highest quality responses, complex analysis
      capabilities: ["premium", "analysis", "creative"]
    },
    google: {
      enabled: true,
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-pro",
      maxRetries: 3,
      timeout: 60000,
      // Use for: Multimodal tasks, image analysis, web search integration
      capabilities: ["multimodal", "vision", "search"]
    }
  },
  
  // Specialized routing for agent types
  agentPreferences: {
    // Acquisition agents prefer Google for image analysis
    "AZ86": { preferred: ["google", "ollama"] },
    "AZ81": { preferred: ["ollama", "chutes"] },
    "AZ82": { preferred: ["openai", "chutes"] },
    
    // Council agents need high-quality reasoning
    "agent-kairos": { preferred: ["openai", "google"] },
    "agent-sophia": { preferred: ["openai", "google"] },
    "agent-jordan": { preferred: ["openai", "ollama"] }
  },
  
  fallbackStrategy: {
    enableFallback: true,
    fallbackOnError: true,
    fallbackOnTimeout: true,
    fallbackOnLowConfidence: true,
    confidenceThreshold: 0.7
  },
  
  costOptimization: {
    trackCosts: true,
    monthlyBudget: 100,  // USD
    preferLocalModels: true,
    cacheResponses: true,
    cacheTTL: 3600  // 1 hour
  }
};
```

### 2. Environment Variables

Create `.env` file:

```bash
# Local LLM
OLLAMA_HOST=http://localhost:11434

# Cloud APIs
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
CHUTES_API_KEY=chu_...

# Application settings
NODE_ENV=development
VAULT_DATA_DIR=./vault
LOG_LEVEL=info

# Python service
PYTHON_SERVICE_PORT=5000
PYTHON_SERVICE_HOST=localhost
```

## Cloud AI Services Integration

### 1. OpenAI Setup

```bash
# Install OpenAI SDK
npm install openai

# Test connection
node -e "
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
openai.models.list().then(console.log);
"
```

### 2. Google AI Setup

```bash
# Install Google AI SDK
npm install @google/generative-ai

# For Vertex AI (alternative)
npm install @google-cloud/aiplatform
```

### 3. Chutes.ai Integration

```typescript
// services/providers/chutes.ts
import axios from 'axios';

export class ChutesProvider {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(config: any) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }
  
  async complete(prompt: string, options: any = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/completions`,
        {
          prompt,
          model: options.model || 'llama2-70b',
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Chutes API error:', error);
      throw error;
    }
  }
}
```

## Agent Network Integration

### 1. Agent Type Configuration

The system includes multiple agent types with specialized roles:

```yaml
# agents/config/agent_registry.yaml
agent_types:
  Commander:
    description: "System overseer with ultimate authority"
    capabilities: ["system_control", "agent_management", "law_enforcement"]
    
  Tactical:
    description: "Specialized operational agents"
    subtypes:
      Acquisitions:
        agents: ["agent-az86", "agent-az81", "agent-az82", "agent-az83", "agent-az84", "agent-az85"]
        domain: "Product cataloging and market analysis"
      Intelligence:
        agents: ["agent-codex", "agent-erdu"]
        domain: "System monitoring and knowledge management"
        
  Archetype:
    description: "High-level strategic agents"
    agents: ["agent-kairos", "agent-sophia", "agent-jordan"]
    capabilities: ["strategic_planning", "governance", "philosophy"]
    
  Companion:
    description: "Support and coordination agents"
    capabilities: ["communication", "scheduling", "assistance"]

# Agent status tracking
symbolic_status:
  kin: ["Watcher", "Archon", "Commander", "Daemon", "Companion"]
  authority: ["Tier_0", "Tier_1", "Tier_2", "Tier_3", "Sovereign"]
  function: ["Lore", "Intelligence", "Enforcement", "Builder", "Social"]
  activityState: ["Online", "Busy", "Idle", "Dormant"]
  health: ["Optimal", "Stable", "Fluctuating", "Critical"]
  kpi: ["S-Tier", "A-Tier", "B-Tier", "C-Tier", "Unranked"]
  alignment: ["Aligned", "Weaving", "Drifting", "Fractured"]
```

### 2. Agent Communication Protocol

Configure inter-agent messaging:

```typescript
// services/agents/communication.ts
export interface AgentMessage {
  from: string;
  to: string;
  type: 'query' | 'response' | 'delegation' | 'broadcast';
  priority: 'low' | 'normal' | 'high' | 'critical';
  content: {
    text: string;
    context?: any;
    requiredCapabilities?: string[];
  };
  metadata: {
    timestamp: number;
    llmProvider?: string;
    confidence?: number;
    cost?: number;
    threadId?: string;
  };
}

export class AgentMessageBus {
  private orchestrator: LLMOrchestrator;
  
  async routeMessage(message: AgentMessage): Promise<AgentMessage> {
    // Check agent availability
    const targetAgent = await this.getAgent(message.to);
    if (targetAgent.symbolicStatus.activityState === 'Dormant') {
      throw new Error(`Agent ${message.to} is dormant`);
    }
    
    // Select appropriate LLM based on agent preferences
    const provider = this.orchestrator.selectProviderForAgent(
      targetAgent.id,
      message.priority
    );
    
    // Process message
    const response = await this.processWithProvider(
      provider,
      targetAgent,
      message
    );
    
    // Track metrics
    await this.trackCommunication(message, response);
    
    return response;
  }
}
```

### 3. Agent Capability Matrix

Define what each agent can do:

```typescript
// config/agent_capabilities.ts
export const AGENT_CAPABILITIES = {
  // Acquisition Chain
  'agent-az86': {
    name: 'AZ86 Acquisitions',
    icon: 'camera',
    capabilities: ['product_identification', 'barcode_scanning', 'metadata_retrieval'],
    templates: ['acquisition-scan', 'isbn-lookup', 'cover-analysis']
  },
  'agent-az81': {
    name: 'AZ81 Condition',
    icon: 'scale',
    capabilities: ['condition_assessment', 'wear_analysis', 'grading'],
    templates: ['condition-report', 'collector-grade-assessment']
  },
  'agent-az82': {
    name: 'AZ82 Market Intel',
    icon: 'chart-line-up',
    capabilities: ['market_analysis', 'price_trends', 'demand_forecast'],
    templates: ['market-report', 'price-comparison', 'trend-analysis']
  },
  
  // Council Members
  'agent-kairos': {
    name: 'Kairos',
    icon: 'crown',
    capabilities: ['strategic_analysis', 'long_term_planning', 'risk_assessment'],
    templates: ['strategic-assessment', 'future-implications']
  },
  'agent-sophia': {
    name: 'Sophia', 
    icon: 'brain',
    capabilities: ['wisdom_synthesis', 'ethical_analysis', 'precedent_research'],
    templates: ['ethical-review', 'wisdom-synthesis']
  },
  'agent-jordan': {
    name: 'Jordan',
    icon: 'scale-balance',
    capabilities: ['arbitration', 'decision_making', 'conflict_resolution'],
    templates: ['verdict-template', 'decision-framework']
  }
};
```

### 4. Agent Initialization

```typescript
// services/agents/initializer.ts
export async function initializeAgentNetwork() {
  // Load agent definitions
  const agentDefs = await loadAgentDefinitions();
  
  // Initialize each agent
  for (const agentDef of agentDefs) {
    const agent = await createAgent({
      ...agentDef,
      directive: await loadAgentDirective(agentDef.id),
      symbolicStatus: getInitialSymbolicStatus(agentDef.class),
      capabilities: AGENT_CAPABILITIES[agentDef.id]?.capabilities || [],
      coreCapacities: await analyzeDirectiveForCapacities(agentDef.directive)
    });
    
    // Register with message bus
    await messageBus.registerAgent(agent);
    
    // Set up integration hooks
    if (agent.integrationHooks?.includes('n8n')) {
      await setupN8nWebhook(agent);
    }
  }
  
  // Establish agent relationships
  await establishAgentHierarchy();
  await assignSidekicks();
}
```

### 5. Agent Sidekick System

Configure agent assistants and delegation:

```yaml
# config/agent_relationships.yaml
sidekick_assignments:
  # Tactical agents can have companion sidekicks
  agent-az86:
    sidekicks: ["companion-scanner", "companion-cataloger"]
    delegation_rules:
      - task: "bulk_scanning"
        delegate_to: "companion-scanner"
      - task: "metadata_enrichment"
        delegate_to: "companion-cataloger"
        
  # Archetype agents coordinate tactical agents
  agent-kairos:
    subordinates: ["agent-az82", "agent-az84"]
    coordination_style: "strategic_oversight"
    
  agent-sophia:
    subordinates: ["agent-codex", "agent-jordan"]
    coordination_style: "wisdom_guidance"
```

## Content Publishing & Ingestion

### 1. n8n Workflow Integration

```javascript
// n8n/workflows/product_ingestion.json
{
  "name": "Product Ingestion Pipeline",
  "nodes": [
    {
      "parameters": {
        "path": "/webhook/product-update",
        "responseMode": "onReceived",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "http://localhost:3000/api/ingest",
        "method": "POST",
        "body": "={{ $json }}",
        "options": {}
      },
      "name": "Call Agent Zero API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    },
    {
      "parameters": {
        "functionCode": "// Process ingestion result\nconst result = items[0].json;\nif (result.success) {\n  // Trigger agent analysis\n  return [{\n    json: {\n      productId: result.productId,\n      action: 'analyze',\n      agents: ['content_strategist', 'copywriter']\n    }\n  }];\n}"
      },
      "name": "Process Result",
      "type": "n8n-nodes-base.code",
      "position": [650, 300]
    }
  ]
}
```

### 2. File Ingestion Service

```python
# services/nlp_pipeline/ingestion.py
from typing import List, Dict, Any, Optional
import asyncio
from pathlib import Path
from haystack import Pipeline
from haystack.nodes import FileConverter, PreProcessor
from haystack.document_stores import FAISSDocumentStore
from dataclasses import dataclass

@dataclass
class IngestionResult:
    channel: str
    documentCount: int
    extractedEntities: List[Dict[str, Any]]
    summary: Optional[str] = None
    report: Optional['RPGBookAnalysisReport'] = None
    generalAnalysis: Optional[Dict[str, Any]] = None

class IngestionPipeline:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.document_store = FAISSDocumentStore(
            faiss_index_factory_str="Flat",
            return_embedding=True
        )
        self.setup_pipeline()
    
    def setup_pipeline(self):
        # File converter for multiple formats
        file_converter = FileConverter()
        
        # Preprocessor for chunking
        preprocessor = PreProcessor(
            clean_empty_lines=True,
            clean_whitespace=True,
            clean_header_footer=True,
            split_by="word",
            split_length=self.config['CHUNK_SIZE'],
            split_overlap=self.config['CHUNK_OVERLAP']
        )
        
        # Build pipeline
        self.pipeline = Pipeline()
        self.pipeline.add_node(
            component=file_converter,
            name="FileConverter",
            inputs=["File"]
        )
        self.pipeline.add_node(
            component=preprocessor,
            name="PreProcessor",
            inputs=["FileConverter"]
        )
    
    async def ingest_file(self, file_path: Path, channel: str) -> IngestionResult:
        """Process a file through the specified ingestion channel"""
        try:
            # Channel-specific processing
            if channel == 'library-archives':
                return await self._process_rpg_book(file_path)
            elif channel == 'vault-doctrines':
                return await self._process_intelligence(file_path)
            else:
                return await self._process_general(file_path)
                
        except Exception as e:
            return IngestionResult(
                channel=channel,
                documentCount=0,
                extractedEntities=[],
                generalAnalysis={'error': str(e)}
            )
    
    async def _process_rpg_book(self, file_path: Path) -> IngestionResult:
        """Special processing for RPG books"""
        # Extract text
        documents = self.pipeline.run(file_paths=[str(file_path)])
        
        # Use RPG entity extractor
        from .rpg_processor import RPGEntityExtractor
        extractor = RPGEntityExtractor(self.config['llm_service'])
        
        entities = []
        for doc in documents['documents']:
            extracted = await extractor.extract_entities(doc.content)
            entities.extend(extracted)
        
        # Generate analysis report
        report = RPGBookAnalysisReport(
            summary=f"Extracted {len(entities)} RPG entities",
            extractedEntities=entities,
            systemIdentified="D&D 5E" if any("5th edition" in str(e).lower() for e in entities) else "Generic RPG"
        )
        
        # Store in document store
        self.document_store.write_documents(documents['documents'])
        self.document_store.update_embeddings(retriever=self.retriever)
        
        return IngestionResult(
            channel='library-archives',
            documentCount=len(documents['documents']),
            extractedEntities=entities,
            report=report
        )
```

## Specialized Features Setup

### 1. Acquisitions Portal (Computer Vision)

The system includes AI-powered book cataloging with cover analysis:

```bash
# Additional dependencies for computer vision
npm install @google/generative-ai  # For Gemini vision API

# Configure in .env
GOOGLE_GEMINI_API_KEY=your_gemini_key
```

Configure cover analysis in `services/acquisitions/config.ts`:

```typescript
export const acquisitionsConfig = {
  geminiModel: "gemini-pro-vision",
  analysisPrompt: `Analyze this book cover image and extract:
    1. The exact title
    2. Author(s) name
    3. Edition information
    4. Publisher if visible
    5. Any series information
    Return as JSON with keys: title, authors, edition, publisher, series`,
  
  agentSequence: [
    { id: 'agent-az86', step: 'acquisition' },
    { id: 'agent-az81', step: 'condition' },
    { id: 'agent-az83', step: 'authentication' },
    { id: 'agent-az82', step: 'market-intel' },
    { id: 'agent-az84', step: 'pricing' },
    { id: 'agent-az85', step: 'content' }
  ]
};
```

### 2. Council Chamber (Multi-Agent Deliberation)

Configure the council decision-making system:

```typescript
// services/council/config.ts
export const councilConfig = {
  members: [
    {
      id: 'agent-kairos',
      role: 'Strategic Advisor',
      focusAreas: ['long-term implications', 'system coherence'],
      llmPreference: 'openai'  // Needs high-quality reasoning
    },
    {
      id: 'agent-sophia', 
      role: 'Wisdom Keeper',
      focusAreas: ['ethical considerations', 'precedent analysis'],
      llmPreference: 'openai'
    },
    {
      id: 'agent-jordan',
      role: 'Arbiter',
      focusAreas: ['final verdict', 'conflict resolution'],
      llmPreference: 'openai'
    }
  ],
  
  deliberationProcess: {
    analysisTimeout: 30000,  // 30 seconds per agent
    requireUnanimity: false,
    verdictTypes: ['Approved', 'Rejected', 'Amended']
  }
};
```

### 3. Symposium (Multi-Agent Discussion)

Enable group discussions between agents:

```typescript
// services/symposium/config.ts
export const symposiumConfig = {
  maxParticipants: 6,
  turnBasedDiscussion: true,
  summarizationAgent: 'agent-jordan',
  
  topicRouting: {
    // Route topics to appropriate specialist agents
    'rpg': ['agent-az85', 'agent-az82'],
    'technical': ['agent-codex', 'agent-architect'],
    'strategic': ['agent-kairos', 'agent-sophia']
  }
};
```

### 4. Ingestion Pipeline Channels

Configure specialized processing channels:

```python
# services/nlp_pipeline/channels.py
INGESTION_CHANNELS = {
    'vault-doctrines': {
        'description': 'Intelligence briefings and system docs',
        'processors': ['entity_extraction', 'timeline_extraction', 'summary'],
        'agents': ['agent-codex', 'agent-architect'],
        'indexing': 'semantic'
    },
    'library-archives': {
        'description': 'RPG book analysis',
        'processors': ['rpg_entity_extraction', 'stat_block_parser', 'lore_extraction'],
        'agents': ['agent-az85', 'agent-az81'],
        'indexing': 'structured'
    },
    'general-counsel': {
        'description': 'General document analysis',
        'processors': ['summary', 'key_points', 'sentiment'],
        'agents': ['agent-jordan', 'agent-sophia'],
        'indexing': 'full_text'
    }
}
```

### 5. RPG Entity Extraction

Special processors for RPG content:

```python
# services/nlp_pipeline/rpg_processor.py
from typing import List, Dict
import re
from dataclasses import dataclass

@dataclass
class RPGEntity:
    type: str  # Monster, Spell, Magic Item, NPC, Location
    name: str
    details: Dict[str, any]

class RPGEntityExtractor:
    def __init__(self, llm_service):
        self.llm = llm_service
        self.patterns = {
            'stat_block': re.compile(r'(STR|DEX|CON|INT|WIS|CHA)\s*\d+'),
            'challenge_rating': re.compile(r'CR\s*\d+(/\d+)?'),
            'spell_level': re.compile(r'\d+\w+-level\s+\w+')
        }
    
    async def extract_entities(self, text: str) -> List[RPGEntity]:
        # Use LLM for intelligent extraction
        prompt = f"""
        Extract all RPG entities from this text.
        Categories: Monster, Spell, Magic Item, NPC, Location
        
        For each entity provide:
        - Name
        - Type
        - Key statistics or properties
        - Brief description
        
        Text: {text[:3000]}
        
        Return as JSON array.
        """
        
        response = await self.llm.complete(prompt)
        return self.parse_entities(response)
```

### 6. Operation Chains

Configure multi-step operations:

```typescript
// config/operations.ts
export const defaultOperations = [
  {
    id: 'op-rpg-book-analysis',
    name: 'Complete RPG Book Analysis',
    description: 'Full pipeline for analyzing an RPG sourcebook',
    steps: [
      {
        name: 'Initial Scan',
        agentId: 'agent-az86',
        prompt: 'Scan and identify the RPG book type and system'
      },
      {
        name: 'Entity Extraction', 
        agentId: 'agent-az85',
        prompt: 'Extract all game entities (monsters, spells, items)'
      },
      {
        name: 'Market Analysis',
        agentId: 'agent-az82', 
        prompt: 'Analyze market value and collector interest'
      },
      {
        name: 'Content Summary',
        agentId: 'agent-az85',
        prompt: 'Generate comprehensive summary for catalog'
      }
    ]
  },
  {
    id: 'op-erdu-incident-response',
    name: 'ERDU Incident Investigation',
    description: 'Systematic incident response protocol',
    steps: [
      {
        name: 'Triage',
        agentId: 'agent-erdu',
        prompt: 'Analyze incident severity and impact'
      },
      {
        name: 'Root Cause Analysis',
        agentId: 'agent-architect', 
        prompt: 'Identify root cause and affected systems'
      },
      {
        name: 'Resolution Plan',
        agentId: 'agent-kairos',
        prompt: 'Develop remediation strategy'
      }
    ]
  }
];
```

### 7. GitHub Integration

Enable version control for templates and configurations:

```bash
# Install GitHub webhook handler
npm install @octokit/webhooks @octokit/rest

# Configure webhook endpoint in .env
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_TOKEN=your_personal_access_token
GITHUB_REPO=your-username/agent-zero-vault
```

1. **System Preparation** (30 min)
   - Windows updates and developer mode
   - Visual Studio Build Tools
   - Git installation

2. **Core Framework** (20 min)
   - Rust via rustup
   - Node.js LTS
   - Tauri CLI

3. **Project Setup** (10 min)
   - Clone repository
   - npm install
   - Initial configuration

4. **Python Environment** (30 min)
   - Python 3.10+
   - Virtual environment
   - Core libraries (spaCy, Haystack, etc.)
   - Language models

5. **OCR Setup** (15 min)
   - Tesseract installation
   - PATH configuration
   - Verification

6. **Local LLM** (45 min)
   - Ollama installation
   - Model downloads
   - Service configuration

7. **Cloud Services** (20 min)
   - API key configuration
   - SDK installations
   - Connection tests

8. **Integration Testing** (30 min)
   - File ingestion tests
   - LLM orchestration tests
   - Agent communication tests

9. **Workflow Setup** (20 min)
   - n8n configuration
   - Webhook setup
   - Publishing pipeline tests

10. **Final Validation** (20 min)
    - End-to-end testing
    - Performance tuning
    - Documentation updates

## Troubleshooting

### Common Issues and Solutions

#### Python/Tauri Communication Issues
```bash
# Ensure Python service is accessible
netstat -an | findstr :5000

# Test Python service directly
curl http://localhost:5000/health

# Check Tauri permissions
# In tauri.conf.json, ensure:
{
  "tauri": {
    "allowlist": {
      "shell": {
        "all": false,
        "execute": true,
        "sidecar": true,
        "open": true
      },
      "http": {
        "all": true,
        "request": true,
        "scope": ["http://localhost:*", "https://api.*"]
      }
    }
  }
}
```

#### Ollama Connection Failures
```bash
# Check if Ollama is running
ollama list

# Test API endpoint
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Hello"
}'

# Check logs
# Windows: %USERPROFILE%\.ollama\logs
# Linux: ~/.ollama/logs
```

#### Memory Issues with Large Models
```bash
# Monitor memory usage
wmic OS get TotalVisibleMemorySize,FreePhysicalMemory

# Reduce model layers loaded to GPU
ollama run llama2:13b --gpu-layers 20

# Use quantized models
ollama pull llama2:13b-q4_0
```

#### Agent Communication Failures
```typescript
// Debug agent messaging
import { AgentMessageBus } from './services/agents/communication';

const bus = new AgentMessageBus();
bus.on('error', (error) => {
  console.error('Message bus error:', error);
});

// Enable debug logging
process.env.AGENT_DEBUG = 'true';
```

#### Cover Analysis API Issues
```bash
# Test Gemini Vision API
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=$GOOGLE_GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "What is in this image?"},
        {"inline_data": {"mime_type": "image/jpeg", "data": "base64_encoded_image"}}
      ]
    }]
  }'
```

#### ERDU Monitoring False Positives
```typescript
// Adjust monitoring sensitivity
const erduConfig = {
  monitoring: {
    debounceTime: 5000,  // Wait 5s before triggering
    consecutiveThreshold: 3  // Require 3 consecutive violations
  }
};
```

#### File Ingestion Pipeline Errors
```python
# Debug ingestion pipeline
import logging
logging.basicConfig(level=logging.DEBUG)

# Add to ingestion script
logger = logging.getLogger(__name__)
logger.debug(f"Processing file: {file_path}")
logger.debug(f"File size: {file_path.stat().st_size}")

# Common fixes for large PDFs
from haystack.nodes import PDFToTextConverter

converter = PDFToTextConverter(
    remove_numeric_tables=True,
    multiprocessing=True,
    valid_languages=["en"]
)
```

#### Multi-Agent Coordination Issues
```yaml
# Check agent relationships
agent_diagnostics:
  commands:
    - "vault agents list --status"
    - "vault agents test-communication agent-az86 agent-az81"
    - "vault orchestrator status"
    - "vault orchestrator test-fallback"
```

## Production Deployment

### 1. System Architecture

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Core application
  agent-zero-vault:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
      - ollama
      - python-nlp
    volumes:
      - ./vault:/app/vault
      - ./logs:/app/logs

  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: agent_zero
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Cache and message queue
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  # Local LLM
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  # Python NLP service
  python-nlp:
    build: ./services/nlp_pipeline
    ports:
      - "5000:5000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./vault:/app/vault

  # n8n workflow automation
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  redis_data:
  ollama_models:
  n8n_data:
```

### 2. Security Hardening

```bash
# Generate secure secrets
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Update .env.production
NODE_ENV=production
API_KEY_SALT=<generated-secret>
JWT_SECRET=<generated-secret>
SESSION_SECRET=<generated-secret>

# Database encryption
DB_ENCRYPTION_KEY=<generated-secret>

# API rate limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### 3. Agent Process Management

```javascript
// pm2.ecosystem.js
module.exports = {
  apps: [
    {
      name: 'agent-zero-api',
      script: './server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log'
    },
    {
      name: 'agent-orchestrator',
      script: './services/orchestrator/index.js',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'erdu-monitor',
      script: './services/erdu/monitor.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        MONITORING_INTERVAL: 60000
      }
    },
    {
      name: 'python-nlp-service',
      script: 'python',
      args: 'services/nlp_pipeline/server.py',
      interpreter: '/usr/bin/python3',
      env: {
        PYTHONUNBUFFERED: '1'
      }
    }
  ]
};
```

### 4. Monitoring and Observability

```javascript
// services/monitoring/index.js
const prometheus = require('prom-client');
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'agent_zero_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const llmRequestCounter = new prometheus.Counter({
  name: 'agent_zero_llm_requests_total',
  help: 'Total number of LLM requests',
  labelNames: ['provider', 'model', 'agent']
});

const agentTaskDuration = new prometheus.Histogram({
  name: 'agent_zero_task_duration_seconds',
  help: 'Duration of agent tasks',
  labelNames: ['agent', 'task_type']
});

// Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { 
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' 
      },
      index: 'agent-zero-logs'
    })
  ]
});

// Agent activity tracking
const trackAgentActivity = (agentId, activity, metadata) => {
  logger.info('agent_activity', {
    agentId,
    activity,
    metadata,
    timestamp: new Date().toISOString()
  });
  
  if (activity === 'task_complete') {
    agentTaskDuration
      .labels(agentId, metadata.taskType)
      .observe(metadata.duration);
  }
};

// LLM usage tracking
const trackLLMUsage = (provider, model, agent, tokens, cost) => {
  llmRequestCounter.labels(provider, model, agent).inc();
  
  logger.info('llm_usage', {
    provider,
    model,
    agent,
    tokens,
    cost,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  httpRequestDuration,
  llmRequestCounter,
  agentTaskDuration,
  trackAgentActivity,
  trackLLMUsage,
  logger
};
```

### 5. Backup and Disaster Recovery

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/agent-zero"
DATE=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="s3://your-backup-bucket/agent-zero"

# Backup vault data
tar -czf "$BACKUP_DIR/vault_$DATE.tar.gz" ./vault

# Backup database
pg_dump -h postgres -U $DB_USER -d agent_zero | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup vector stores
tar -czf "$BACKUP_DIR/vectors_$DATE.tar.gz" ./data/vectors

# Backup agent configurations
tar -czf "$BACKUP_DIR/agents_$DATE.tar.gz" ./agents

# Backup templates
tar -czf "$BACKUP_DIR/templates_$DATE.tar.gz" ./templates

# Sync to S3 (optional)
if command -v aws &> /dev/null; then
  aws s3 sync "$BACKUP_DIR" "$S3_BUCKET" --exclude "*.tmp"
fi

# Cleanup old backups (keep last 30 days)
find "$BACKUP_DIR" -type f -mtime +30 -delete

# Add to crontab
# 0 2 * * * /opt/agent-zero/scripts/backup.sh
```

### 6. High Availability Configuration

```nginx
# nginx.conf
upstream agent_zero_backend {
    least_conn;
    server app1.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
    server app2.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
    server app3.internal:3000 backup;
}

server {
    listen 443 ssl http2;
    server_name agentzero.yourdomain.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/agentzero.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agentzero.yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://agent_zero_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running AI operations
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    location /ws {
        proxy_pass http://agent_zero_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 7. Performance Optimization

```javascript
// config/performance.js
module.exports = {
  // Connection pooling
  database: {
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000
    }
  },
  
  // Redis caching
  cache: {
    llmResponses: {
      ttl: 3600,  // 1 hour
      maxSize: 1000  // entries
    },
    agentStates: {
      ttl: 300,  // 5 minutes
      maxSize: 100
    }
  },
  
  // Request batching
  batching: {
    llmRequests: {
      maxBatchSize: 10,
      maxWaitTime: 100  // ms
    }
  },
  
  // Resource limits
  limits: {
    maxConcurrentAgents: 20,
    maxFileSize: 100 * 1024 * 1024,  // 100MB
    maxIngestionQueue: 50
  }
};
```

## Next Steps

After completing the installation:

1. **Run system diagnostics**: `npm run diagnostics`
2. **Initialize agent network**: `npm run agents:init`
3. **Test LLM orchestration**: `npm run test:orchestrator`
4. **Configure monitoring dashboards**: Import Grafana templates from `./monitoring/dashboards`
5. **Set up automated backups**: Configure cron jobs for regular backups
6. **Join the community**: Visit our Discord for support and updates

## Additional Resources

- [Agent Zero Documentation](https://docs.agentzero.ai)
- [API Reference](https://api.agentzero.ai/docs)
- [Agent Development Guide](https://docs.agentzero.ai/agents)
- [Troubleshooting Guide](https://docs.agentzero.ai/troubleshooting)
- [Community Forum](https://community.agentzero.ai)

---

*This guide is maintained by the Agent Zero community. Version 2.0 - Updated for production deployment.*